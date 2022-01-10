import { NextFunction, Request, Response } from "express";
import services from "../services";

// our middleware injects all services directly in the request object
export default function serviceMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    req.services = services;
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    next();
  };
}
