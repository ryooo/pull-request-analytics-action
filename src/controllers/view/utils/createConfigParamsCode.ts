import * as core from "@actions/core";

export const createConfigParamsCode = () => {
  return `
<details>
  <summary>設定</summary>

  \`\`\`
  GITHUB_OWNERS_REPOS: ${process.env.GITHUB_OWNERS_REPOS || core.getInput("GITHUB_OWNERS_REPOS")
    }
  REPORT_DATE_START: ${process.env.REPORT_DATE_START || core.getInput("REPORT_DATE_START")
    }
  REPORT_DATE_END: ${process.env.REPORT_DATE_END || core.getInput("REPORT_DATE_END")
    }
  PERCENTILE: ${process.env.PERCENTILE || core.getInput("PERCENTILE")}
  AGGREGATE_VALUE_METHODS: ${process.env.AGGREGATE_VALUE_METHODS ||
    core.getInput("AGGREGATE_VALUE_METHODS")
    }
  \`\`\`
</details>
    `;
};
