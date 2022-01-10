import express from "express";
import imagesRoute from "./rest-routes/imagesRoute";
import serviceMiddleware from "./middleware/serviceMiddleware";
import bodyParser from "express";

const app = express();

app.use(serviceMiddleware());

app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: false }));

// deliver frontend
app.use(
  "/",
  express.static(__dirname + "/../../angular-client/dist/imageboard/")
);

// api routes
app.use("/api/v1/images", imagesRoute);

app.listen(3000, () => console.log("App listening on port 3000!"));
