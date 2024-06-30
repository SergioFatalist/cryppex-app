import crypto from "crypto";
import { BoolResultSchema, TgInitDataSchema } from "~/server/model/schema/validation";
import { router, procedure } from "~/server/trpc/trpc";

export default router({
  initData: procedure
    .input(TgInitDataSchema)
    .output(BoolResultSchema)
    .query(async ({ input }) => {
      const config = useRuntimeConfig();
      const initData = new URLSearchParams(input.initData);
      console.dir(initData);
      initData.sort();

      const hash = initData.get("hash");
      initData.delete("hash");

      const dataToCheck = [...initData.entries()].map(([key, value]) => key + "=" + value).join("\n");

      const secretKey = crypto.createHmac("sha256", "WebAppData").update(config.botToken).digest();

      const _hash = crypto.createHmac("sha256", secretKey).update(dataToCheck).digest("hex");

      const result = hash === _hash;
      console.log(result);

      return {
        result,
      };
    }),
});
