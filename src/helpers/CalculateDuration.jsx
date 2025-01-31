import { differenceInDays, differenceInMonths } from "date-fns";

export default function getCourseDuration(start, end) {
  if (!start || !end) return "Duration not available";

  const startDate = new Date(start);
  const endDate = new Date(end);
  const days = differenceInDays(endDate, startDate);

  if (days < 7) {
    return `${days} day${days !== 1 ? "s" : ""}`;
  } else if (days < 30) {
    const weeks = Math.floor(days / 7);
    const remainingDays = days % 7;
    return [
      weeks > 0 ? `${weeks} week${weeks !== 1 ? "s" : ""}` : "",
      remainingDays > 0
        ? `${remainingDays} day${remainingDays !== 1 ? "s" : ""}`
        : "",
    ]
      .filter(Boolean)
      .join(" ");
  } else {
    const months = differenceInMonths(endDate, startDate);
    const remainingDays = days - months * 30; // Approximate remaining days after full months
    return [
      months > 0 ? `${months} month${months !== 1 ? "s" : ""}` : "",
      remainingDays > 0
        ? `${remainingDays} day${remainingDays !== 1 ? "s" : ""}`
        : "",
    ]
      .filter(Boolean)
      .join(" ");
  }
}
