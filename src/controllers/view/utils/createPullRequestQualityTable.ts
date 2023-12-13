import { Collection } from "../../data/preparations/types";
import {
  commentsReceivedHeader,
  discussionsHeader,
  requestChangesReceived,
  totalMergedPrsHeader,
} from "./constants";
import { createBlock } from "./createBlock";

export const createPullRequestQualityTable = (
  data: Record<string, Record<string, Collection>>,
  users: string[],
  date: string
) => {
  const tableRowsTotal = users
    .sort((a, b) => {
      const aMerged = (data[a]?.[date]?.merged || 0);
      const bMerged = (data[b]?.[date]?.merged || 0);
      return bMerged - aMerged;
    })
    .filter(
      (user) =>
        data[user]?.[date]?.merged ||
        // data[user]?.[date]?.discussions ||
        data[user]?.[date]?.reviewComments ||
        data["total"]?.[date]?.reviewsConducted?.[user]?.["CHANGES_REQUESTED"]
    )
    .map((user) => {
      return [
        `**${user}**`,
        data[user]?.[date]?.merged?.toString() || "0",
        data["total"]?.[date]?.reviewsConducted?.[user]?.[
          "CHANGES_REQUESTED"
        ]?.toString() || "0",
        // data[user]?.[date]?.discussions?.toString() || "0",
        data[user]?.[date]?.reviewComments?.toString() || "0",
      ];
    });

  return createBlock({
    title: `PR 品質 ${date}`,
    description:
      "",
    table: {
      headers: [
        "ユーザー",
        totalMergedPrsHeader,
        requestChangesReceived,
        // discussionsHeader,
        commentsReceivedHeader,
      ],
      rows: tableRowsTotal,
    },
  });
};
