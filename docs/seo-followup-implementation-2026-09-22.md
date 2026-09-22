# SEO follow-up implementation — 2026-09-22

## Completed locally

- Removed the legacy PNG hero-poster reference from CSS. Browser inspection now observes only the 316,404-byte WebP poster, rather than both that file and the 459,604-byte PNG.
- Added matching version parameters to the hero poster preload, video poster, WebM, and MP4 URLs. The WebM remains first and played at 1920 × 1080 in browser verification; MP4 remains the fallback.
- Added one-year immutable browser-cache headers for the versioned CSS, JavaScript, and hero-media URLs. Any future edit to those resources must change the corresponding version parameter.
- Added accurate `lastmod` values to the three sitemap entries. These record the visible content update date, not the build or deployment date.
- Added `dateModified` to the two dated content-page WebPage schemas and matched it to each visible `<time>` value.
- Extended `scripts/verify_site.py` to check sitemap dates, visible/schema date consistency, versioned poster reuse, removal of the legacy PNG reference, and cache policy.
- Added `docs/seo-launch-inputs.md` with the factual product, organization, policy, localization, and measurement inputs required for the next phase.

## Verification

- `python3 scripts/verify_site.py`: passed for three indexable pages, unique metadata/canonical/JSON-LD, breadcrumbs, robots, sitemap, 79 internal links/fragments, assets, branded noindex 404, update dates, versioned hero resources, and cache configuration.
- `node --check script.js`, JSON parsing for `vercel.json`, and `git diff --check`: passed.
- Local browser verification: WebM playback succeeded; poster preload and video poster used the same versioned WebP URL; only that WebP poster appeared in the resource inventory; no warning/error console entries were recorded.

The repository remains a zero-dependency static site and has no configured lint, typecheck, or build scripts. Those checks are not reported as passed.

## External state and blocked items

- The Google account currently signed into the browser (`q284528553@gmail.com`) does not have access to the `sc-domain:soulora.ai` Search Console property. No property, verification record, sitemap submission, or indexing request was created or changed.
- GA4 or another analytics identifier is not present in the site source. No analytics account/property was created and no tracking was added.
- About, contact, privacy, terms, Organization/Article schema, registration/download pages, real conversion events, and localized pages remain blocked on factual input listed in `docs/seo-launch-inputs.md`.
- Search volume, CPC, rankings, Google indexing status, traffic, conversions, Core Web Vitals field data, and AI-search citations remain Unknown or Not measured. The public `site:soulora.ai` query is only a snapshot and does not replace Search Console.
