// import crypto from "crypto";
import { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event);
  console.log(JSON.stringify(body));

  // const config = useRuntimeConfig();
  // const initData = new URLSearchParams(JSON.parse(body.data));
  // console.dir(initData);
  // initData.sort();
  //
  // const hash = initData.get("hash");
  // initData.delete("hash");
  //
  // const dataToCheck = [...initData.entries()].map(([key, value]) => key + "=" + value).join("\n");
  //
  // const secretKey = crypto.createHmac("sha256", "WebAppData").update(config.botToken).digest();
  //
  // const _hash = crypto.createHmac("sha256", secretKey).update(dataToCheck).digest("hex");
  //
  // const result = hash === _hash;
  // console.log(result);
  const result = true;

  return result;
});
