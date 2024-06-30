import { z } from "zod";

export const TgInitDataSchema = z.object({
  initData: z.string(),
});

export const BoolResultSchema = z.object({
  result: z.boolean(),
});

export type TgInitData = z.TypeOf<typeof TgInitDataSchema>;
export type BoolResult = z.TypeOf<typeof BoolResultSchema>;
