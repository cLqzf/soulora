"""Check published static pages without installing dependencies or making requests."""

import json
from collections import Counter
from datetime import date
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit
import xml.etree.ElementTree as ET


ROOT = Path(__file__).resolve().parents[1]
ORIGIN = "https://soulora.ai"
NS = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}


class Page(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=True)
        self.tags = []
        self.title = []
        self.schemas = []
        self.in_title = False
        self.schema_buffer = None
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.tags.append((tag, attrs))
        if tag == "title":
            self.in_title = True
        if tag == "script" and attrs.get("type") == "application/ld+json":
            self.schema_buffer = []

    def handle_data(self, data):
        if self.in_title:
            self.title.append(data)
        if self.schema_buffer is not None:
            self.schema_buffer.append(data)

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False
        if tag == "script" and self.schema_buffer is not None:
            self.schemas.append(json.loads("".join(self.schema_buffer)))
            self.schema_buffer = None


def require(condition, message):
    if not condition:
        raise ValueError(message)


def source_for(route):
    return ROOT / ("index.html" if route == "/" else route.lstrip("/") + ".html")


def check():
    sitemap = ET.parse(ROOT / "sitemap.xml")
    urls = [node.text for node in sitemap.findall("s:url/s:loc", NS)]
    lastmods = [node.text for node in sitemap.findall("s:url/s:lastmod", NS)]
    require(bool(urls) and len(urls) == len(set(urls)), "Empty or duplicate sitemap URLs")
    require(len(lastmods) == len(urls), "Every sitemap URL must have a lastmod")
    require(all(date.fromisoformat(value) <= date.today() for value in lastmods), "Invalid or future sitemap lastmod")
    pages = {}
    for url in urls:
        parsed = urlsplit(url)
        require(parsed.scheme == "https" and parsed.netloc == "soulora.ai", "Wrong sitemap origin")
        require(not parsed.query and not parsed.fragment, "Noncanonical sitemap URL")
        require(parsed.path == "/" or not parsed.path.endswith("/"), "Unexpected trailing slash")
        pages[url] = Page(source_for(parsed.path).read_text())

    published_files = {source_for(urlsplit(url).path).resolve() for url in urls}
    html_files = {path.resolve() for path in ROOT.rglob("*.html") if not any(part.startswith(".") or part in {"node_modules", "dist"} for part in path.relative_to(ROOT).parts)}
    error_file = ROOT / "404.html"
    require(html_files == published_files | {error_file.resolve()}, "An HTML page is missing from the sitemap or publication policy")
    error_page = Page(error_file.read_text())
    require(sum(tag == "h1" for tag, _ in error_page.tags) == 1, "404: H1 count")
    require(any(tag == "meta" and attrs.get("name") == "robots" and "noindex" in attrs.get("content", "") for tag, attrs in error_page.tags), "404: missing noindex")
    require(not any(tag == "link" and attrs.get("rel") == "canonical" for tag, attrs in error_page.tags), "404: must not canonicalize to a valid page")
    require(ORIGIN + "/404" not in urls, "404: must not be in sitemap")
    for tag, attrs in error_page.tags:
        if tag == "a" and attrs.get("href", "").startswith("/"):
            require(ORIGIN + attrs["href"] in pages, "404: invalid recovery link")
        if tag == "link" and attrs.get("rel") in {"stylesheet", "icon"}:
            require((ROOT / urlsplit(attrs["href"]).path.lstrip("/")).is_file(), "404: missing resource")
    titles, descriptions, graph = [], [], {url: set() for url in urls}
    link_count = 0

    for url, page in pages.items():
        prefix = urlsplit(url).path
        tags = page.tags
        require(sum(tag == "title" for tag, _ in tags) == 1, prefix + ": title count")
        require(sum(tag == "h1" for tag, _ in tags) == 1, prefix + ": H1 count")
        title = "".join(page.title).strip()
        require(bool(title), prefix + ": empty title")
        titles.append(title)
        meta_tags = [attrs for tag, attrs in tags if tag == "meta"]
        names = [attrs.get("name", attrs.get("property")) for attrs in meta_tags]
        require(not any(count > 1 for name, count in Counter(names).items() if name), prefix + ": duplicate metadata")
        meta = {attrs.get("name", attrs.get("property")): attrs.get("content", "") for attrs in meta_tags}
        require(bool(meta.get("description")), prefix + ": missing description")
        descriptions.append(meta["description"])
        require(meta.get("og:title") == meta.get("twitter:title") == title, prefix + ": title inconsistency")
        require(meta.get("og:description") == meta.get("twitter:description") == meta["description"], prefix + ": description inconsistency")
        require(meta.get("og:url") == url, prefix + ": og:url mismatch")
        require([attrs.get("href") for tag, attrs in tags if tag == "link" and attrs.get("rel") == "canonical"] == [url], prefix + ": canonical mismatch")
        require("noindex" not in meta.get("robots", "").lower(), prefix + ": sitemap page has noindex")
        ids = [attrs["id"] for _, attrs in tags if "id" in attrs]
        require(len(ids) == len(set(ids)), prefix + ": duplicate IDs")
        nodes = [node for schema in page.schemas for node in schema.get("@graph", [schema])]
        web_pages = [node for node in nodes if node.get("@type") == "WebPage"]
        require(len(web_pages) == 1, prefix + ": missing/duplicate WebPage schema")
        web_page = web_pages[0]
        require(web_page.get("url") == url and web_page.get("name") == title and web_page.get("description") == meta["description"], prefix + ": WebPage inconsistency")
        require(web_page.get("inLanguage") == "en", prefix + ": schema language")
        entity_ids = [node["@id"] for node in nodes if "@id" in node]
        require(len(entity_ids) == len(set(entity_ids)), prefix + ": duplicate schema IDs")
        require(web_page.get("isPartOf", {}).get("@id") in entity_ids, prefix + ": broken website reference")
        if prefix != "/":
            visible_updates = [attrs.get("datetime") for tag, attrs in tags if tag == "time" and attrs.get("datetime")]
            require(len(visible_updates) == 1 and web_page.get("dateModified") == visible_updates[0], prefix + ": dateModified mismatch")
            crumbs = [node for node in nodes if node.get("@type") == "BreadcrumbList"]
            require(len(crumbs) == 1 and web_page.get("breadcrumb", {}).get("@id") == crumbs[0]["@id"], prefix + ": breadcrumb reference")
            items = crumbs[0]["itemListElement"]
            require([item["position"] for item in items] == list(range(1, len(items) + 1)), prefix + ": breadcrumb positions")
            require(items[-1]["item"] == url and all(item["item"] in pages for item in items), prefix + ": breadcrumb URL")

        for tag, attrs in tags:
            if tag == "a" and "href" in attrs:
                target = urlsplit(urljoin(url, attrs["href"]))
                if target.netloc != "soulora.ai":
                    continue
                destination = ORIGIN + target.path
                require(destination in pages, prefix + ": missing internal page " + destination)
                target_ids = {attr["id"] for _, attr in pages[destination].tags if "id" in attr}
                require(not target.fragment or unquote(target.fragment) in target_ids, prefix + ": missing fragment " + attrs["href"])
                graph[url].add(destination)
                link_count += 1
            keys = ["src", "poster"] if tag in {"script", "img", "video", "source"} else ["href"] if tag == "link" and attrs.get("rel") in {"stylesheet", "icon", "apple-touch-icon", "manifest", "preload"} else []
            for key in keys:
                if attrs.get(key):
                    asset = urlsplit(urljoin(url, attrs[key]))
                    if asset.netloc == "soulora.ai":
                        require((ROOT / asset.path.lstrip("/")).is_file(), prefix + ": missing asset " + asset.path)
            if tag == "img":
                require("alt" in attrs and "width" in attrs and "height" in attrs, prefix + ": missing image attributes")
        require(meta.get("og:image") == meta.get("twitter:image"), prefix + ": share image mismatch")
        share = urlsplit(meta.get("og:image", ""))
        require(share.scheme == "https" and share.netloc == "soulora.ai" and (ROOT / share.path.lstrip("/")).is_file(), prefix + ": share image missing")

    require(len(titles) == len(set(titles)), "Duplicate page titles")
    require(len(descriptions) == len(set(descriptions)), "Duplicate page descriptions")
    reached, pending = set(), [ORIGIN + "/"]
    while pending:
        url = pending.pop()
        if url not in reached:
            reached.add(url)
            pending.extend(graph[url] - reached)
    require(reached == set(pages), "Orphan page")
    robots = (ROOT / "robots.txt").read_text()
    require("Sitemap: " + ORIGIN + "/sitemap.xml" in robots, "Missing sitemap declaration")
    require("User-agent: *" in robots and "Allow: /" in robots, "Unexpected public crawl policy")
    config = json.loads((ROOT / "vercel.json").read_text())
    require(config.get("cleanUrls") is True and config.get("trailingSlash") is False, "Clean URL config changed")
    cache_headers = {
        item["source"]: next((header["value"] for header in item.get("headers", []) if header["key"].lower() == "cache-control"), "")
        for item in config.get("headers", [])
    }
    for source in {"/styles.css", "/content.css", "/script.js", "/assets/hero/(.*)"}:
        value = cache_headers.get(source, "").lower()
        require("max-age=31536000" in value and "immutable" in value, "Missing immutable cache policy for " + source)
    homepage_source = (ROOT / "index.html").read_text()
    stylesheet_source = (ROOT / "styles.css").read_text()
    require("soulora-hero-background-poster.png" not in homepage_source + stylesheet_source, "Legacy PNG hero poster is still referenced")
    require(homepage_source.count("soulora-hero-background-poster.webp?v=20260922-hero-v1") == 2, "Poster preload and video URL must match")
    print(f"PASS: {len(pages)} pages, unique metadata, canonical, JSON-LD, breadcrumbs, robots and sitemap")
    print(f"PASS: {link_count} internal links and their fragments; no orphan pages; local asset references")
    print("PASS: 404 has noindex, valid recovery links, and is excluded from the sitemap")
    print("PASS: sitemap lastmod, visible update dates, versioned hero assets and immutable cache headers")


if __name__ == "__main__":
    check()
