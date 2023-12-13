import * as core from "@actions/core";
import { parse } from "date-fns";

export const getReportDates = () => {
  const startReportDate =
    process.env.REPORT_DATE_START || core.getInput("REPORT_DATE_START");
  const endReportDate =
    process.env.REPORT_DATE_END || core.getInput("REPORT_DATE_END");

  const startDate = startReportDate
    ? parse(startReportDate, "yyyy/MM/d", new Date())
    : null;
  const endDate = endReportDate
    ? parse(endReportDate, "yyyy/MM/d", new Date())
    : null;
  return {
    startDate,
    endDate,
  };
};
