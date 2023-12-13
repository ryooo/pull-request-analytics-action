import { percentile } from "../../data/preparations/constants";
import { Collection } from "../../data/preparations/types";
import {
  timeToApproveHeader,
  timeToMergeHeader,
  timeToReviewHeader,
  totalMergedPrsHeader,
} from "./constants";
import { createBlock } from "./createBlock";
import { formatMinutesDuration } from "./formatMinutesDuration";
import { StatsType } from "./types";

export const createTimelineTable = (
  data: Record<string, Record<string, Collection>>,
  type: StatsType,
  users: string[],
  date: string
) => {
  const tableRows = users
    .filter((user) => data[user]?.[date]?.merged)
    .sort((a, b) => {
      const aMerged = (data[a]?.[date]?.merged || 0);
      const bMerged = (data[b]?.[date]?.merged || 0);
      return bMerged - aMerged;
    })
    .map((user) => {
      return [
        `**${user}**`,
        formatMinutesDuration(data[user]?.[date]?.[type]?.timeToReview || 0),
        formatMinutesDuration(data[user]?.[date]?.[type]?.timeToApprove || 0),
        formatMinutesDuration(data[user]?.[date]?.[type]?.timeToMerge || 0),
        data[user]?.[date]?.merged?.toString() || "0",
      ];
    });

  const pullRequestTimeLine = createBlock({
    title: `PRタイムライン(${type}${type === "percentile" ? percentile : ""
      }) ${date}`,
    description:
      "**レビューまでの時間** - PRの作成から最初のレビューまでの時間。 \n**承認までの時間** - PRの作成から変更が要求されない最初の承認までの時間。 \n**マージまでの時間** - PRの作成からマージまでの時間。",
    table: {
      headers: [
        "ユーザー",
        timeToReviewHeader,
        timeToApproveHeader,
        timeToMergeHeader,
        totalMergedPrsHeader,
      ],
      rows: tableRows,
    },
  });

  return pullRequestTimeLine;
};
