import { RequestIdMiddleware } from "./request-id.middleware";
import { Request, Response, NextFunction } from "express";

describe("RequestIdMiddleware", () => {
  let middleware: RequestIdMiddleware;

  beforeEach(() => {
    middleware = new RequestIdMiddleware();
  });

  it("should use incoming X-Request-Id header when present", () => {
    const req = {
      headers: { "x-request-id": "custom-req-id-123" },
    } as unknown as Request;

    const setHeaderMock = jest.fn();
    const res = {
      setHeader: setHeaderMock,
    } as unknown as Response;

    const next: NextFunction = jest.fn();

    middleware.use(req, res, next);

    expect(req.requestId).toBe("custom-req-id-123");
    expect(setHeaderMock).toHaveBeenCalledWith(
      "X-Request-Id",
      "custom-req-id-123",
    );
    expect(next).toHaveBeenCalled();
  });

  it("should generate a new UUID when X-Request-Id header is absent", () => {
    const req = {
      headers: {},
    } as unknown as Request;

    const setHeaderMock = jest.fn();
    const res = {
      setHeader: setHeaderMock,
    } as unknown as Response;

    const next: NextFunction = jest.fn();

    middleware.use(req, res, next);

    expect(req.requestId).toBeDefined();
    expect(req.requestId.length).toBeGreaterThan(10);
    expect(setHeaderMock).toHaveBeenCalledWith("X-Request-Id", req.requestId);
    expect(next).toHaveBeenCalled();
  });
});
