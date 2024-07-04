import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);

export default function (
  unix: number | null | undefined = null,
  format: string = "DD-MM-YYYY HH:mm",
  timezone?: string | undefined
) {
  if (unix == null) {
    return "";
  }
  return timezone ? dayjs.unix(unix).tz(timezone).format(format) : dayjs.unix(unix).format(format);
}
