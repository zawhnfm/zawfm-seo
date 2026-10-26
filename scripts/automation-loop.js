const { detectIssues } = require('./issue-engine');
const { executeIssues } = require('./fix-executor');

async function loadGscMock() {
  return {
    rows: [
      { keys: ['https://zawfm.com/seo-services'], clicks: 12, impressions: 900, ctr: 0.013 },
      { keys: ['https://zawfm.com/blog/seo-guide'], clicks: 2, impressions: 1500, ctr: 0.001 },
    ],
  };
}

async function loadGa4Mock() {
  return {
    rows: [
      {
        dimensionValues: [{ value: 'https://zawfm.com/seo-services' }],
        metricValues: [{ value: '500' }, { value: '0' }],
      },
      {
        dimensionValues: [{ value: 'https://zawfm.com/blog/seo-guide' }],
        metricValues: [{ value: '250' }, { value: '0' }],
      },
    ],
  };
}

async function runAutomationLoop() {
  const gscData = await loadGscMock();
  const ga4Data = await loadGa4Mock();

  const issues = detectIssues(gscData, ga4Data);
  const executed = executeIssues(issues);

  return executed;
}

if (require.main === module) {
  runAutomationLoop().then((result) => {
    console.log(JSON.stringify(result, null, 2));
  }).catch((err) => {
    console.error('Automation loop failed:', err);
    process.exit(1);
  });
}

module.exports = { runAutomationLoop };
