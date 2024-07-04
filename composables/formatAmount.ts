export default function (amount: number | undefined) {
  return amount ? (parseFloat(String(amount / 1000)).toFixed(3)) : 0;
}