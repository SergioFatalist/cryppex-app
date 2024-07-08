export default function (amount: bigint | undefined) {
  return amount ? (Number(amount) / 1000000).toFixed(2) : 0;
}
