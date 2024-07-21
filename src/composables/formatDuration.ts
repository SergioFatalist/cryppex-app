import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);

export default function (seconds: number | undefined) {
  return seconds
    ? dayjs
        .duration(seconds, "seconds")
        .format("D[d]-HH:mm:ss")
        .replace(/\b0+[a-z]+\s*/gi, "")
        .replace(/-00:/, "")
        .replace("-", " ")
        .trim()
    : "";
}
