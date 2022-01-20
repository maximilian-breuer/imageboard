import { Tags } from "./types";

export default class Image {
  tags: Tags;
  uploaded: Date;

  constructor(tags: Tags, uploaded: Date) {
    this.tags = tags;
    this.uploaded = uploaded;
  }
}
