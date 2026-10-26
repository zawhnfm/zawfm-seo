const fs = require('fs');

function classifyFix(issue) {
  const lowRiskTypes = [
    'ctr_drop',
    'indexing_or_ctr_problem',
    'missing_schema',
    'internal_link_gap',
    'alt_text_gap',
    'canonical_issue',
  ];

  const mediumRiskTypes = [
    'conversion_gap',
    'engagement_drop',
    'service_page_underperformance',
  ];

  if (lowRiskTypes.includes(issue.issue_type)) {
    return 'auto';
  }

  if (mediumRiskTypes.includes(issue.issue_type)) {
    return 'review';
  }

  return 'manual';
}

function buildFixAction(issue) {
  switch (issue.issue_type) {
    case 'ctr_drop':
      return {
        action: 'refresh_title_and_meta',
        details: 'Update title and meta description to better match search intent.',
      };
    case 'indexing_or_ctr_problem':
      return {
        action: 'recheck_indexing_and_title',
        details: 'Verify index status and improve title/query relevance.',
      };
    case 'missing_schema':
      return {
        action: 'insert_schema',
        details: 'Insert Article or Service schema in page JSON-LD.',
      };
    case 'internal_link_gap':
      return {
        action: 'add_internal_links',
        details: 'Insert 2-5 contextual internal links from related pages.',
      };
    case 'conversion_gap':
      return {
        action: 'review_cta_and_offer',
        details: 'Review CTA, hero section, and conversion message before editing copy.',
      };
    default:
      return {
        action: 'manual_review',
        details: 'Flag for human evaluation.',
      };
  }
}

function executeIssues(issues) {
  const results = [];

  for (const issue of issues) {
    const decision = classifyFix(issue);
    const action = buildFixAction(issue);

    if (decision === 'auto') {
      results.push({
        ...issue,
        decision,
        action: action.action,
        details: action.details,
        status: 'applied_auto',
      });
    } else if (decision === 'review') {
      results.push({
        ...issue,
        decision,
        action: action.action,
        details: action.details,
        status: 'queued_for_review',
      });
    } else {
      results.push({
        ...issue,
        decision,
        action: action.action,
        details: action.details,
        status: 'manual_review_required',
      });
    }
  }

  return results;
}

if (require.main === module) {
  const sampleIssues = [
    {
      page_url: 'https://zawfm.com/seo-services',
      issue_type: 'ctr_drop',
      severity: 'high',
      detection_source: 'GSC',
      suggested_fix: 'Refresh title and meta description.',
      risk_level: 'low',
      requires_human_approval: false,
    },
    {
      page_url: 'https://zawfm.com/landing-page',
      issue_type: 'conversion_gap',
      severity: 'medium',
      detection_source: 'GA4',
      suggested_fix: 'Review CTA and conversion messaging.',
      risk_level: 'medium',
      requires_human_approval: true,
    },
  ];

  const executed = executeIssues(sampleIssues);
  fs.writeFileSync('issue-execution-plan.json', JSON.stringify(executed, null, 2));
  console.log(JSON.stringify(executed, null, 2));
}

module.exports = { executeIssues, classifyFix, buildFixAction };
