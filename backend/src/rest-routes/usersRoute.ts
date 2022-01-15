import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/user";

const router = express.Router();

// create a new user
router.post("/register", (req: Request, res: Response) => {
  const password = req.body.password;
  const salt = bcrypt.genSaltSync(10);
  req.body.password = bcrypt.hashSync(password, salt);

  if (!req.body.username || !req.body.password)
    return res.status(400).send("Entered invalid user properties");

  const newUser = new User(req.body.username, req.body.password);

  req.services.users.register(newUser, (err, generatedUsername) => {
    if (err || !generatedUsername)
      return res.status(400).send(`Bad Request: ${err?.message}`);

    res.json(generatedUsername);
  });
});

// login and authenticate
router.post("/login", (req: Request, res: Response) => {
  const username = req.body.username as unknown as string;
  const password = req.body.password as unknown as string;
  if (!username || !password)
    return res.status(400).send("Login is not possible");

  // get the secret token to verify against and call login
  req.services.authorization.getSecretToken((secretToken) => {
    req.services.users.login(username, password, secretToken, (err, token) => {
      if (err) res.status(404).send(err);
      res.json(token);
    });
  });
});

export default router;
