import { UnprocessableEntityException } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "./zod-validation.pipe";

describe("ZodValidationPipe", () => {
  const testSchema = z.object({
    email: z.string().email(),
    age: z.number().min(18),
  });

  const pipe = new ZodValidationPipe(testSchema);

  it("should pass valid data and return parsed object", () => {
    const input = { email: "voter@rajtantra.in", age: 25 };
    const result = pipe.transform(input, { type: "body" });
    expect(result).toEqual(input);
  });

  it("should throw UnprocessableEntityException on invalid input", () => {
    const input = { email: "not-an-email", age: 12 };
    expect(() => pipe.transform(input, { type: "body" })).toThrow(
      UnprocessableEntityException,
    );
  });
});
