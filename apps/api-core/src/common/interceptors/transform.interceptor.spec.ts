import { ExecutionContext, CallHandler } from "@nestjs/common";
import { of } from "rxjs";
import { TransformInterceptor } from "./transform.interceptor";

describe("TransformInterceptor", () => {
  let interceptor: TransformInterceptor<unknown>;

  beforeEach(() => {
    interceptor = new TransformInterceptor();
  });

  function createMockContext(
    statusCode = 200,
    requestId = "req-test-123",
  ): ExecutionContext {
    return {
      switchToHttp: () => ({
        getRequest: () => ({ requestId }),
        getResponse: () => ({ statusCode }),
      }),
    } as unknown as ExecutionContext;
  }

  it("should wrap plain data in standard ApiResponse envelope", (done) => {
    const ctx = createMockContext(200, "req-test-123");
    const handler: CallHandler = {
      handle: () => of({ foo: "bar" }),
    };

    interceptor.intercept(ctx, handler).subscribe((result) => {
      expect(result.success).toBe(true);
      expect(result.statusCode).toBe(200);
      expect(result.data).toEqual({ foo: "bar" });
      expect(result.requestId).toBe("req-test-123");
      expect(result.timestamp).toBeDefined();
      done();
    });
  });

  it("should preserve existing pagination metadata", (done) => {
    const ctx = createMockContext(200, "req-meta-999");
    const meta = {
      page: 1,
      limit: 10,
      totalRecords: 100,
      totalPages: 10,
      hasNextPage: true,
      hasPreviousPage: false,
    };
    const handler: CallHandler = {
      handle: () => of({ data: ["item1", "item2"], meta }),
    };

    interceptor.intercept(ctx, handler).subscribe((result) => {
      expect(result.success).toBe(true);
      expect(result.data).toEqual(["item1", "item2"]);
      expect(result.meta).toEqual(meta);
      done();
    });
  });
});
