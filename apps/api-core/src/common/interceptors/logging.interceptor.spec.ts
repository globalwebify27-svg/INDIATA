import { ExecutionContext, CallHandler } from "@nestjs/common";
import { of } from "rxjs";
import { LoggingInterceptor } from "./logging.interceptor";

describe("LoggingInterceptor", () => {
  let interceptor: LoggingInterceptor;

  beforeEach(() => {
    interceptor = new LoggingInterceptor();
  });

  it("should intercept request, call handler, and log execution duration", (done) => {
    const req = {
      method: "GET",
      originalUrl: "/api/v1/health",
      requestId: "req-log-1",
    };
    const res = {
      statusCode: 200,
    };

    const ctx = {
      switchToHttp: () => ({
        getRequest: () => req,
        getResponse: () => res,
      }),
    } as unknown as ExecutionContext;

    const handler: CallHandler = {
      handle: () => of({ ok: true }),
    };

    interceptor.intercept(ctx, handler).subscribe((res) => {
      expect(res).toEqual({ ok: true });
      done();
    });
  });
});
