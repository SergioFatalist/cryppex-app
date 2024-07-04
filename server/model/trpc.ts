import { z } from "zod";
import { WebAppUser } from "~/types/telegram";

export const SortingSchema = z.object({
  key: z.string(),
  order: z.union([z.literal("asc"), z.literal("desc"), z.boolean()]).optional(),
});

export const PaginationSchema = z.object({
  page: z.number().optional(),
  itemsPerPage: z.number().optional(),
  total: z.number().optional(),
  sortBy: z.array(SortingSchema).optional(),
  groupBy: z.array(SortingSchema).optional(),
});

export const PaginatiedSchema = z.object({
  pagination: PaginationSchema.optional(),
});

export const UuidFieldSchema = z.object({
  id: z.string().uuid(),
});

export const UserSchema = z.object({
  id: z.string().uuid(),
  telegramId: z.bigint(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  username: z.string().nullable().optional(),
  balance: z.number(),
  farm: z.number(),
  referrerId: z.string().uuid().nullable().optional(),
  languageCode: z.string().nullable().optional(),
  createdEpoch: z.number(),
  currLoginEpoch: z.number().nullable().optional(),
  lastLoginEpoch: z.number().nullable().optional(),
});

export const UsersListSchema = PaginatiedSchema.extend({
  items: z.array(UserSchema).default([]),
});

export const WebAppUserSchema: z.ZodType<WebAppUser> = z.object({
  id: z.bigint(),
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

export const ListRequestSchema = z.object({
  pagination: PaginationSchema.optional(),
  userId: z.string().uuid(),
});

export const TransactionSchema = z.object({
  id: z.string().uuid(),
  startEpoch: z.number(),
  endEpoch: z.number().nullable().optional(),
  referral: z.string().nullable().optional(),
  amount: z.number().default(0),
  success: z.boolean().nullable(),
  operation: z.string(),
});

export const TransactionsListSchema = PaginatiedSchema.extend({
  items: z.array(TransactionSchema).default([]),
});

export type User = z.TypeOf<typeof UserSchema>;
export type UsersList = z.TypeOf<typeof UsersListSchema>;
export type Pagination = z.TypeOf<typeof PaginationSchema>;
export type Transaction = z.TypeOf<typeof TransactionSchema>;
export type TransactionsList = z.TypeOf<typeof TransactionsListSchema>;
