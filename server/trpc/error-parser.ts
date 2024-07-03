import { PrismaClientKnownRequestError } from "@prisma/client/runtime/binary";
import { TRPCError } from "@trpc/server";
import type { AppError, TRPCErrorOptions } from "~/server/model/error";

export default function (error: AppError) {
  console.error(error);
  const options: TRPCErrorOptions = { code: "INTERNAL_SERVER_ERROR", message: "SMTH WRONG" };
  if (error instanceof PrismaClientKnownRequestError) {
    options.code = "UNPROCESSABLE_CONTENT";
    options.message = error.message;
    options.cause = error.meta;
  }
  return new TRPCError(options);
}
