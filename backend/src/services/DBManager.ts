import { Db, MongoClient } from "mongodb";
import { dbName } from "../config.json";

const connections = new Map<string, MongoClient>();

// returns object with a function to get a db connection
export default {
  getConnection: (dbURL: string, callback: (db: Db) => void) => {
    // if string is empty we can't connect to db
    if (!dbURL || dbURL.length === 0) {
      console.log("error: empty string");
      return;
    }

    // try to get the connection from our map
    const connectionPool = connections.get(dbURL)?.db(dbName);

    // return connection if we had one in our map, else create a new connectionPool, save it in our map and return it
    if (connectionPool) {
      callback(connectionPool);
    } else {
      MongoClient.connect(dbURL, (err, client) => {
        if (err || !client) throw err;
        connections.set(dbURL, client);
        callback(client.db(dbName));
      });
    }
  },
};
