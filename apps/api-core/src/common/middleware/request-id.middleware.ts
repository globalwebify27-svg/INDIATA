import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";

declare global {
  namespace Express {
    interface Request {
      requestId: string;
    }
  }
}

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const rawHeader = req.headers["x-request-id"];
    const requestId =
      typeof rawHeader === "string" && rawHeader.trim().length > 0
        ? rawHeader
        : randomUUID();

    req.requestId = requestId;
    res.setHeader("X-Request-Id", requestId);
    next();
  }
}
