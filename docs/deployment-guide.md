# Zawfm SEO Deployment Guide

## 1. Install dependencies

```bash
npm install
```

## 2. Copy environment file

```bash
cp .env.example .env
```

Fill in the real values for:
- SITE_URL
- GSC_API_KEY
- GA4_SECRET
- GA4_PROPERTY_ID
- WP_API_URL
- WP_API_TOKEN

## 3. Validate GSC access

Run the script:

```bash
node scripts/gsc-api-demo.js
```

If it fails, check:
- API enabled in Google Cloud
- service account / OAuth credentials valid
- site access granted in Search Console

## 4. Validate GA4 access

Run:

```bash
node scripts/ga4-api-demo.js
```

If it fails, check:
- GA4 property selected correctly
- Analytics Data API enabled
- service account linked to the property

## 5. Run issue detection locally

```bash
node scripts/automation-loop.js
```

This should produce issue objects with decision routing.

## 6. Install WordPress plugin

Copy `plugins/zawfm-seo-automation/zawfm-seo-workflow.php` into a WordPress plugin directory and activate it.

Verify the endpoint:

```bash
https://your-site.com/wp-json/zawfm-seo/v1/apply-fix
```

## 7. Staging validation

Test the WordPress integration in staging first.

Recommended flow:
- run in dry-run mode
- inspect issue output
- verify fix actions
- allow only low-risk automatic fixes
- send high-risk actions to review queue

## 8. Production launch

When staging is stable:
- set `AUTO_FIX_ENABLED=true`
- set `DRY_RUN=false`
- enable only low-risk automatic actions initially
- keep manual review for conversion and homepage-level edits

## 9. Monitoring

Run the automation loop on a schedule and keep logs of:
- issue type
- severity
- page URL
- decision
- applied action
- review status
