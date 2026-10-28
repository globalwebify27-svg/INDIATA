import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Request, Response } from "express";
import { ApiResponse, PaginationMeta } from "@rajtantra/common-types";

interface PayloadWithMeta<T> {
  data: T;
  meta?: PaginationMeta;
  message?: string;
}

function isPayloadWithMeta<T>(val: unknown): val is PayloadWithMeta<T> {
  return typeof val === "object" && val !== null && "data" in val;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();

    return next.handle().pipe(
      map((result: unknown): ApiResponse<T> => {
        // If already formatted as ApiResponse, return directly
        if (
          typeof result === "object" &&
          result !== null &&
          "success" in result &&
          (result as { success: boolean }).success === true
        ) {
          return result as ApiResponse<T>;
        }

        let data: T;
        let meta: PaginationMeta | undefined;
        let message = "Operation successful";

        if (isPayloadWithMeta<T>(result)) {
          data = result.data;
          meta = result.meta;
          if (result.message) {
            message = result.message;
          }
        } else {
          data = result as T;
        }

        return {
          success: true,
          statusCode: response.statusCode,
          message,
          data,
          ...(meta ? { meta } : {}),
          timestamp: new Date().toISOString(),
          requestId: request?.requestId || "req_unknown",
        };
      }),
    );
  }
}
