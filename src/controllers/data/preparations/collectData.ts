import { format, parseISO } from "date-fns";
import { makeComplexRequest } from "../requests";
import { Collection } from "./types";
import {
  prepareReviews,
  prepareDiscussions,
  preparePullRequestInfo,
  preparePullRequestStats,
  preparePullRequestTimeline,
} from "./utils";

export const collectData = (
  data: Awaited<ReturnType<typeof makeComplexRequest>>
) => {
  const collection: Record<string, Record<string, Collection>> = { total: {} };

  data.pullRequestInfo.forEach((pullRequest, index) => {
    if (pullRequest === undefined || pullRequest === null) {
      return;
    }
    const closedDate = pullRequest.closed_at
      ? parseISO(pullRequest.closed_at)
      : null;

    const dateKey = closedDate ? format(closedDate, "y年M月") : "invalidDate";

    const userKey = pullRequest.user.login || "invalidUser";
    if (!collection[userKey]) {
      collection[userKey] = {};
    }

    ["total", userKey].forEach((key) => {
      ["total", dateKey].forEach((innerKey) => {
        collection[key][innerKey] = preparePullRequestInfo(
          pullRequest,
          collection[key][innerKey]
        );
        collection[key][innerKey] = preparePullRequestTimeline(
          pullRequest,
          data.reviews[index],
          collection[key][innerKey]
        );
      });
    });

    prepareReviews(data, collection, index, dateKey, pullRequest.user.login);
    prepareDiscussions(
      data.comments,
      collection,
      index,
      dateKey,
      pullRequest.user.login
    );
  });

  Object.entries(collection).map(([key, value]) => {
    Object.entries(value).forEach(([innerKey, innerValue]) => {
      collection[key][innerKey] = preparePullRequestStats(innerValue);
    });
  });
  return collection;
};
