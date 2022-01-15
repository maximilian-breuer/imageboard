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

  // gets all images
  const listAll = (callback: (images: Images) => void) => {
    imagesCollection.find({}).toArray((err, array) => {
      if (err || !array) throw err;
      callback(array as unknown as Images);
    });
  };

  // gets all images found by query
  const listAllByQuery = (query: Tags, callback: (images: Images) => void) => {
    imagesCollection.find({ tags: { $in: query } }).toArray((err, array) => {
      if (err) throw err;
      callback(array as unknown as Images);
    });
  };

  // creates an image
  const create = (image: Image, callback: (id: ObjectId) => void) => {
    imagesCollection.insertOne(image, (err, img) => {
      if (err || !img) throw err;
      callback(img.insertedId);
    });
  };

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

  return { listAll, listAllByQuery, create, updateTags };
}
