export const formatMoney = (n, store) =>
  "$" + Math.round(n).toLocaleString(store?.locale ?? "es-CO");
