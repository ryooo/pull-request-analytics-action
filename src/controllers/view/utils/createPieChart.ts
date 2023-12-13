export const createPieChart = (
  title: string,
  values: Record<string, number>
) => {
  if (values.length === 0) {
    return ''
  }
  return `
\`\`\`mermaid
pie
title ${title}
${Object.entries(values)
      .map(([key, value]) => {
        return `"${key}(${value})":${value}`;
      })
      .join("\n")}
\`\`\`
    `;
};
