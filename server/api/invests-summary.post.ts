import getInvestmentsSummary from "~/server/lib/get-investments-summary";
import { type InvestmentSummary, IdFieldSchema } from "~/server/lib/schema";

export default defineEventHandler(async (event): Promise<InvestmentSummary> => {
  const { data, error } = await readValidatedBody(event, (data) => IdFieldSchema.safeParse(data));

  if (!data || error) {
    throw new Error(`Data is missing or ${error}`);
  }

  return getInvestmentsSummary(data.id);
});
