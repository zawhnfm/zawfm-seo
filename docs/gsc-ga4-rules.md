# GSC / GA4 detection rules

## Goal
Detect search and conversion problems automatically and turn them into actionable SEO issues.

## GSC issue categories

### 1. Indexing issues
- Page is not indexed
- Coverage issue detected
- Soft 404 or blocked URL
- Duplicate canonical problem

### 2. CTR issues
- Page gets impressions but CTR is low
- Likely cause: weak title or meta description

### 3. Impression decline
- Search impressions are falling despite historical stability
- Likely cause: query drift, ranking loss, or content relevance decline

### 4. Page-level ranking drift
- A previously ranking page drops into lower positions
- Likely cause: content freshness, competition, or weak on-page optimization

## GA4 issue categories

### 1. Landing page conversion drop
- Sessions stable but conversions fall
- Likely cause: weak CTA, poor UX, weak offer alignment

### 2. Engagement collapse
- Bounce rate increases sharply
- Likely cause: mismatch between keyword intent and page content

### 3. Service page underperformance
- Traffic exists but conversion is weak
- Likely cause: hero section, trust blocks, or CTA weak

### 4. Blog traffic without conversion
- Blog page attracts traffic but no downstream action
- Likely cause: no CTA or weak topic-to-offer connection

## Severity levels

### Level 1 - Critical
- Page is not indexed
- Site-wide 404 spike
- Search Console coverage is broken
- Large conversion drop on a high-value page

### Level 2 - High
- CTR drop on a key landing page
- Large ranking decline on a core service page
- Significant bounce increase on top pages

### Level 3 - Medium
- Minor metadata weakness
- Low internal link count on a page
- Missing schema on a secondary page

### Level 4 - Low
- Non-critical documentation improvement
- Minor alt text gaps

## Auto-fix policy

### Auto-fix allowed
- Title refresh
- Meta description refresh
- FAQ insert
- Schema insert
- Internal links to related content
- Alt text generation
- Redirect for obvious 404s

### Human approval required
- Homepage edit
- Major service-page rewrite
- Keyword strategy repositioning
- Main conversion path redesign
- Content rewrite of high-value pages

## Issue format
Each detected issue should include:
- page_url
- issue_type
- severity
- detection_source (GSC/GA4)
- suggested_fix
- confidence_score
- risk_level
- requires_human_approval

## Example issue object
```json
{
  "page_url": "https://zawfm.com/seo-services",
  "issue_type": "ctr_drop",
  "severity": "high",
  "detection_source": "GSC",
  "suggested_fix": "Refresh title and meta description to align with service intent",
  "confidence_score": 0.87,
  "risk_level": "low",
  "requires_human_approval": false
}
```
