import { format } from "date-fns";

function FormatDate(dateString) {
  const date = new Date(dateString);

  // Add ordinal suffix to the day
  const ordinal = (n) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  const day = ordinal(date.getDate());
  const month = format(date, "MMM"); // 'Jan', 'Feb', etc.
  const year = format(date, "yyyy");

  return `${day} ${month} ${year}`;
}

export default FormatDate;
