import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";
import { ApiErrorResponse } from "@rajtantra/common-types";

@Catch()
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalHttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const requestId = request?.requestId || "req_unknown";

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "An unexpected internal server error occurred";
    let errorCode = "INTERNAL_SERVER_ERROR";
    let details: unknown = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === "string") {
        message = res;
      } else if (typeof res === "object" && res !== null) {
        const resObj = res as Record<string, unknown>;
        message = (resObj["message"] as string) || exception.message;
        errorCode = (resObj["error"] as string) || exception.name;
        if (resObj["details"]) {
          details = resObj["details"];
        }
      }
    } else if (exception instanceof Error) {
      this.logger.error(
        `Unhandled Exception [${requestId}]: ${exception.message}`,
        exception.stack,
      );
      // In production we hide raw internal error messages
      if (process.env.NODE_ENV !== "production") {
        message = exception.message;
      }
    }

    const errorPayload: ApiErrorResponse = {
      success: false,
      statusCode: status,
      message: Array.isArray(message) ? message.join("; ") : message,
      error: {
        code: errorCode,
        details,
      },
      timestamp: new Date().toISOString(),
      requestId,
    };

    response.status(status).json(errorPayload);
  }
}
