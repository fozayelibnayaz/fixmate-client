export const money = (amount: number) => {
  const maximumFractionDigits = Number.isInteger(amount) ? 0 : 2;
  const formatted = new Intl.NumberFormat("en-BD", {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  }).format(amount);
  return `৳${formatted}`;
};

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
