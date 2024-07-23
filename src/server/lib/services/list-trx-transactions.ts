import type { TransferContract } from "@/types/contract";
import type { Transaction } from "@/types/transaction";

export default async function listTrxTransactions(
  address: string,
  timestamp?: number | bigint
): Promise<{ data: Transaction<TransferContract>[] }> {
  let url = `https://api.trongrid.io/v1/accounts/${address}/transactions?order_by=block_timestamp%2Casc&only_confirmed=true&search_internal=false`;
  if (timestamp) {
    url += `&min_timestamp=${timestamp}`;
  }
  return $fetch<{ data: Transaction<TransferContract>[] }>(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });
}
