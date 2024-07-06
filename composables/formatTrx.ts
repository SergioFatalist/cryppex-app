export default function (amount: bigint | undefined) {
  return amount ? parseFloat(String(amount / 1000000n)).toFixed(3) : 0;
}
