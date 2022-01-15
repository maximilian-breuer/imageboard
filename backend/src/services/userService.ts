import { Collection, Document } from "mongodb";
import User from "../models/user";
import DBManager from "./DBManager";
import bcrypt from "bcrypt";
import { generateAccessToken } from "../helpers/jwt";

let db, usersCollection: Collection<Document>;

export default function imagesService(dbURL: string) {
  DBManager.getConnection(dbURL, (database) => {
    db = database;
    usersCollection = db?.collection("users");
  });

  const login = (
    username: string,
    password: string,
    secretToken: string,
    callback: (err: string | undefined, token: string | undefined) => void
  ) => {
    usersCollection.findOne({ "user.username": username }, (err, user_obj) => {
      if (err) throw err;
      if (user_obj == null) return callback("Not a registered user", undefined);

      const user = user_obj.user as unknown as User;

      // compare entered password with hashed password
      if (bcrypt.compareSync(password, user.password)) {
        // generate token and return
        const token = generateAccessToken(username, secretToken);

        callback(undefined, token);
      } else {
        return callback("Your user and/or password are/is wrong", undefined);
      }
    });
  };

  const register = (
    user: User,
    callback: (err?: Error, username?: string) => void
  ) => {
    isRegistered(user.username, (isReg) => {
      // check if username already exists
      if (isReg) {
        callback(new Error("User already exists"), undefined);
        return;
      }

      usersCollection.insertOne({ user }, (err) => {
        if (err || !user) throw err;
        callback(undefined, user.username);
      });
    });
  };

  const isRegistered = (
    username: string,
    callback: (inDb: boolean) => void
  ) => {
    usersCollection.countDocuments(
      { "user.username": { $regex: username } },
      { limit: 1 },
      (err, res) => {
        if (err || res === undefined) throw err;
        callback(res > 0);
      }
    );
  };

  return { login, register };
}
