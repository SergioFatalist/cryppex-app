import crypto from "crypto";
import dayjs from "dayjs";
import {
  InitDataSchema,
  ListRequestSchema,
  User,
  UserSchema,
  UsersList,
  UsersListSchema,
  UuidFieldSchema,
} from "~/server/model/trpc";
import { procedure, router } from "~/server/trpc/trpc";
import errorParser from "../error-parser";

export default router({
  set: procedure
    .input(InitDataSchema)
    .output(UserSchema)
    .mutation(async ({ input }): Promise<User> => {
      try {
        const config = useRuntimeConfig();
        const initData = new URLSearchParams(JSON.parse(input.initData));
        initData.sort();

        const h = initData.get("hash");
        const u = initData.get("user");

        if (!h || !u) {
          throw new Error("no data");
        }

        initData.delete("hash");

        const dataToCheck = [...initData.entries()].map(([key, value]) => key + "=" + value).join("\n");
        const secretKey = crypto.createHmac("sha256", "WebAppData").update(config.botToken).digest();
        const hash = crypto.createHmac("sha256", secretKey).update(dataToCheck).digest("hex");

        // if (h === hash) {
        //   throw new Error("invalid hash");
        // }

        let user = await prisma.user.findUnique({
          where: {
            telegramId: input.webAppUser.id,
          },
        });
        if (!user) {
          user = await prisma.user.create({
            data: {
              telegramId: input.webAppUser.id,
              firstName: input.webAppUser.first_name,
              lastName: input.webAppUser.last_name,
              username: input.webAppUser.username,
              languageCode: input.webAppUser.language_code,
              currLoginEpoch: dayjs().unix(),
            },
          });
        } else {
          user = await prisma.user.update({
            where: {
              telegramId: input.webAppUser.id,
            },
            data: {
              lastLoginEpoch: user.currLoginEpoch,
              currLoginEpoch: dayjs().unix(),
            },
          });
        }

        return user;
      } catch (error) {
        throw errorParser(error);
      }
    }),

  get: procedure
    .input(UuidFieldSchema)
    .output(UserSchema)
    .query(async ({ input }): Promise<User> => {
      try {
        return prisma.user.findUniqueOrThrow({
          where: {
            id: input.id,
          },
        });
      } catch (error) {
        console.error(error);
        throw errorParser(error);
      }
    }),

  list: procedure
    .input(ListRequestSchema)
    .output(UsersListSchema)
    .query(async ({ input }): Promise<UsersList> => {
      try {
        const where = { referrerId: input.userId };
        const total = await prisma.user.count({ where });
        const items = await prisma.user.findMany({
          where,
          ...parsePagination(input.pagination),
        });
        return {
          pagination: { ...input.pagination, total },
          items,
        };
      } catch (error) {
        console.error(error);
        throw errorParser(error);
      }
    }),
});
