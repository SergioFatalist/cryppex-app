import { PrismaClientKnownRequestError } from "@prisma/client/runtime/binary";

export type AppError = Error | PrismaClientKnownRequestError | unknown;

export type TRPCErrorCode =
  | "BAD_REQUEST"
  | "CLIENT_CLOSED_REQUEST"
  | "CONFLICT"
  | "FORBIDDEN"
  | "INTERNAL_SERVER_ERROR"
  | "METHOD_NOT_SUPPORTED"
  | "NOT_FOUND"
  | "NOT_IMPLEMENTED"
  | "PARSE_ERROR"
  | "PAYLOAD_TOO_LARGE"
  | "PRECONDITION_FAILED"
  | "TIMEOUT"
  | "TOO_MANY_REQUESTS"
  | "UNAUTHORIZED"
  | "UNPROCESSABLE_CONTENT";

export type TRPCErrorOptions = {
  message?: string;
  code: TRPCErrorCode;
  cause?: unknown;
};
