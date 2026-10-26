require('dotenv').config();

const fs = require('fs');
const fetch = require('node-fetch');

const { detectIssues } = require('./issue-engine');
const { executeIssues } = require('./fix-executor');

function assertEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env variable: ${name}`);
  }
  return value;
}

async function fetchGscData() {
  const token = assertEnv('GSC_API_KEY');
  const siteUrl = assertEnv('SITE_URL');

  const response = await fetch(
    `https://www.googleapis.com/webmasters/v1/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        startDate: '2025-10-01',
        endDate: '2025-10-26',
        dimensions: ['page', 'query'],
        rowLimit: 50,
      }),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GSC request failed: ${text}`);
  }

  return response.json();
}

async function fetchGa4Data() {
  const secretPath = assertEnv('GA4_SECRET');
  const propertyId = assertEnv('GA4_PROPERTY_ID');

  const { google } = require('googleapis');
  const auth = new google.auth.GoogleAuth({
    keyFile: secretPath,
    scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
  });

  const authClient = await auth.getClient();
  const analytics = google.analyticsdata({ version: 'v1beta', auth: authClient });

  const result = await analytics.properties.runReport({
    property: `properties/${propertyId}`,
    requestBody: {
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'pagePathPlusQueryString' }],
      metrics: [{ name: 'screenPageViews' }, { name: 'conversions' }],
      limit: 20,
    },
  });

  return result.data;
}

async function postToWordPress(issue, decision) {
  const url = assertEnv('WP_API_URL');
  const token = assertEnv('WP_API_TOKEN');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ issue, decision }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`WordPress update failed: ${text}`);
  }

  return response.json();
}

async function saveReviewQueue(issue) {
  const queueFile = 'review-queue.json';
  let items = [];

  if (fs.existsSync(queueFile)) {
    items = JSON.parse(fs.readFileSync(queueFile, 'utf8'));
  }

  items.push(issue);
  fs.writeFileSync(queueFile, JSON.stringify(items, null, 2));
  return items;
}

async function runProduction() {
  const dryRun = process.env.DRY_RUN === 'true';

  const gscData = await fetchGscData();
  const ga4Data = await fetchGa4Data();

  const issues = detectIssues(gscData, ga4Data);
  const routed = executeIssues(issues);

  const outputs = [];

  for (const item of routed) {
    if (dryRun) {
      outputs.push({
        ...item,
        status: 'dry_run_only',
      });
      continue;
    }

    if (item.decision === 'auto') {
      const wpResult = await postToWordPress(item, item.decision);
      outputs.push({
        ...item,
        status: 'auto_applied',
        wp_result: wpResult,
      });
      continue;
    }

    if (item.decision === 'review') {
      await saveReviewQueue(item);
      outputs.push({
        ...item,
        status: 'queued_for_review',
      });
      continue;
    }

    await saveReviewQueue(item);
    outputs.push({
      ...item,
      status: 'manual_review_required',
    });
  }

  fs.writeFileSync('production-run.json', JSON.stringify(outputs, null, 2));
  return outputs;
}

if (require.main === module) {
  runProduction().then((result) => {
    console.log(JSON.stringify(result, null, 2));
  }).catch((err) => {
    console.error('Production run failed:', err.message);
    process.exit(1);
  });
}

module.exports = { runProduction };
