import { Collection } from "../data/preparations/types";
import {
  StatsType,
  createConfigParamsCode,
  createDiscussionsPieChart,
  createPullRequestQualityTable,
  createReviewTable,
  createTimelineGanttBar,
  createTimelineTable,
  createTotalTable,
  sortCollectionsByDate,
} from "./utils";
import { getMultipleValuesInput } from "../utils";

export const createMarkdown = (
  data: Record<string, Record<string, Collection>>
) => {
  const usersToHide = getMultipleValuesInput("HIDE_USERS") || [];
  const usersToShow = getMultipleValuesInput("SHOW_USERS") || [];

  const users = Object.keys(data)
    .filter((key) => key !== "total")
    .concat("total")
    .filter((key) => {
      return (
        !usersToHide.includes(key) &&
        (usersToShow.length > 0 ? usersToShow.includes(key) : true)
      );
    });

  const dates = sortCollectionsByDate(data.total);

  const content = dates.map((date) => {
    if (!data.total[date]?.merged) return "";
    if (date != "total") return "";

    const timelineContent = getMultipleValuesInput("AGGREGATE_VALUE_METHODS")
      .filter((method) => ["average", "median", "percentile"].includes(method))
      .map((type) => {
        const pullRequestTimelineTable = createTimelineTable(
          data,
          type as StatsType,
          users,
          date
        );
        const pullRequestTimelineBar = createTimelineGanttBar(
          data,
          type as StatsType,
          users,
          date
        );

        return `
      ${pullRequestTimelineTable}
      ${pullRequestTimelineBar}
      `;
      });

    const pullRequestTotal = createTotalTable(data, users, date);

    const pullRequestReviews = createReviewTable(data, users, date);

    const pullRequestQuality = createPullRequestQualityTable(data, users, date);
    const pieChart = createDiscussionsPieChart(data, users, date);
    return `
    ${timelineContent.join("\n")}
    ${pullRequestTotal}
    ${pullRequestReviews}
    ${pullRequestQuality}
    ${pieChart}
    `;
  });

  return `
## Pull Request レポート
このレポートは ${data.total?.total?.closed || 0
    } 件のPRsに基づいています。 READMEは[Pull request analytics action](https://github.com/AlexSim93/pull-request-analytics-action)にて参照ください。
  ${createConfigParamsCode()}
    ${content.join("\n")}
  `;
};
