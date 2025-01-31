import { format } from "date-fns";

const addOrdinalSuffix = (day) => {
  if (day > 3 && day < 21) return `${day}th`;
  const suffixes = ["st", "nd", "rd"];
  const lastDigit = day % 10;
  return `${day}${suffixes[lastDigit - 1] || "th"}`;
};

const FormatDateTime = (dateString) => {
  const date = new Date(dateString);
  const day = addOrdinalSuffix(date.getDate());
  const month = format(date, "MMM");
  const year = format(date, "''yy");
  const time = format(date, "HH:mm");

  return `${day} ${month} ${year}\u00A0\u00A0 •\u00A0\u00A0 ${time}`;
};

export default FormatDateTime;
