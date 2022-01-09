import { NextFunction, Request, Response } from "express";
import services from "../services";

// our middleware injects all services directly in the request object
export default function serviceMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    req.services = services;
    next();
  };
}
