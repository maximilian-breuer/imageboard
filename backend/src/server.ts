import express from "express";
import imagesRoute from "./rest-routes/imagesRoute";
import usersRoute from "./rest-routes/usersRoute";
import serviceMiddleware from "./middleware/serviceMiddleware";
import { authenticateToken } from "./helpers/jwt";
import bodyParser from "express";

const app = express();

app.use(serviceMiddleware());

// stop authenticate middleware from running on routes
// app.use(
//   authenticateToken.unless({
//     path: [
//       { url: new RegExp("/"), methods: ["GET"] },
//       { url: new RegExp("images/?$"), methods: ["GET"] },
//       {
//         url: new RegExp("/api/v1/users/register"),
//         methods: ["GET", "POST", "PUT"],
//       },
//       {
//         url: new RegExp("/api/v1/users/login"),
//         methods: ["GET", "POST", "PUT"],
//       },
//     ],
//   })
// );

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// deliver frontend
app.use(
  "/",
  express.static(__dirname + "/../../angular-client/dist/imageboard/")
);

// api routes
app.use("/api/v1/images", imagesRoute);
app.use("/api/v1/users", usersRoute);

app.listen(3000, () => console.log("App listening on port 3000!"));
