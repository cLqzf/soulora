# Preview and media refinement — 2026-09-21

## Changes

- Homepage primary navigation and hero actions now lead to the interactive preview, rather than implying that an early-access application is available. The secondary hero link opens the walkthrough. Existing feedback anchors and form behavior remain intact.
- Feedback labels explicitly describe a preview. Email help suggests example data; the optional research choice does not promise a real invitation. The pending label says “Checking preview…” without an endpoint, and restores its original label after completion.
- The walkthrough H1 and breadcrumb name now say “How Soulora works.”
- The existing 1920 × 1080, 24 fps WebM is first in the video source list. The original MP4 remains the fallback. Neither video file was changed.
- Added a lossless WebP poster and an image preload for that exact URL. The original PNG remains available. No layout or video-playback code was changed.
- Added a branded static `404.html`, using existing styles, recovery links, and `noindex, follow`. It has no canonical and is excluded from the sitemap. No catch-all rewrite was introduced.
- Extended the static checker to validate the error-page publication policy and preloaded resource existence.

## Evidence and validation

- Existing MP4: 2,323,009 bytes. Existing WebM: 419,094 bytes, 82.0% smaller. Both are 1920 × 1080 at 24 fps, approximately 7.04 seconds. This is a file-size comparison, not a measured page-speed or traffic gain.
- FFmpeg comparison of all video frames reported SSIM All = 0.996998. This supplements visual inspection; it is not a guarantee of identical rendering or decoding performance on every device.
- Original PNG poster: 459,604 bytes. Lossless WebP: 316,404 bytes, 31.2% smaller. Pillow RGB pixel comparison found no difference, with dimensions retained at 1920 × 1080.
- Browser confirmed selection and playback of WebM at 1920 × 1080, with the new poster URL. Desktop and 390 px mobile hero layouts were inspected. No document horizontal overflow at 390 px.
- Primary CTA reaches `#experience`. The walkthrough link and 404 recovery link resolve correctly.
- Local form test used `name@example.com`, selected a sample use case and platform, and completed the preview. The result explicitly stated nothing was uploaded or saved. The button returned to “Preview the final step”. No browser warnings/errors were recorded before the intentional missing-page test.
- The temporary local server returned HTTP 404 with the branded page. The 390 px error-page layout has no document horizontal overflow. This local simulation does not prove Vercel production handling.
- `python3 scripts/verify_site.py`: passed for three indexable pages, 79 internal links/fragments, metadata, canonical, JSON-LD, robots, sitemap, referenced assets, and the separate error-page policy.
- `node --check script.js` and `git diff --check`: passed.
- No dependencies or build system were added. The repository still has no configured lint, typecheck, or build commands; those checks are not reported as passed.

## Remaining / unverified

These changes are local and have not been committed or deployed in this round. Verify production 404 status, content, and media URLs after deployment. Cross-browser MP4 fallback and performance on physical devices remain untested.

Core Web Vitals, search indexing, rankings, traffic, conversion rates, and AI-search citations remain Not measured / Unknown. The earlier PageSpeed request returned HTTP 429; no performance score is inferred from file-size savings.

Real registration/downloads, feedback collection, operator details, policies, multilingual product support, analytics/Search Console configuration, and the Vercel domain-level www 307 redirect remain separate work requiring real product facts or service configuration. No connected-service settings were changed.
