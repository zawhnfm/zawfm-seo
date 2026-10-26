const fs = require('fs');

function createIssue(pageUrl, issueType, severity, source, suggestedFix, riskLevel, requiresHumanApproval) {
  return {
    page_url: pageUrl,
    issue_type: issueType,
    severity,
    detection_source: source,
    suggested_fix: suggestedFix,
    confidence_score: 0.9,
    risk_level: riskLevel,
    requires_human_approval: requiresHumanApproval,
  };
}

function detectIssues(gscData, ga4Data) {
  const issues = [];

  const gscRows = gscData?.rows || [];
  const ga4Rows = ga4Data?.rows || [];

  if (gscRows.length === 0 && ga4Rows.length === 0) {
    return issues;
  }

  for (const row of gscRows) {
    const page = row.keys?.[0] || 'unknown';
    const clicks = Number(row.clicks || 0);
    const impressions = Number(row.impressions || 0);
    const ctr = Number(row.ctr || 0);

    if (impressions > 200 && ctr < 0.02) {
      issues.push(createIssue(page, 'ctr_drop', 'high', 'GSC', 'Refresh title and meta description to improve click intent alignment.', 'low', false));
    }

    if (impressions > 500 && clicks === 0) {
      issues.push(createIssue(page, 'indexing_or_ctr_problem', 'high', 'GSC', 'Check page indexing and keyword alignment; pages with no clicks often need stronger titles or better query match.', 'low', false));
    }
  }

  for (const row of ga4Rows) {
    const page = row.dimensionValues?.[0]?.value || 'unknown';
    const pageViews = Number(row.metricValues?.[0]?.value || 0);
    const conversions = Number(row.metricValues?.[1]?.value || 0);

    if (pageViews > 100 && conversions === 0) {
      issues.push(createIssue(page, 'conversion_gap', 'medium', 'GA4', 'Review CTA, value proposition, and offer clarity on the landing page.', 'medium', true));
    }
  }

  return issues;
}

module.exports = { detectIssues, createIssue };

if (require.main === module) {
  const mockGsc = {
    rows: [
      { keys: ['https://zawfm.com/seo-services'], clicks: 12, impressions: 900, ctr: 0.013 },
      { keys: ['https://zawfm.com/blog/seo-guide'], clicks: 2, impressions: 1500, ctr: 0.001 }
    ]
  };

  const mockGa4 = {
    rows: [
      { dimensionValues: [{ value: 'https://zawfm.com/seo-services' }], metricValues: [{ value: '500' }, { value: '0' }] },
      { dimensionValues: [{ value: 'https://zawfm.com/blog/seo-guide' }], metricValues: [{ value: '250' }, { value: '0' }] }
    ]
  };

  const issues = detectIssues(mockGsc, mockGa4);
  fs.writeFileSync('seo-issues.json', JSON.stringify(issues, null, 2));
  console.log(JSON.stringify(issues, null, 2));
}
