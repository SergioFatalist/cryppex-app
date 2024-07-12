export default function (amount: number | undefined) {
  return amount ? (amount / 1_000_000).toFixed(2) : 0;
}
