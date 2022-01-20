import { Images, Tags } from "./types";

export default class Image {
  tags: Tags;
  uploaded: Date;

  constructor(tags: Tags, uploaded: Date) {
    this.tags = tags;
    this.uploaded = uploaded;
  }
}

// conert tags array(from type tag) to string array of tags because frontend uses tags as string array
export function convertTagsToStrings(array: Images) {
  return array.map((img) => {
    return {
      ...img,
      tags: img.tags.map((tag) => {
        return tag.content;
      }),
    };
  });
}
