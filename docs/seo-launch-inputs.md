# Soulora SEO launch inputs

This is the minimum factual input required before the remaining launch, trust, conversion, and localization work can be implemented. Do not commit credentials, private keys, personal identification documents, or non-public user data to this repository.

## 1. Product and conversion

- Public product status: concept, closed beta, open beta, or launched.
- Registration URL or the approved secure waitlist endpoint and its expected request/response fields.
- Supported platforms: web, iPhone, Android, macOS, Windows, or other.
- Official store/download URLs for each supported platform and the supported countries/regions.
- Pricing, renewal interval, free limits, paid limits, cancellation route, and launch date, if public.
- The exact events that should count as conversion: registration, first useful conversation, store visit, download, install, or another confirmed event.
- Analytics choice and public measurement identifier, if analytics is approved. Keep secret credentials out of source control.

## 2. Product capabilities

- Languages actually supported by text chat, speech recognition, generated voice, support, and legal documents. Website translation alone does not count as product-language support.
- Memory behavior: what is stored, when consent is requested, how a user views/edits/deletes it, retention, and what happens when memory is disabled.
- Voice behavior: live or recorded, supported devices/languages, microphone controls, interruptions, plan limits, and any provider disclosures.
- Account/data deletion and export steps that a real user can complete.
- Real product screenshots or recordings approved for public use, with a short description of what each image proves.

## 3. Organization and policies

- Public operator/legal name and jurisdiction.
- Public brand name if different from the legal name.
- Public contact email and, if available, business address or support URL.
- Privacy-policy owner or legal reviewer, effective date, data categories, purposes, processors, retention, training choices, user rights, and deletion/contact process.
- Terms owner or legal reviewer, effective date, eligibility/age rules, acceptable use, billing/cancellation terms, liability language, and governing law.
- Approved social/profile URLs that genuinely represent Soulora.

These facts are needed before publishing `/about`, `/contact`, `/privacy`, `/terms`, `Organization` schema, or live collection forms. Legal text should be reviewed by qualified counsel for the actual operating regions.

## 4. Localization

For each launch language, provide:

- Locale and target markets, for example `ja-JP`, `ko-KR`, `th-TH`, `es`, `pt-BR`, or `pt-PT`.
- A native reviewer or accountable translation owner.
- Confirmed product-language capabilities and regional availability.
- Localized product name rules, support contact, pricing/currency, store URLs, and policy versions.

Recommended sequencing remains English first, then only the languages the product can actually support. Singapore can use English unless availability, pricing, or policy differs. Portuguese for Brazil and Portugal should be maintained separately when both are published.

## 5. Search and measurement access

- Google Search Console property access for `sc-domain:soulora.ai`, or confirmation that the property should be created and which Google account should own it.
- GA4 or another approved analytics property/measurement ID, if measurement is wanted.
- Optional keyword-data provider and target databases if search volume/CPC estimates are required. Without one, those metrics remain Unknown.

Search Console can verify indexing and performance but is not a search-volume source. Public SERP checks do not replace URL Inspection or the Page Indexing report.
