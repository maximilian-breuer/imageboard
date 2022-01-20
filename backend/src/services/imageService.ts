import { Collection, Document, ObjectId } from "mongodb";
import DBManager from "./DBManager";
import { Images, Tags } from "../models/types";
import Image from "../models/image";

let db, imagesCollection: Collection<Document>;

export default function imagesService(dbURL: string) {
  DBManager.getConnection(dbURL, (database) => {
    db = database;
    imagesCollection = db?.collection("images");
  });

  // gets a maximum of 'number' images of the most recent ones that are at least as old as 'startTime' (sorted w.r.t. upload date)
  const listAll = (startTime: number, limit: number, callback: (images: Images) => void) => {
    imagesCollection.find({ uploaded: { $lte: new Date(startTime)} }).sort({ uploaded: -1 }).limit(limit).toArray((err, array) => {
      if (err || !array) throw err;
      callback(array as unknown as Images);
    });
  };

  // gets a maximum of 'number' images of the most recent ones that are at least as old as 'startTime' (sorted w.r.t. upload date)
  // and include at least one tag of the passed tags array
  const listAllByQuery = (filterTags: Tags, startTime: number, limit: number, callback: (images: Images) => void) => {
    imagesCollection.find({ tags: { $all: filterTags }, uploaded: { $lte: new Date(startTime)} }).sort({ uploaded: -1 }).limit(limit).toArray((err, array) => {
      if (err || !array) throw err;
      callback(array as unknown as Images);
    });
  };

  // creates an image
  const create = (image: Image, callback: (id: ObjectId) => void) => {
    // sort tags alphabetically based on content and remove duplicates
    image.tags = image.tags.sort((el1, el2) => {
      if(el1.content > el2.content)
        return 1;
      else
        return -1;
    }).filter((el, ind, array) => {
      return (ind == 0) || el.content != array[ind - 1].content;
    }) as Tags;

    imagesCollection.insertOne(image,
      (err, img) => {
        if (err || !img) throw err;
        callback(img.insertedId);
      }
    );
  };

  // deletes an image
  const remove = (id: ObjectId) => {
    imagesCollection.deleteOne(
      { _id: id},
      (err, img) => {
        if (err || !img) throw err;
      }
    );
  }

  // updates tags of an image
  const updateTags = (
    id: ObjectId,
    tags: Tags,
    callback: (id: number) => void
  ) => {
    imagesCollection.updateOne(
      { _id: id },
      { $set: { tags: tags } },
      (err, img) => {
        if (err || !img) throw err;
        callback(img.matchedCount);
      }
    );
  };

  return { listAll, listAllByQuery, create, remove, updateTags };
}
