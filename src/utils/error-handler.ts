import { Request, Response } from "express";

const ErrorHandler = (err: Error, req: Request, res: Response, next) => {
  res.status(404).json({ success: false, error: err.message || "Server Dead" });
};

export { ErrorHandler };
