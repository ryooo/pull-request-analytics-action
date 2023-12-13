import { formatDuration } from "date-fns";

export const formatMinutesDuration = (minutesDuration: number) => {
  const hours = Math.floor(minutesDuration / 60);
  const minutes = minutesDuration % 60;
  const text = formatDuration({ hours, minutes }, { format: ["hours", "minutes"] });
  return text
    .replace("days", "日")
    .replace("day", "日")
    .replace("hours", "時間")
    .replace("hour", "時間")
    .replace("minutes", "分")
    .replace("minute", "分");
};
