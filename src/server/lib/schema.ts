import { z } from "zod";

export enum EventType {
  UNDEFINED = "undefined",
  USER_CREATE = "user:create",
  USER_LOGIN = "user:login",
  USER_UDPATE = "user:update",
}

export enum TransactionType {
  WITHDRAWAL = "withdrawal",
  DEPOSIT = "deposit",
  BONUS = "bonus",
  INTEREST = "interest",
}

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
  refId: z.number().nullable().optional(),
  created: z.number(),
  investsCount: z.number(),
  investsAmount: z.number(),
  investsInterest: z.number(),
});

export const RefUserSchema = z.object({
  id: z.number(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  username: z.string().nullable().optional(),
  languageCode: z.string().nullable().optional(),
  balance: z.number(),
  refId: z.number().nullable().optional(),
  created: z.number(),
  pending: z.number().nullable().optional(),
  applied: z.number().nullable().optional(),
});

export const ReferralsSchema = PaginatiedSchema.extend({
  items: z.array(RefUserSchema).default([]),
});

export const TransactionSchema = z.object({
  id: z.number(),
  txTime: z.number(),
  refId: z.number(),
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
  to: z.string(),
  amount: z.number(),
});

export type User = z.TypeOf<typeof UserSchema>;
export type RefUser = z.TypeOf<typeof RefUserSchema>;
export type Referrals = z.TypeOf<typeof ReferralsSchema>;
export type Pagination = z.TypeOf<typeof PaginationSchema>;
export type Transaction = z.TypeOf<typeof TransactionSchema>;
export type TransactionsList = z.TypeOf<typeof TransactionsListSchema>;
export type Investment = z.TypeOf<typeof InvestmentSchema>;
export type InvestmentsList = z.TypeOf<typeof InvestmentsListSchema>;
export type Send = z.TypeOf<typeof SendSchema>;
