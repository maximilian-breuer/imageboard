import express, { NextFunction, Request, Response } from "express";
import { ObjectId } from "mongodb";
import Image, { convertTagsToStrings } from "../models/image";
import { Images, Tags } from "../models/types";
import fs from "fs";
import sharp from "sharp";
import Tag from "../models/tag";

const router = express.Router();

// searchs for a maximum of 'number' images of the most recent ones that are at least as old as 'startTime' (sorted w.r.t. upload date)
// and include all tags of the passed tags array
// get should include 'tags'=[tags], 'startTime'=startTime in ms and 'limit'=limit
router.get("/", (req: Request, res: Response, next: NextFunction) => {
  if (Object.keys(req.query).length === 2) {
    // no tags query is specified, proceed with the next matching route
    next();
    return;
  }

  try {
    // reconstruct array from params string
    const filterTags = JSON.parse(req.query.tags as string) as Tags;

    req.services.images.listAllByQuery(
      filterTags,
      parseInt(req.query.startTime as string),
      parseInt(req.query.limit as string),
      (array: Images) => {
        res.json(convertTagsToStrings(array));
      }
    );
  } catch (e) {
    res.status(400).send("Bad Request: queries not valid");
    return;
  }
});

// searchs for a maximum of 'number' images of the most recent ones that are at least as old as 'startTime' (sorted w.r.t. upload date)
// get should include 'startTime'=startTime in ms and 'limit'=limit
router.get("/", (req: Request, res: Response) => {
  try {
    req.services.images.listAll(
      parseInt(req.query.startTime as string),
      parseInt(req.query.limit as string),
      (array: Images) => {
        res.json(convertTagsToStrings(array));
      }
    );
  } catch (e) {
    res.status(400).send("Bad Request: queries not valid");
  }
});

// post should include "source": string, "tags":[string]
router.post("/", (req: Request, res: Response) => {
  // create database entry and store image

  // preprocessing to generate a valid array with tags from array of strings
  // eslint-disable-next-line prefer-const
  let tags: Tags = [] as unknown as Tags;
  for (let i = 0; i < req.body.tags.length; i++) {
    // eslint-disable-next-line prefer-const
    let tag = new Tag(req.body.tags[i]);
    tags.push(tag);
  }

  const image = new Image(tags, new Date());
  const image_array = req.body.source.split(";base64,");
  req.services.images.create(image, (id) => {
    try {
      // convert base64 string into two files (original and thumbnail) and store them
      const img_base64 = req.body.source.split(";base64,")[1];
      const imgBuffer = Buffer.from(img_base64, "base64");
      let file_err = null;

      // prepare dir for images
      const imageDir = "./images";
      if (!fs.existsSync(imageDir)) fs.mkdirSync(imageDir);

      const filePath: string = imageDir + "/" + id.toString();
      // original image
      sharp(imgBuffer).toFile(filePath, (err, info) => {
        if (err) console.log(err);
      });
      // compresssion based on image type
      if (image_array[0].toLowerCase() == "data:image/png") {
        sharp(imgBuffer)
          .png({ quality: 25 })
          .toFile(filePath + "_small", (err, info) => {
            if (err) file_err = err;
          });
      } else if (
        image_array[0].toLowerCase() == "data:image/jpg" ||
        image_array[0].toLowerCase() == "data:image/jpeg"
      ) {
        sharp(imgBuffer)
          .jpeg({ quality: 25 })
          .toFile(filePath + "_small", (err, info) => {
            if (err) file_err = err;
          });
      } else
        sharp(imgBuffer).toFile(filePath + "_small", (err, info) => {
          if (err) file_err = err;
        });
      // send response
      if (file_err) {
        res.status(400).send("Bad Request: not a valid image");
      } else {
        res.setHeader("ImageId", id.toString());
        res.status(201).send("Created");
      }
    } catch (err) {
      if (err) res.status(400).send("Bad Request: not a valid image");
    }
  });
});

// put should include "tags":[string]
router.put("/:id", (req: Request, res: Response) => {
  try {
    const id = new ObjectId(req.params.id);
    const tags = req.body.tags;

    req.services.images.updateTags(id, tags, (id) => {
      res.setHeader("UpdatedImages", id);
      res.status(201).send("Updated");
    });
  } catch (e) {
    res.status(400).send("Bad Request: not a valid image id");
    return;
  }
});

// deletes the first image found with the query id if one exists
router.delete("/:id", (req: Request, res: Response) => {
  try {
    // remove image from database
    const id = new ObjectId(req.params.id);
    req.services.images.remove(id);
    // remove both images (original and thumbnail) from file system
    let file_err = null;
    fs.unlink("./src/images/" + req.params.id, (err) => {
      if (err) {
        file_err = err;
      }
    });
    fs.unlink("./src/images/" + req.params.id + "_small", (err) => {
      if (err) {
        file_err = err;
      }
    });
    // send response
    if (file_err) {
      res.status(400).send("Bad Request: not a valid image id");
    } else {
      res.setHeader("DeletedImage", id.toString());
      res.status(200).send("Deleted");
    }
  } catch (e) {
    res.status(400).send("Bad Request: not a valid image id");
  }
});

export default router;
