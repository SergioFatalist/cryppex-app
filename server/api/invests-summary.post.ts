import getInvestmentsSummary from "~/server/lib/get-investments-summary";
import { type InvestmentSummary, UuidFieldSchema } from "~/server/lib/schema";

export default defineEventHandler(async (event): Promise<InvestmentSummary> => {
  const { data, error } = await readValidatedBody(event, (data) => UuidFieldSchema.safeParse(data));

  if (!data || error) {
    throw new Error(`Data is missing or ${error}`);
  }

  return getInvestmentsSummary(data.id);
});
