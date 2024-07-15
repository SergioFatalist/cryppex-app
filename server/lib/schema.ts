import { z } from "zod";
import type { WebAppUser } from "~/types/telegram";

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
  telegramId: z.number(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  username: z.string().nullable().optional(),
  languageCode: z.string().nullable().optional(),
  address: z.string(),
  balance: z.number(),
  locked: z.number(),
  interest: z.number(),
  referrerId: z.string().uuid().nullable().optional(),
  created: z.number(),
  currLogin: z.number().nullable().optional(),
  lastLogin: z.number().nullable().optional(),
});

export const UsersListItemSchema = UserSchema.pick({
  id: true,
  telegramId: true,
  firstName: true,
  lastName: true,
  username: true,
  balance: true,
  created: true,
});

export const UsersListSchema = PaginatiedSchema.extend({
  items: z.array(UsersListItemSchema).default([]),
});

export const WebAppUserSchema: z.ZodType<WebAppUser> = z.object({
  id: z.number(),
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
  initData: z.string().optional(),
  userId: z.string().uuid().optional(),
  kentId: z.number().optional(),
});

export const ListRequestSchema = z.object({
  pagination: PaginationSchema.optional(),
  userId: z.string().uuid(),
});

export const TransactionSchema = z.object({
  id: z.string().uuid(),
  txTime: z.number(),
  referral: z.string().nullable().optional(),
  amount: z.number(),
  success: z.boolean().nullable(),
  type: z.string(),
});

export const TransactionsListSchema = PaginatiedSchema.extend({
  items: z.array(TransactionSchema).default([]),
});

export const InvestmentSchema = z.object({
  id: z.string().uuid(),
  amount: z.number(),
  rate: z.number(),
  interest: z.number(),
  start: z.number(),
  finish: z.number(),
});

export const InvestmentsListSchema = PaginatiedSchema.extend({
  items: z.array(InvestmentSchema).default([]),
});

export const InvestmentSummarySchema = z.object({
  balance: z.number(),
  count: z.number(),
  amount: z.number(),
  interest: z.number(),
});

export const ApplyInvestSchema = z.object({
  userId: z.string().uuid(),
  rate: z.number(),
  amount: z.number(),
});

export const UserWithSummarySchema = z.object({
  user: UserSchema,
  summary: InvestmentSummarySchema,
});

export const SendSchema = z.object({
  userId: z.string().uuid(),
  to: z.string(),
  amount: z.number(),
});

export type User = z.TypeOf<typeof UserSchema>;
export type UserWithSummary = z.TypeOf<typeof UserWithSummarySchema>;
export type UsersList = z.TypeOf<typeof UsersListSchema>;
export type UsersListItem = z.TypeOf<typeof UsersListItemSchema>;
export type Pagination = z.TypeOf<typeof PaginationSchema>;
export type Transaction = z.TypeOf<typeof TransactionSchema>;
export type TransactionsList = z.TypeOf<typeof TransactionsListSchema>;
export type Investment = z.TypeOf<typeof InvestmentSchema>;
export type InvestmentsList = z.TypeOf<typeof InvestmentsListSchema>;
export type InvestmentSummary = z.TypeOf<typeof InvestmentSummarySchema>;
export type Send = z.TypeOf<typeof SendSchema>;
