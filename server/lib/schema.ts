import { z } from "zod";

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

export const IdFieldSchema = z.object({
  id: z.number().optional(),
});

export const UserSchema = z.object({
  id: z.number(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  username: z.string().nullable().optional(),
  languageCode: z.string().nullable().optional(),
  address: z.string(),
  balance: z.number(),
  locked: z.number(),
  referrerId: z.number().nullable().optional(),
  created: z.number(),
  investsCount: z.number(),
  investsAmount: z.number(),
  investsInterest: z.number(),
});

export const UsersListItemSchema = UserSchema.pick({
  id: true,
  firstName: true,
  lastName: true,
  username: true,
  balance: true,
  created: true,
});

export const UsersListSchema = PaginatiedSchema.extend({
  items: z.array(UsersListItemSchema).default([]),
});

export const ListRequestSchema = z.object({
  pagination: PaginationSchema.optional(),
  userId: z.number(),
});

export const TransactionSchema = z.object({
  id: z.number(),
  txTime: z.number(),
  referral: z.number(),
  amount: z.number(),
  success: z.boolean().nullable(),
  type: z.string(),
});

export const TransactionsListSchema = PaginatiedSchema.extend({
  items: z.array(TransactionSchema).default([]),
});

export const InvestmentSchema = z.object({
  id: z.number(),
  amount: z.number(),
  rate: z.number(),
  interest: z.number(),
  start: z.number(),
  finish: z.number(),
});

export const InvestmentsListSchema = PaginatiedSchema.extend({
  items: z.array(InvestmentSchema).default([]),
});

export const ApplyInvestSchema = z.object({
  userId: z.number(),
  rate: z.number(),
  amount: z.number(),
});

export const SendSchema = z.object({
  userId: z.number(),
  to: z.string(),
  amount: z.number(),
});

export type User = z.TypeOf<typeof UserSchema>;
export type UsersList = z.TypeOf<typeof UsersListSchema>;
export type UsersListItem = z.TypeOf<typeof UsersListItemSchema>;
export type Pagination = z.TypeOf<typeof PaginationSchema>;
export type Transaction = z.TypeOf<typeof TransactionSchema>;
export type TransactionsList = z.TypeOf<typeof TransactionsListSchema>;
export type Investment = z.TypeOf<typeof InvestmentSchema>;
export type InvestmentsList = z.TypeOf<typeof InvestmentsListSchema>;
export type Send = z.TypeOf<typeof SendSchema>;
