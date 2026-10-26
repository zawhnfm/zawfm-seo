const { google } = require('googleapis');

async function getGa4Data() {
  const keyFile = process.env.GA4_SECRET;

  if (!keyFile) {
    throw new Error('Missing GA4_SECRET');
  }

  const auth = new google.auth.GoogleAuth({
    keyFile,
    scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
  });

  const authClient = await auth.getClient();
  const analytics = google.analyticsdata({ version: 'v1beta', auth: authClient });

  const propertyId = process.env.GA4_PROPERTY_ID || 'G-XXXXXXXXXX';

  const response = await analytics.properties.runReport({
    property: `properties/${propertyId}`,
    requestBody: {
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'pagePathPlusQueryString' }],
      metrics: [{ name: 'screenPageViews' }, { name: 'conversions' }],
      limit: 20,
    },
  });

  return response.data;
}

(async () => {
  try {
    const results = await getGa4Data();
    console.log(JSON.stringify(results, null, 2));
  } catch (err) {
    console.error('GA4 API error:', err.message);
    process.exit(1);
  }
})();
