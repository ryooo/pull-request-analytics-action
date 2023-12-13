import { percentile } from "../../data/preparations/constants";
import { Collection } from "../../data/preparations/types";
import {
  timeToApproveHeader,
  timeToMergeHeader,
  timeToReviewHeader,
} from "./constants";
import { createGanttBar } from "./createGanttBar";
import { StatsType } from "./types";

export const createTimelineGanttBar = (
  data: Record<string, Record<string, Collection>>,
  type: StatsType,
  users: string[],
  date: string
) => {
  return createGanttBar({
    title: `PRタイムライン(${type}${type === "percentile" ? percentile : ""
      }) ${date} / minutes`,
    sections: users
      .sort((a, b) => {
        const aMerged = (data[a]?.[date]?.merged || 0);
        const bMerged = (data[b]?.[date]?.merged || 0);
        return bMerged - aMerged;
      })
      .filter(
        (user) =>
          data[user]?.[date]?.[type]?.timeToReview &&
          data[user]?.[date]?.[type]?.timeToApprove &&
          data[user]?.[date]?.[type]?.timeToMerge
      )
      .map((user) => ({
        name: user,
        bars: [
          {
            name: timeToReviewHeader,
            start: 0,
            end: data[user]?.[date]?.[type]?.timeToReview || 0,
          },
          {
            name: timeToApproveHeader,
            start: 0,
            end: data[user]?.[date]?.[type]?.timeToApprove || 0,
          },
          {
            name: timeToMergeHeader,
            start: 0,
            end: data[user]?.[date]?.[type]?.timeToMerge || 0,
          },
        ],
      })),
  });
};
