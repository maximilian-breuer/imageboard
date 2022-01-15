import config from "../config.json";
import images from "./imageService";
import users from "./userService";
import manager from "./DBManager";
import authorizationService from "./authorizationService";

// centralize all exports in this index file and create the objects with the right config
export default {
  DBManager: manager,
  images: images(config.dbURL),
  users: users(config.dbURL),
  authorization: authorizationService(config.dbURL),
};
