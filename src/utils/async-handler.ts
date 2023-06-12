import { NextFunction, Request, Response } from "express";

const AsyncHandler =
  controller => async (req: Request, res: Response, next: NextFunction):Promise<void> => {
    try {
      await controller(req, res);
    } catch (e) {
      return next(e);
    }
  };

export { AsyncHandler };
