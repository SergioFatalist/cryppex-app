import { Prisma, PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient({
    transactionOptions: {
      maxWait: 5000, // default: 2000
      timeout: 10000, // default: 5000
      isolationLevel: Prisma.TransactionIsolationLevel.ReadUncommitted,
    },
  });
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
