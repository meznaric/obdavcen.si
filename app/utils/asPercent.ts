export default function asPercent(value: number) {
  return `${(value * 100).toFixed(2).replace(".", ",")}\u00a0%`;
}
