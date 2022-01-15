import { Collection, Document } from "mongodb";
import DBManager from "./DBManager";
import keygen from "keygenerator";

let db, auhtorizationCollection: Collection<Document>;

export default function authorizationService(dbURL: string) {
  DBManager.getConnection(dbURL, (database) => {
    db = database;
    auhtorizationCollection = db?.collection("authorization");
  });

  const getSecretToken = (callback: (res: string) => void) => {
    auhtorizationCollection.findOne({}, (err, res) => {
      if (err) throw err;

      const token = res?.token as unknown as string;
      if (token != null) {
        callback(token);
      } else {
        // create new token, save in db and return
        const token = keygen._();
        createSecretToken(token);
        callback(token);
      }
    });
  };

  const createSecretToken = (token: string) => {
    auhtorizationCollection.insertOne({ token: token }, (err) => {
      if (err) throw err;
    });
  };

  return { getSecretToken };
}
