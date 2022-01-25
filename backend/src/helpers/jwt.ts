import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import unless from "express-unless";

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  req.services.authorization.getSecretToken((secretToken) => {
    jwt.verify(token, secretToken, (err, user) => {
      if (err) return res.status(403).send("Unvalid token");
      //error TS2339: Property 'username' does not exist on type 'string | JwtPayload'.
      //req.username = user?.username as unknown as string;
      next();
    });
  });
};
authenticateToken.unless = unless;

const generateAccessToken = (username: string, secretToken: string) => {
  // expire after 30 minutes
  return jwt.sign({ username }, secretToken, { expiresIn: "30m" });
};

export { authenticateToken, generateAccessToken };
