import { Tags } from "./types";
import { ObjectId } from "mongodb";

export default class Image {
  source: string;
  tags: Tags;
  uploaded: Date;
  _id?: ObjectId;

  constructor(source: string, tags: Tags, uploaded: Date, _id?: ObjectId) {
    this.source = source;
    this.tags = tags;
    this.uploaded = uploaded;
    this._id = _id;
  }
}
