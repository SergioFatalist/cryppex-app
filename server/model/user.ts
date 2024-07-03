import { z } from "zod";
import { WebAppUser } from "~/types/telegram";

export const UserSchema = z.object({
  id: z.string().uuid(),
  telegramId: z.bigint(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  username: z.string().nullable().optional(),
  languageCode: z.string().nullable().optional(),
  currLoginEpoch: z.number().nullable().optional(),
  lastLoginEpoch: z.number().nullable().optional(),
});

// const toBigInt = z.coerce.bigint();

export const WebAppUserSchema: z.ZodType<WebAppUser> = z.object({
  id: z.bigint(),
  // id: z.bigint().or(toBigInt).pipe(z.coerce.bigint()),
  is_bot: z.boolean().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  username: z.string().optional(),
  language_code: z.string().optional(),
  is_premium: z.boolean().optional(),
  added_to_attachment_menu: z.boolean().optional(),
  allows_write_to_pm: z.boolean().optional(),
  photo_url: z.string().optional(),
});

export const InitDataSchema = z.object({
  initData: z.string(),
  webAppUser: WebAppUserSchema,
});

export type User = z.TypeOf<typeof UserSchema>;
