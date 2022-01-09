import config from "../config.json";
import images from "./imageService";
import manager from "./DBManager";

// centralize all exports in this index file and create the objects with the right config
export default {
  DBManager: manager,
  images: images(config.dbURL),
};
