type ToolResult = {
  output: string;
  error?: string;
  stats?: Array<{ label: string; value: string }>;
};
type ToolProcessor = (input: string, options?: Record<string, unknown>) => ToolResult | Promise<ToolResult>;

const OTP_KEY = "toolforge-otp";
const DNS_TYPES: Record<string, string> = { A: "1", NS: "2", CNAME: "5", PTR: "12", MX: "15", TXT: "16", AAAA: "28" };

function ok(output: string, extra?: Partial<ToolResult>): ToolResult {
  return { output, ...extra };
}

function fail(error: string): ToolResult {
  return { output: "", error };
}

function normalizeUrl(url: string) {
  const value = url.trim();
  if (!value) throw new Error("Enter a URL.");
  if (!/^https?:\/\//i.test(value)) return `https://${value}`;
  return value;
}

function hostFrom(input: string) {
  const value = input.trim().replace(/^https?:\/\//i, "").split("/")[0].split(":")[0];
  if (!value) throw new Error("Enter a domain or URL.");
  return value;
}

async function fetchUrl(url: string, init?: RequestInit & { timeoutMs?: number }) {
  const ctrl = new AbortController();
  const timer = window.setTimeout(() => ctrl.abort(), init?.timeoutMs ?? 12000);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal });
  } catch (error) {
    if ((error as Error).name === "AbortError") throw new Error("The request timed out.");
    throw new Error("The browser could not reach that site. Many websites block direct checks (CORS).");
  } finally {
    window.clearTimeout(timer);
  }
}

async function dnsLookup(name: string, type: string): Promise<ToolResult> {
  const record = type.toUpperCase();
  const typeNum = DNS_TYPES[record];
  if (!typeNum) return fail("Unsupported DNS record type.");
  try {
    const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(name)}&type=${typeNum}`);
    const data = await res.json();
    if (data.Status !== 0 && !data.Answer) return fail(`DNS lookup failed (RCODE ${data.Status}).`);
    const answers = (data.Answer || []) as Array<{ data: string; TTL?: number; type?: number }>;
    const lines = answers.length
      ? answers.map((item) => `  ${item.data}${item.TTL != null ? `  (TTL ${item.TTL}s)` : ""}`).join("\n")
      : "  (no records found)";
    return ok(`Domain: ${name}\nType: ${record}\n\nRecords:\n${lines}`);
  } catch {
    return fail("DNS lookup failed — check your connection.");
  }
}

function randomChars(length: number) {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = new Uint32Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (n) => alphabet[n % alphabet.length]).join("");
}

function headerDump(headers: Headers) {
  const rows = [...headers.entries()];
  return rows.length ? rows.map(([key, value]) => `${key}: ${value}`).join("\n") : "(no readable headers — the site may hide them from browsers)";
}

function stripHtml(html: string) {
  const without = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return without;
}

function originUrl(url: string, path: string) {
  const parsed = new URL(normalizeUrl(url));
  return `${parsed.protocol}//${parsed.host}${path}`;
}

export const INTERNET_PROCESSORS: Record<string, ToolProcessor> = {
  "url-validator": (input) => {
    try {
      const url = normalizeUrl(input);
      const parsed = new URL(url);
      const valid = parsed.protocol === "http:" || parsed.protocol === "https:";
      return ok(`URL: ${url}\nValid: ${valid ? "yes" : "no"}\nHost: ${parsed.host}`);
    } catch {
      return fail("That is not a valid URL.");
    }
  },
  "url-parser": (input) => {
    try {
      const url = normalizeUrl(input);
      const parsed = new URL(url);
      return ok([
        `Scheme: ${parsed.protocol.replace(":", "")}`,
        `Domain: ${parsed.hostname}`,
        `Port: ${parsed.port || "(default)"}`,
        `Path: ${parsed.pathname}`,
        `Query: ${parsed.search.slice(1) || "(none)"}`,
        `Fragment: ${parsed.hash.slice(1) || "(none)"}`,
        `Username: ${parsed.username || "(none)"}`,
      ].join("\n"));
    } catch (error) {
      return fail((error as Error).message);
    }
  },
  "query-parser": (input) => {
    try {
      const url = normalizeUrl(input);
      const parsed = new URL(url);
      const params = [...parsed.searchParams.entries()];
      if (!params.length) return ok("No query parameters found.");
      return ok(params.map(([key, value]) => `${key}=${value}`).join("\n"));
    } catch (error) {
      return fail((error as Error).message);
    }
  },
  "query-builder": (input, opts) => {
    try {
      const base = String(opts?.baseUrl || input || "").trim();
      if (!base) return fail("Enter a base URL.");
      const lines = String(opts?.params || "").split("\n").map((line) => line.trim()).filter(Boolean);
      const next = new URL(normalizeUrl(base));
      for (const line of lines) {
        const eq = line.indexOf("=");
        if (eq < 1) continue;
        next.searchParams.append(line.slice(0, eq).trim(), line.slice(eq + 1).trim());
      }
      return ok(next.toString());
    } catch (error) {
      return fail((error as Error).message);
    }
  },
  "redirect-checker": async (input) => {
    const url = normalizeUrl(input);
    const res = await fetchUrl(url, { redirect: "follow" });
    return ok(`Original: ${url}\nFinal: ${res.url}\nStatus: ${res.status} ${res.statusText}\nRedirected: ${res.url !== url ? "yes" : "no"}`);
  },
  "http-status-checker": async (input) => {
    const url = normalizeUrl(input);
    const res = await fetchUrl(url);
    return ok(`URL: ${res.url}\nStatus: ${res.status} ${res.statusText}`);
  },
  "http-header-checker": async (input) => {
    const url = normalizeUrl(input);
    const res = await fetchUrl(url);
    return ok(`URL: ${res.url}\nStatus: ${res.status} ${res.statusText}\n\nHeaders:\n${headerDump(res.headers)}`);
  },
  "website-response-time": async (input) => {
    const url = normalizeUrl(input);
    const start = performance.now();
    const res = await fetchUrl(url);
    const ms = Math.round((performance.now() - start) * 100) / 100;
    return ok(`URL: ${url}\nStatus: ${res.status}\nResponse time: ${ms} ms`);
  },
  "website-metadata": async (input) => {
    const url = normalizeUrl(input);
    const res = await fetchUrl(url);
    const html = await res.text();
    const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/\s+/g, " ").trim() || "(none)";
    const description = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)?.[1]
      || html.match(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i)?.[1]
      || "(none)";
    return ok(`URL: ${res.url}\nStatus: ${res.status}\nTitle: ${title}\nDescription: ${description}`);
  },
  "website-text-extractor": async (input) => {
    const url = normalizeUrl(input);
    const res = await fetchUrl(url);
    const text = stripHtml(await res.text());
    return ok(text || "(no readable text)");
  },
  "a-record-lookup": (input) => dnsLookup(hostFrom(input), "A"),
  "aaaa-record-lookup": (input) => dnsLookup(hostFrom(input), "AAAA"),
  "mx-record-lookup": (input) => dnsLookup(hostFrom(input), "MX"),
  "txt-record-lookup": (input) => dnsLookup(hostFrom(input), "TXT"),
  "ns-record-lookup": (input) => dnsLookup(hostFrom(input), "NS"),
  "cname-record-lookup": (input) => dnsLookup(hostFrom(input), "CNAME"),
  "ip-lookup": async (input) => {
    const domain = hostFrom(input);
    const result = await dnsLookup(domain, "A");
    if (result.error) return result;
    return ok(result.output.replace("Type: A", "IP lookup (A records)"));
  },
  "domain-to-ip": (input, opts) => INTERNET_PROCESSORS["ip-lookup"]!(input, opts),
  "reverse-dns-lookup": async (input) => {
    const ip = input.trim();
    if (!/^\d{1,3}(\.\d{1,3}){3}$/.test(ip)) return fail("Enter an IPv4 address like 8.8.8.8.");
    const ptr = `${ip.split(".").reverse().join(".")}.in-addr.arpa`;
    return dnsLookup(ptr, "PTR");
  },
  "ping-check": async (input) => {
    const domain = hostFrom(input);
    const start = performance.now();
    try {
      try {
        await fetchUrl(`https://${domain}`, { timeoutMs: 5000, method: "HEAD" });
      } catch {
        await fetchUrl(`https://${domain}`, { timeoutMs: 5000 });
      }
      const ms = Math.round(performance.now() - start);
      return ok(`Host: ${domain}\nReachable: yes\nTime: ${ms} ms`);
    } catch (error) {
      return ok(`Host: ${domain}\nReachable: no\n${(error as Error).message}`);
    }
  },
  "ssl-checker": async (input) => {
    const domain = hostFrom(input);
    try {
      const res = await fetchUrl(`https://${domain}`, { timeoutMs: 10000 });
      return ok(`Domain: ${domain}\nHTTPS reachable: yes\nStatus: ${res.status} ${res.statusText}\n\nBrowsers cannot read certificate issuer or expiry. A successful HTTPS response means the TLS handshake completed.`);
    } catch (error) {
      return fail(`HTTPS check failed for ${domain}. ${(error as Error).message}`);
    }
  },
  "robots-txt-checker": async (input) => {
    const url = originUrl(input, "/robots.txt");
    const res = await fetchUrl(url);
    const body = await res.text();
    return ok(`URL: ${url}\nStatus: ${res.status}\nExists: ${res.ok ? "yes" : "no"}\n\n${body || "(empty)"}`);
  },
  "sitemap-checker": async (input) => {
    const url = originUrl(input, "/sitemap.xml");
    const res = await fetchUrl(url);
    const body = await res.text();
    return ok(`URL: ${url}\nStatus: ${res.status}\nExists: ${res.ok ? "yes" : "no"}\n\n${body || "(empty)"}`);
  },
  "link-extractor": async (input) => {
    const url = normalizeUrl(input);
    const res = await fetchUrl(url);
    const html = await res.text();
    const links = [...html.matchAll(/href=["']([^"']+)["']/gi)].map((match) => match[1]);
    const unique = [...new Set(links)];
    return ok(`URL: ${url}\nCount: ${unique.length}\n\n${unique.join("\n") || "(none)"}`);
  },
  "email-extractor": (input) => {
    const emails = [...new Set(input.match(/[\w.+-]+@[\w.-]+\.\w+/g) || [])];
    return ok(`Count: ${emails.length}\n\n${emails.join("\n") || "(none found)"}`);
  },
  "website-word-counter": async (input) => {
    const extracted = await INTERNET_PROCESSORS["website-text-extractor"]!(input);
    if (extracted.error) return extracted;
    const text = extracted.output;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    return ok(`URL: ${normalizeUrl(input)}\nWords: ${words}\nCharacters: ${text.length}`);
  },
  "generate-random-email": (_, opts) => {
    const domain = String(opts?.domain || "example.com").trim().replace(/^@/, "");
    const length = Number(opts?.usernameLength || 10);
    if (!domain) return fail("Email domain is required.");
    if (length < 5 || length > 30) return fail("Username length must be between 5 and 30.");
    const username = randomChars(length);
    const email = `${username}@${domain}`;
    return ok(`Email: ${email}\nUsername: ${username}\nDomain: ${domain}`, {
      stats: [
        { label: "Email", value: email },
        { label: "Length", value: String(length) },
      ],
    });
  },
  "generate-otp": (_, opts) => {
    const length = Number(opts?.otpLength || 6);
    const expiry = Number(opts?.expirySeconds || 300);
    if (length < 4 || length > 8) return fail("OTP length must be between 4 and 8.");
    if (expiry <= 0) return fail("Expiry time must be greater than 0.");
    const min = 10 ** (length - 1);
    const max = 10 ** length - 1;
    const bytes = new Uint32Array(1);
    crypto.getRandomValues(bytes);
    const otp = String(min + (bytes[0] % (max - min + 1)));
    const expiresAt = Date.now() / 1000 + expiry;
    try {
      sessionStorage.setItem(OTP_KEY, JSON.stringify({ otp, expiresAt }));
    } catch {
      /* ignore */
    }
    return ok(`OTP: ${otp}\nExpires in: ${expiry} seconds\nUse Verify OTP before it expires.`, {
      stats: [
        { label: "OTP", value: otp },
        { label: "Expires in", value: `${expiry}s` },
      ],
    });
  },
  "verify-otp": (input, opts) => {
    const userOtp = String(opts?.userOtp || input || "").trim();
    let generated = String(opts?.generatedOtp || "").trim();
    let expiresAt = Number(opts?.expiresAt || 0);
    if (!generated || !expiresAt) {
      try {
        const saved = JSON.parse(sessionStorage.getItem(OTP_KEY) || "null") as { otp?: string; expiresAt?: number } | null;
        generated = generated || saved?.otp || "";
        expiresAt = expiresAt || Number(saved?.expiresAt || 0);
      } catch {
        /* ignore */
      }
    }
    if (!generated || !userOtp) return fail("Generate an OTP first, then enter it to verify.");
    if (Date.now() / 1000 > expiresAt) return fail("OTP has expired. Please generate a new OTP.");
    const verified = generated === userOtp;
    return ok(verified ? "OTP verified successfully." : "Invalid OTP.", {
      stats: [{ label: "Result", value: verified ? "Valid" : "Invalid" }],
    });
  },
};
