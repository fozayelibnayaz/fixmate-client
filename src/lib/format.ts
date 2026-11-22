export const money = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

export const shortDate = (value: string | Date) =>
  new Intl.DateTimeFormat("en-US", { day: "numeric", month: "short", year: "numeric" }).format(
    new Date(value),
  );

export const relativeDate = (value: string | Date) => {
  const days = Math.round((new Date(value).getTime() - Date.now()) / 86_400_000);
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days === -1) return "Yesterday";
  return shortDate(value);
};

export const truncate = (value: string, length = 22) =>
  value.length > length ? `${value.slice(0, length)}…` : value;
