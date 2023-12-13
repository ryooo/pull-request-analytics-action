import { Collection } from "../../data/preparations/types";
import {
  commentsConductedHeader,
  discussionsConductedHeader,
  reviewTypesHeader,
  totalMergedPrsHeader,
} from "./constants";
import { createBlock } from "./createBlock";

export const createReviewTable = (
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
        data[user]?.[date]?.reviewsConducted?.total?.total
    )
    .map((user) => {
      return [
        `**${user}**`,
        data[user]?.[date]?.merged?.toString() || "0",
        data[user]?.[date]?.commentsConducted?.toString() || "0",
        `${data[user]?.[
          date
        ]?.reviewsConducted?.total?.CHANGES_REQUESTED?.toString() || 0
        } / ${data[user]?.[date]?.reviewsConducted?.total?.COMMENTED?.toString() ||
        0
        } / ${data[user]?.[date]?.reviewsConducted?.total?.APPROVED?.toString() || 0
        }`,
      ];
    });

  return createBlock({
    title: `Pull requests レビュー ${date}`,
    description:
      "**変更要求数 / コメント数 / 承認数** - ユーザーが行ったレビューの数。単一のプルリクエストの場合、ユーザーごとに各ステ​​ータスのレビューが1件だけカウントされます。",
    table: {
      headers: [
        "ユーザー",
        totalMergedPrsHeader,
        commentsConductedHeader,
        reviewTypesHeader,
      ],
      rows: tableRowsTotal,
    },
  });
};
