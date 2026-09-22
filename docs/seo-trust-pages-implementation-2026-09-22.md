# Soulora trust-page implementation

Date: 22 September 2026. Production domain: https://soulora.ai/.

## Implemented

- Added indexable `/privacy`, `/terms`, and `/data-requests` pages using the existing static HTML and shared design system.
- Kept every statement within the current product boundary: Soulora is in development, the website is a concept preview, and no account, live AI chat, download, payment, active waitlist, analytics, or configured form endpoint exists.
- Published the confirmed support address `support@soulora.com` and added it to trust navigation.
- Explained that Vercel hosting may process ordinary technical request information, while the current source does not install cookies, analytics, local storage, session storage, or Speed Insights.
- Added a practical process for access, export, correction, deletion, objection, and restriction requests concerning support correspondence or identifiable technical records.
- Added unique title, description, canonical, Open Graph, Twitter metadata, WebPage and BreadcrumbList JSON-LD, visible update dates, sitemap entries, and internal links for all three pages.
- Updated the homepage trust links and status wording without changing the visual system or preview behavior.

## Explicitly unresolved

- Public operator/legal name, registered address, jurisdiction, privacy owner, terms owner, and qualified legal reviewer.
- Product-specific age rules, data categories, processors, model providers, training choices, retention, account deletion, content export, payment, cancellation, consumer rights, governing law, disputes, liability language, and regulator/appeal routes.
- Registration, waitlist, download, store, platform, pricing, launch-country, and conversion details.
- Product-language support. Only the website-language decision is confirmed: English, including for Singapore.
- Search Console access for `sc-domain:soulora.ai`. Access to `sc-domain:faceenjoy.com` is unrelated and was not used as Soulora evidence.
- Analytics and field performance data. Speed Insights remains uninstalled pending a measurement and privacy decision.

## Verification

- `python3 scripts/verify_site.py`
- `node --check script.js`
- `python3 -m json.tool vercel.json`
- `git diff --check`

The repository has no package manifest, lint script, typechecker, or build step. The deployed static files are the source files.
