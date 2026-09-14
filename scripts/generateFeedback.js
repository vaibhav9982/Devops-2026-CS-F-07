const { writeFileSync } = require('node:fs');

const status = process.env.TEST_STATUS || 'NOT_RUN';
const summary = process.env.TEST_SUMMARY || 'No test summary was provided.';
const buildNumber = process.env.BUILD_NUMBER || 'local';
const buildUrl = process.env.BUILD_URL || 'Unavailable';
const commit = process.env.GIT_COMMIT || 'Unavailable';
const generatedAt = new Date().toISOString();

const feedback = [
  '# Automated Test Feedback',
  '',
  `- Status: **${status}**`,
  `- Build: ${buildNumber}`,
  `- Build URL: ${buildUrl}`,
  `- Commit: ${commit}`,
  `- Generated at: ${generatedAt}`,
  '',
  `## Summary`,
  summary,
  ''
].join('\n');

writeFileSync('feedback.txt', feedback, 'utf8');
