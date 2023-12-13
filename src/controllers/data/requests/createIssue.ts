import * as core from "@actions/core";
import { octokit } from "../../octokit";
import { format } from "date-fns";
import { getMultipleValuesInput } from "../../utils";

export const createIssue = (markdown: string) => {
  const issueTitle =
    core.getInput("ISSUE_TITLE") ||
    process.env.ISSUE_TITLE ||
    `Pull requests レポート(${format(new Date(), "yyyy-MM-d HH:mm")})`;
  const labels =
    getMultipleValuesInput("LABELS").filter(
      (label) => label && typeof label === "string"
    ) || [];
  const assignees =
    getMultipleValuesInput("ASSIGNEES").filter(
      (assignee) => assignee && typeof assignee === "string"
    ) || [];

  octokit.rest.issues.create({
    repo:
      core.getInput("GITHUB_REPO_FOR_ISSUE") ||
      process.env.GITHUB_REPO_FOR_ISSUE!,
    owner:
      core.getInput("GITHUB_OWNER_FOR_ISSUE") ||
      process.env.GITHUB_OWNER_FOR_ISSUE!,
    title: issueTitle,
    body: markdown,
    labels,
    assignees,
  });
};
