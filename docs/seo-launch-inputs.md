# Soulora SEO launch inputs

This is the minimum factual input required before the remaining launch, trust, conversion, and localization work can be implemented. Do not commit credentials, private keys, personal identification documents, or non-public user data to this repository.

## Confirmed as of 22 September 2026

- Product status: in development. The public website remains a concept preview with no live account, AI chat, download, active waitlist, or payment flow.
- Singapore website language: English. This is a website-market decision and does not establish future text-chat, speech-recognition, or generated-voice support.
- Public support email: `support@soulora.ai`.
- Public operator/legal name, registered address, jurisdiction, policy owner, and legal reviewer: not yet available.
- Product screenshots and recordings approved for public use: not yet available beyond the existing concept-site media.
- Search Console: the available browser account can open `sc-domain:faceenjoy.com`. That property is not evidence of access to, ownership of, or data for `sc-domain:soulora.ai`.
- Analytics: no analytics or Vercel Speed Insights script is installed in the published site source.
- Interim `/privacy`, `/terms`, and `/data-requests` pages describe only the current concept website. They deliberately identify the legal and product details that must be completed before launch.

## 1. Product and conversion

- Update the public product status when it changes from development to closed beta, open beta, or launched.
- Registration URL or the approved secure waitlist endpoint and its expected request/response fields.
- Supported platforms: web, iPhone, Android, macOS, Windows, or other.
- Official store/download URLs for each supported platform and the supported countries/regions.
- Pricing, renewal interval, free limits, paid limits, cancellation route, and launch date, if public.
- The exact events that should count as conversion: registration, first useful conversation, store visit, download, install, or another confirmed event.
- Analytics choice and public measurement identifier, if analytics is approved. Keep secret credentials out of source control. Vercel Speed Insights remains disabled until the free or Plus tier and the related privacy disclosure are approved.

## 2. Product capabilities

- Languages actually supported by text chat, speech recognition, generated voice, support, and legal documents. Website translation alone does not count as product-language support.
- Memory behavior: what is stored, when consent is requested, how a user views/edits/deletes it, retention, and what happens when memory is disabled.
- Voice behavior: live or recorded, supported devices/languages, microphone controls, interruptions, plan limits, and any provider disclosures.
- Account/data deletion and export steps that a real user can complete.
- Real product screenshots or recordings approved for public use, with a short description of what each image proves.

## 3. Organization and policies

- Public operator/legal name and jurisdiction.
- Public brand name if different from the legal name.
- Public contact email is `support@soulora.ai`; add the business address and support URL when available.
- Privacy-policy owner or legal reviewer, effective date, data categories, purposes, processors, retention, training choices, user rights, and deletion/contact process.
- Terms owner or legal reviewer, effective date, eligibility/age rules, acceptable use, billing/cancellation terms, liability language, and governing law.
- Approved social/profile URLs that genuinely represent Soulora.

The unresolved facts are needed before publishing `/about`, `/contact`, `Organization` schema, live collection forms, or product-specific privacy and service terms. The interim policy pages are factual website notices, not a substitute for review by qualified counsel in the actual operating regions.

## 4. Localization

For each launch language, provide:

- Locale and target markets, for example `ja-JP`, `ko-KR`, `th-TH`, `es`, `pt-BR`, or `pt-PT`.
- A native reviewer or accountable translation owner.
- Confirmed product-language capabilities and regional availability.
- Localized product name rules, support contact, pricing/currency, store URLs, and policy versions.

Recommended sequencing remains English first, then only the languages the product can actually support. Singapore can use English unless availability, pricing, or policy differs. Portuguese for Brazil and Portugal should be maintained separately when both are published.

## 5. Search and measurement access

- Google Search Console property access for `sc-domain:soulora.ai`, or confirmation that the property should be created and which Google account should own it. Access to `sc-domain:faceenjoy.com` cannot be reused for Soulora without adding and verifying the Soulora property.
- GA4 or another approved analytics property/measurement ID, if measurement is wanted.
- Optional keyword-data provider and target databases if search volume/CPC estimates are required. Without one, those metrics remain Unknown.

Search Console can verify indexing and performance but is not a search-volume source. Public SERP checks do not replace URL Inspection or the Page Indexing report.

## Remaining information, prioritized

1. Access to or DNS verification authority for `sc-domain:soulora.ai`.
2. Public legal operator name, jurisdiction, registered or service address, and an accountable policy/legal reviewer.
3. A real registration or waitlist endpoint when available, plus supported platforms, store/download URLs, countries, pricing, and conversion definitions.
4. Actual product-language support for text, speech recognition, generated voice, support, and legal documents. Singapore website content will remain English unless this changes.
5. Actual account, conversation, memory, audio, model-provider, retention, export, and deletion behavior before any live service collects data.
6. Approved product screenshots or recordings and official social/profile URLs.
7. Measurement decision: no analytics, free Vercel Speed Insights, Speed Insights Plus, GA4, or another approved provider.

## Vercel Speed Insights cost note

Vercel's official “Limits and Pricing for Speed Insights” page, last updated 1 September 2026 and checked 22 September 2026, states that base Speed Insights is free on all plans and includes 10,000 events over the last 30 days shared across the team. When that allocation is exceeded, ingestion for base Speed Insights is paused rather than billed. Speed Insights Plus costs USD 10 per project per month on Pro, includes the first 10,000 events across the team, and then charges USD 0.65 per 10,000 additional events. Pricing can change, so verify the current dashboard and official page before enabling Plus: https://vercel.com/docs/speed-insights/limits-and-pricing
