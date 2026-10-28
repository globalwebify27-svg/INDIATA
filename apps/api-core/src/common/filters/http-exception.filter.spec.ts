import { ArgumentsHost, HttpException, HttpStatus } from "@nestjs/common";
import { GlobalHttpExceptionFilter } from "./http-exception.filter";

describe("GlobalHttpExceptionFilter", () => {
  let filter: GlobalHttpExceptionFilter;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    filter = new GlobalHttpExceptionFilter();
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
  });

  function createMockHost(requestId = "req-err-1"): ArgumentsHost {
    const req = { requestId };
    const res = { status: statusMock };
    return {
      switchToHttp: () => ({
        getRequest: () => req,
        getResponse: () => res,
      }),
    } as unknown as ArgumentsHost;
  }

  it("should format HttpException into standard ApiErrorResponse", () => {
    const exception = new HttpException(
      "Access Forbidden",
      HttpStatus.FORBIDDEN,
    );
    const host = createMockHost("req-test-forbidden");

    filter.catch(exception, host);

    expect(statusMock).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        statusCode: HttpStatus.FORBIDDEN,
        message: "Access Forbidden",
        requestId: "req-test-forbidden",
      }),
    );
  });

  it("should format structured object exceptions with validation details", () => {
    const exception = new HttpException(
      {
        message: "Validation failed",
        error: "VALIDATION_ERROR",
        details: [{ field: "email", message: "Invalid email" }],
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
    const host = createMockHost();

    filter.catch(exception, host);

    expect(statusMock).toHaveBeenCalledWith(HttpStatus.UNPROCESSABLE_ENTITY);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        message: "Validation failed",
        error: expect.objectContaining({
          code: "VALIDATION_ERROR",
          details: [{ field: "email", message: "Invalid email" }],
        }),
      }),
    );
  });

  it("should handle generic unhandled Error and return 500 status", () => {
    const error = new Error("Database connection crashed");
    const host = createMockHost("req-unhandled");

    filter.catch(error, host);

    expect(statusMock).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        requestId: "req-unhandled",
      }),
    );
  });
});
