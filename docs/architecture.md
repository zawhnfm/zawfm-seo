# Architecture Overview

## Objective
The goal is to create an automated SEO operations loop for a live WordPress site using AI and monitored search performance data.

## Data flow
1. The WordPress site publishes or updates content.
2. The custom plugin reads the page structure.
3. Claude generates SEO metadata and schema recommendations.
4. WordPress stores the optimized metadata.
5. GA4 and GSC monitor search traffic and engagement.
6. A scheduled script checks for drops, gaps, failures, and missing schema.
7. GitHub issues are created for actionable SEO work.
8. Low-risk fixes are applied automatically.
9. High-risk fixes require human approval.

## Key principles
- Search performance drives optimization.
- Safe edits are automated.
- High-risk edits are reviewed manually.
- Content quality remains the main ranking signal.

## Component map
- Content layer: WordPress + Elementor + Rank Math
- AI layer: Claude
- Signal layer: GSC + GA4 + Ahrefs
- Automation layer: GitHub Actions + Node scripts + custom plugin
- Governance layer: review gates and issue tracking
