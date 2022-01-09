import services from "../../src/services";

declare global {
  namespace Express {
    interface Request {
      services: typeof services;
    }
  }
}
