export function formatAmount(amount: number) {
  return Number.isInteger(amount) ? String(amount) : amount.toFixed(1).replace(/\.0$/,'')
}

export function totalMinutes(prep: number, cook: number) {
  return prep + cook
}
