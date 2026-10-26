# SEO Automation Playbook

## Goal
Build a semi-autonomous SEO operations system for a WordPress + Elementor + Rank Math website.

## Core principle
Safe automation first. High-risk changes require human review.

## Components
- WordPress + Elementor + Rank Math
- Claude / AI generation
- Ahrefs keyword and competitor insights
- Google Search Console
- GA4 analytics
- GitHub Actions for monitoring and issue tracking
- Custom WordPress plugin for safe SEO updates

## Automation rules

### 1. Title & meta optimization
- If a page has low CTR for a target keyword, generate a new title and meta description.
- Apply only if the title and meta remain within brand and intent constraints.
- If title is highly strategic or homepage-related, require human review.

### 2. Schema automation
- If a page has no Article, Service, FAQ, or Breadcrumb schema, generate it.
- Apply automatically for blog posts and service pages.
- Skip if schema would conflict with existing structured data.

### 3. Internal linking
- If a page has no internal links and is eligible for relevant linking, add 2-5 internal links from related content.
- Only link to pages that match the same topical cluster.
- Require approval for homepage or category mass-linking changes.

### 4. Technical SEO checks
- Validate sitemap
- Validate canonical tags
- Validate robots.txt consistency
- Check crawl errors and 404 spikes
- Trigger redirect creation for obvious broken URL patterns

### 5. Indexing checks
- If a page is not indexed and has no canonical or robots issue, request reindex.
- If coverage issue persists, escalate to GitHub issue with details.

### 6. GA4 / conversion health
- If landing page conversion rate drops, inspect CTA, hero section, trust elements, and keyword alignment.
- If bounce rate rises sharply, inspect top-of-page structure and intent mismatch.
- Trigger content refresh suggestions for weak landing pages.

### 7. GSC performance issues
- If CTR drops on a high-impression page, refresh title and meta.
- If impressions fall while rankings are stable, inspect query expansion opportunities.
- If a page drops out of top results, review content depth and internal competition.

## Safe fix categories

### Auto-apply
- Title refresh
- Meta description refresh
- FAQ block generation
- Image alt text generation
- Schema insertion
- Internal link additions for adjacent pages
- Redirect creation for obvious 404s

### Require review
- Homepage transformation
- Major content rewrite
- Keyword strategy shift
- Category-wide restructuring
- Large internal link overhaul
- Major CTA redesign

## Issue workflow
1. Monitoring script detects a problem.
2. Script writes a structured issue summary.
3. GitHub issue is created with page URL, type, severity, and suggested fix.
4. Claude analyzes the issue.
5. Low-risk fix is applied automatically.
6. High-risk fix waits for human approval.

## Files in this repo
- `scripts/` — GSC/GA4/sitemap/broken link checks
- `plugins/zawfm-seo-automation/` — WordPress integration hooks
- `prompts/` — AI SEO prompt templates
- `.github/workflows/` — scheduled automation

## Next implementation steps
1. Add GSC + GA4 issue classification script
2. Add WordPress REST webhook for automated updates
3. Add Claude API integration for metadata/schema generation
4. Add human approval task layer for risky edits
5. Add reporting dashboard for ranking and health trends
