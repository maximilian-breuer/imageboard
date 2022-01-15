import express, { NextFunction, Request, Response } from "express";
import { ObjectId } from "mongodb";
import Image from "../models/image";
import { Images, Tags } from "../models/types";

const router = express.Router();

// searchs for all images including at least one tag of the passed tags array
// get should include "tags":[string]
router.get("/", (req: Request, res: Response, next: NextFunction) => {
  if (Object.keys(req.query).length === 0) {
    // no tags query is specified, proceed with the next matching route
    next();
    return;
  }

  try {
    // reconstruct array from params string
    const query = JSON.parse(req.query.tags as string) as Tags;

    req.services.images.listAllByQuery(query, (array) => {
      res.json(array);
    });
  } catch (e) {
    res.status(400).send("Bad Request: not a valid tags query");
    return;
  }
});

router.get("/", (req: Request, res: Response) => {
  req.services.images.listAll((array: Images) => {
    res.json(array);
  });
});

// post should include "source": string, "tags":[string]
router.post("/", (req: Request, res: Response) => {
  const image = new Image(req.body.source, req.body.tags, new Date());
  req.services.images.create(image, (id) => {
    res.setHeader("ImageId", id.toString());
    res.status(201).send("Created");
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

export default router;
