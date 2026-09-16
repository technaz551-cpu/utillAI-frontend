import type { ToolMeta } from "@/features/tools/client-processors";

const privacyFaq = {
  question: "Is this processed on a server?",
  answer: "These internet tools run in your browser. URL, email and OTP tools stay on your device. Live website checks use your connection and may fail if a site blocks browser requests.",
};

function tool(
  slug: string,
  name: string,
  short: string,
  extra: Partial<ToolMeta> = {},
): ToolMeta {
  return {
    id: slug,
    slug,
    name,
    category_slug: "internet",
    processing_type: "client",
    short_description: short,
    how_to_use: extra.how_to_use || ["Enter a URL, domain or value", "Click Process", "Read the result"],
    features: extra.features || ["Runs in your browser"],
    faq: extra.faq || [privacyFaq],
    related_tools: extra.related_tools,
    seo_title: extra.seo_title || `${name} — Free Internet Tool`,
    meta_description: extra.meta_description || `${short} Runs in your browser.`,
    long_description: extra.long_description,
  };
}

export const INTERNET_TOOLS: ToolMeta[] = [
  tool("url-encoder", "URL Encoder", "Encode text so it is safe to use in a URL.", { related_tools: ["url-decoder", "url-parser"] }),
  tool("url-decoder", "URL Decoder", "Decode percent-encoded URL text.", { related_tools: ["url-encoder", "query-parser"] }),
  tool("url-validator", "URL Validator", "Check whether a URL has a valid http or https structure.", { related_tools: ["url-parser", "url-encoder"] }),
  tool("url-parser", "URL Parser", "Split a URL into scheme, host, path, query and fragment.", { related_tools: ["query-parser", "url-validator"] }),
  tool("query-parser", "Query Parser", "Extract query-string parameters from a URL.", { related_tools: ["query-builder", "url-parser"] }),
  tool("query-builder", "Query Builder", "Build a URL from a base address and key=value parameters.", {
    how_to_use: ["Enter a base URL", "Add parameters as key=value lines", "Click Process"],
    related_tools: ["query-parser", "url-encoder"],
  }),
  tool("redirect-checker", "Redirect Checker", "See where a URL finally lands after redirects.", { related_tools: ["http-status-checker", "url-parser"] }),
  tool("http-status-checker", "HTTP Status Checker", "Check the HTTP status code returned by a URL.", { related_tools: ["http-header-checker", "website-response-time"] }),
  tool("http-header-checker", "HTTP Header Checker", "Read response headers the browser is allowed to see.", { related_tools: ["http-status-checker", "redirect-checker"] }),
  tool("website-response-time", "Website Response Time", "Measure how long a site takes to respond from your browser.", { related_tools: ["http-status-checker", "ping-check"] }),
  tool("website-metadata", "Website Metadata", "Read a page title and meta description.", { related_tools: ["website-text-extractor", "link-extractor"] }),
  tool("website-text-extractor", "Website Text Extractor", "Pull visible text out of a web page.", { related_tools: ["website-word-counter", "website-metadata"] }),
  tool("dns-lookup", "DNS Lookup", "Look up A, AAAA, MX, TXT, NS or CNAME records.", {
    how_to_use: ["Enter a domain", "Choose a record type", "Click Process"],
    related_tools: ["a-record-lookup", "mx-record-lookup"],
  }),
  tool("a-record-lookup", "A Record Lookup", "Look up IPv4 A records for a domain.", { related_tools: ["aaaa-record-lookup", "ip-lookup"] }),
  tool("aaaa-record-lookup", "AAAA Record Lookup", "Look up IPv6 AAAA records for a domain.", { related_tools: ["a-record-lookup", "dns-lookup"] }),
  tool("mx-record-lookup", "MX Record Lookup", "Look up mail exchanger records for a domain.", { related_tools: ["txt-record-lookup", "dns-lookup"] }),
  tool("txt-record-lookup", "TXT Record Lookup", "Look up TXT records for a domain.", { related_tools: ["mx-record-lookup", "dns-lookup"] }),
  tool("ns-record-lookup", "NS Record Lookup", "Look up name servers for a domain.", { related_tools: ["cname-record-lookup", "dns-lookup"] }),
  tool("cname-record-lookup", "CNAME Record Lookup", "Look up CNAME aliases for a domain.", { related_tools: ["ns-record-lookup", "dns-lookup"] }),
  tool("ip-lookup", "IP Lookup", "Resolve a domain to its IPv4 addresses.", { related_tools: ["domain-to-ip", "reverse-dns-lookup"] }),
  tool("domain-to-ip", "Domain to IP", "Convert a hostname to an IP address.", { related_tools: ["ip-lookup", "a-record-lookup"] }),
  tool("reverse-dns-lookup", "Reverse DNS Lookup", "Find the hostname for an IPv4 address.", { related_tools: ["ip-lookup", "dns-lookup"] }),
  tool("ping-check", "Ping Check", "Test whether a host is reachable over HTTPS from your browser.", { related_tools: ["website-response-time", "ssl-checker"] }),
  tool("ssl-checker", "SSL Checker", "Check whether a domain answers on HTTPS.", { related_tools: ["ping-check", "http-status-checker"] }),
  tool("robots-txt-checker", "Robots.txt Checker", "Fetch /robots.txt for a site.", { related_tools: ["sitemap-checker", "link-extractor"] }),
  tool("sitemap-checker", "Sitemap Checker", "Fetch /sitemap.xml for a site.", { related_tools: ["robots-txt-checker", "link-extractor"] }),
  tool("link-extractor", "Link Extractor", "Extract href links from a web page.", { related_tools: ["website-text-extractor", "email-extractor"] }),
  tool("email-extractor", "Email Extractor", "Find email addresses in pasted text.", {
    how_to_use: ["Paste text or HTML", "Click Process", "Copy the addresses that were found"],
    related_tools: ["generate-random-email", "user-agent-parser"],
  }),
  tool("website-word-counter", "Website Word Counter", "Count words on a web page.", { related_tools: ["website-text-extractor", "website-metadata"] }),
  tool("user-agent-parser", "User Agent Parser", "Identify browser, OS and device from a User-Agent string.", { related_tools: ["email-extractor", "url-parser"] }),
  tool("generate-random-email", "Email & OTP Tools", "Generate a random email, create a one-time password, or verify an OTP in this browser.", {
    how_to_use: [
      "Choose Random Email, Generate OTP, or Verify OTP",
      "Fill in the fields for that action",
      "Click Process",
      "Copy the result, or verify the OTP before it expires",
    ],
    features: [
      "Cryptographically random email username",
      "4–8 digit OTP with configurable expiry",
      "Verify the last OTP generated in this browser",
      "Private — generated locally",
    ],
    faq: [
      privacyFaq,
      { question: "Do I choose email or OTP after opening the tool?", answer: "Yes. Choose Random Email, Generate OTP, or Verify OTP, then process." },
      { question: "Where is the OTP stored?", answer: "Only in this browser session, until it expires." },
    ],
    related_tools: ["email-extractor", "user-agent-parser"],
    seo_title: "Random Email & OTP Generator — Create and Verify in Your Browser",
    meta_description: "Generate a random email, create an OTP, or verify a one-time password in your browser. Free and private.",
    long_description: "Create a random email on a domain you choose, generate a one-time password with an expiry window, or verify the last OTP from this browser. Nothing is sent to a server.",
  }),
  tool("internet-speed-test", "Internet Speed Test", "Measure download, upload and ping from your browser.", {
    how_to_use: ["Open the tool", "Start the test", "Read download, upload and ping"],
    related_tools: ["what-is-my-ip", "ping-check"],
  }),
];

export const INTERNET_TOOL_SLUGS = new Set(INTERNET_TOOLS.map((item) => item.slug));

export const EMAIL_OTP_SLUGS = new Set(["generate-random-email", "generate-otp", "verify-otp"]);

export const INTERNET_CATEGORY = {
  slug: "internet",
  name: "Internet Tools",
  description: "URL, DNS, website, email and OTP tools that run in your browser.",
  icon: "globe",
  tools: INTERNET_TOOLS,
};

export function getInternetTool(category: string, slug: string): ToolMeta | null {
  if (category !== "internet") return null;
  if (slug === "generate-otp" || slug === "verify-otp") {
    const merged = INTERNET_TOOLS.find((item) => item.slug === "generate-random-email");
    return merged ? { ...merged, id: slug, slug } : null;
  }
  return INTERNET_TOOLS.find((item) => item.slug === slug) ?? null;
}

export function collapseMergedInternetTools<T extends { slug?: string }>(tools: T[]): T[] {
  const slugs = new Set(tools.map((t) => t.slug));
  return tools.filter((t) => {
    if ((t.slug === "generate-otp" || t.slug === "verify-otp") && slugs.has("generate-random-email")) return false;
    return true;
  });
}

export function localInternetTools(params?: { category?: string; popular?: boolean }): ToolMeta[] {
  if (params?.category && params.category !== "internet") return [];
  const popular = new Set(["url-encoder", "dns-lookup", "generate-random-email", "http-status-checker"]);
  if (params?.popular) return INTERNET_TOOLS.filter((item) => popular.has(item.slug));
  return INTERNET_TOOLS;
}
