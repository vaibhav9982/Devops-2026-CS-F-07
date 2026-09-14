const { writeFileSync } = require('node:fs');

const status = process.argv[2] || 'NOT_RUN';
const summary = process.argv[3] || 'No test summary was provided.';

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
    '## Summary',
    summary,
    ''
].join('\n');

writeFileSync('feedback.txt', feedback, 'utf8');

console.log('Automated feedback generated successfully.');