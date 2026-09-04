export interface ToolMeta {
  id: string;
  slug: string;
  name: string;
  category_slug: string;
  processing_type: "client" | "server" | "hybrid";
  short_description: string;
  long_description?: string;
  how_to_use?: string[];
  features?: string[];
  faq?: Array<{ question: string; answer: string }>;
  related_tools?: string[];
  seo_title?: string;
  meta_description?: string;
  accepted_formats?: string[];
}

export type ToolProcessor = (input: string, options?: Record<string, unknown>) => { output: string; error?: string } | Promise<{ output: string; error?: string }>;

export const CLIENT_PROCESSORS: Record<string, ToolProcessor> = {
  "json-formatter": (input) => {
    try {
      return { output: JSON.stringify(JSON.parse(input), null, 2) };
    } catch (e) {
      return { output: "", error: (e as Error).message };
    }
  },
  "json-validator": (input) => {
    try {
      JSON.parse(input);
      return { output: "✓ Valid JSON" };
    } catch (e) {
      return { output: "", error: (e as Error).message };
    }
  },
  "json-minifier": (input) => {
    try {
      return { output: JSON.stringify(JSON.parse(input)) };
    } catch (e) {
      return { output: "", error: (e as Error).message };
    }
  },
  "base64-encoder": (input) => ({ output: btoa(unescape(encodeURIComponent(input))) }),
  "base64-decoder": (input) => {
    try {
      return { output: decodeURIComponent(escape(atob(input))) };
    } catch {
      return { output: "", error: "Invalid Base64 string" };
    }
  },
  "url-encoder": (input) => ({ output: encodeURIComponent(input) }),
  "url-decoder": (input) => {
    try {
      return { output: decodeURIComponent(input) };
    } catch {
      return { output: "", error: "Invalid URL encoding" };
    }
  },
  "uuid-generator": () => ({ output: crypto.randomUUID() }),
  "hash-generator": async (input) => {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
    const hash = Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
    return { output: hash };
  },
  "word-counter": (input) => {
    const words = input.trim() ? input.trim().split(/\s+/).length : 0;
    const chars = input.length;
    const sentences = input.split(/[.!?]+/).filter(Boolean).length;
    return { output: `Words: ${words}\nCharacters: ${chars}\nSentences: ${sentences}` };
  },
  "character-counter": (input) => ({
    output: `With spaces: ${input.length}\nWithout spaces: ${input.replace(/\s/g, "").length}`,
  }),
  "case-converter": (input, opts) => {
    const mode = opts?.mode as string || "upper";
    const map: Record<string, string> = {
      upper: input.toUpperCase(),
      lower: input.toLowerCase(),
      title: input.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()),
      sentence: input.charAt(0).toUpperCase() + input.slice(1).toLowerCase(),
    };
    return { output: map[mode] || input };
  },
  "duplicate-line-remover": (input) => ({
    output: [...new Set(input.split("\n"))].join("\n"),
  }),
  "text-sorter": (input, opts) => {
    const lines = input.split("\n").filter(Boolean);
    lines.sort((a, b) => opts?.desc ? b.localeCompare(a) : a.localeCompare(b));
    return { output: lines.join("\n") };
  },
  "text-reverser": (input) => ({ output: input.split("").reverse().join("") }),
  "text-cleaner": (input) => ({ output: input.replace(/\s+/g, " ").trim() }),
  "lorem-ipsum-generator": (_, opts) => {
    const paras = Number(opts?.paragraphs || 3);
    const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
    return { output: Array(paras).fill(lorem).join("\n\n") };
  },
  "slug-generator": (input) => ({
    output: input.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-"),
  }),
  "password-generator": (_, opts) => {
    const len = Number(opts?.length || 16);
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let pwd = "";
    const arr = new Uint32Array(len);
    crypto.getRandomValues(arr);
    for (let i = 0; i < len; i++) pwd += chars[arr[i] % chars.length];
    return { output: pwd };
  },
  "csv-to-json": (input) => {
    const lines = input.trim().split("\n");
    if (!lines.length) return { output: "[]" };
    const headers = lines[0].split(",").map((h) => h.trim());
    const rows = lines.slice(1).map((line) => {
      const vals = line.split(",");
      return Object.fromEntries(headers.map((h, i) => [h, (vals[i] || "").trim()]));
    });
    return { output: JSON.stringify(rows, null, 2) };
  },
  "json-to-csv": (input) => {
    try {
      const data = JSON.parse(input);
      if (!Array.isArray(data) || !data.length) return { output: "", error: "JSON must be a non-empty array" };
      const keys = Object.keys(data[0]);
      const rows = [keys.join(","), ...data.map((r) => keys.map((k) => r[k] ?? "").join(","))];
      return { output: rows.join("\n") };
    } catch (e) {
      return { output: "", error: (e as Error).message };
    }
  },
  "timestamp-converter": (input) => {
    const ts = Number(input);
    if (isNaN(ts)) return { output: "", error: "Enter a valid Unix timestamp" };
    const ms = ts < 1e12 ? ts * 1000 : ts;
    return { output: new Date(ms).toISOString() + "\nLocal: " + new Date(ms).toLocaleString() };
  },
  "percentage-calculator": (input, opts) => {
    const val = Number(opts?.value || 0);
    const pct = Number(opts?.percent || 0);
    if (opts?.mode === "of") return { output: `${pct}% of ${val} = ${(val * pct / 100).toFixed(2)}` };
    if (opts?.mode === "change") return { output: `Change: ${(((pct - val) / val) * 100).toFixed(2)}%` };
    return { output: `${pct}% of ${val} = ${(val * pct / 100).toFixed(2)}` };
  },
  "emi-calculator": (_, opts) => {
    const P = Number(opts?.principal || 0);
    const r = Number(opts?.rate || 0) / 12 / 100;
    const n = Number(opts?.tenure || 0) * 12;
    if (!P || !r || !n) return { output: "", error: "Enter principal, rate and tenure" };
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = emi * n;
    return { output: `Monthly EMI: ₹${emi.toFixed(2)}\nTotal Payment: ₹${total.toFixed(2)}\nTotal Interest: ₹${(total - P).toFixed(2)}` };
  },
  "bmi-calculator": (_, opts) => {
    const w = Number(opts?.weight || 0);
    const h = Number(opts?.height || 0) / 100;
    if (!w || !h) return { output: "", error: "Enter weight (kg) and height (cm)" };
    const bmi = w / (h * h);
    let cat = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese";
    return { output: `BMI: ${bmi.toFixed(1)} (${cat})` };
  },
  "discount-calculator": (_, opts) => {
    const price = Number(opts?.price || 0);
    const disc = Number(opts?.discount || 0);
    const final = price - (price * disc / 100);
    return { output: `Original: ₹${price}\nDiscount: ${disc}%\nFinal Price: ₹${final.toFixed(2)}\nYou Save: ₹${(price - final).toFixed(2)}` };
  },
  "gst-calculator": (_, opts) => {
    const amt = Number(opts?.amount || 0);
    const rate = Number(opts?.rate || 18);
    const mode = opts?.mode as string || "add";
    if (mode === "add") {
      const gst = amt * rate / 100;
      return { output: `Base: ₹${amt}\nGST (${rate}%): ₹${gst.toFixed(2)}\nTotal: ₹${(amt + gst).toFixed(2)}` };
    }
    const base = amt / (1 + rate / 100);
    return { output: `Total: ₹${amt}\nBase: ₹${base.toFixed(2)}\nGST: ₹${(amt - base).toFixed(2)}` };
  },
  "age-calculator": (_, opts) => {
    const dob = new Date(String(opts?.dob || ""));
    if (isNaN(dob.getTime())) return { output: "", error: "Enter a valid date of birth" };
    const now = new Date();
    let years = now.getFullYear() - dob.getFullYear();
    let months = now.getMonth() - dob.getMonth();
    if (months < 0) { years--; months += 12; }
    return { output: `Age: ${years} years, ${months} months` };
  },
  "loan-calculator": (_, opts) => {
    return CLIENT_PROCESSORS["emi-calculator"]!("", opts);
  },
  "hex-to-rgb": (input) => {
    const hex = input.replace("#", "");
    if (!/^[0-9A-Fa-f]{6}$/.test(hex)) return { output: "", error: "Invalid HEX color" };
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return { output: `rgb(${r}, ${g}, ${b})` };
  },
  "rgb-to-hex": (input) => {
    const m = input.match(/(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
    if (!m) return { output: "", error: "Enter RGB like: 255, 128, 0" };
    const hex = [m[1], m[2], m[3]].map((n) => Number(n).toString(16).padStart(2, "0")).join("");
    return { output: `#${hex}` };
  },
  "color-picker": (input) => {
    const hex = input.replace("#", "").trim();
    if (!/^[0-9A-Fa-f]{6}$/.test(hex)) return { output: "", error: "Enter a 6-digit HEX color like #3b82f6" };
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const rn = r / 255, gn = g / 255, bn = b / 255;
    const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
    const l = (max + min) / 2;
    let h = 0, s = 0;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
      else if (max === gn) h = ((bn - rn) / d + 2) / 6;
      else h = ((rn - gn) / d + 4) / 6;
    }
    return {
      output: `HEX: #${hex.toUpperCase()}\nRGB: rgb(${r}, ${g}, ${b})\nHSL: hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`,
    };
  },
  "url-parser": (input) => {
    try {
      const raw = input.trim();
      const u = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
      const params = [...u.searchParams.entries()];
      const query = params.length
        ? params.map(([k, v]) => `  ${k} = ${v}`).join("\n")
        : "  (none)";
      return {
        output: [
          `Full URL: ${u.href}`,
          `Protocol: ${u.protocol.replace(":", "")}`,
          `Host: ${u.hostname}`,
          `Port: ${u.port || (u.protocol === "https:" ? "443" : "80")}`,
          `Path: ${u.pathname}`,
          `Query:\n${query}`,
          `Hash: ${u.hash || "(none)"}`,
          `Origin: ${u.origin}`,
        ].join("\n"),
      };
    } catch {
      return { output: "", error: "Invalid URL" };
    }
  },
  "ip-validator": (input) => {
    const ip = input.trim();
    const v4 = /^(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)$/;
    const v6 = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^(?:[0-9a-fA-F]{1,4}:)*::(?:[0-9a-fA-F]{1,4}:)*[0-9a-fA-F]{1,4}$|^(?:[0-9a-fA-F]{1,4}:)+:$/;
    if (v4.test(ip)) {
      const parts = ip.split(".").map(Number);
      const isPrivate =
        parts[0] === 10 ||
        (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
        (parts[0] === 192 && parts[1] === 168) ||
        parts[0] === 127;
      return { output: `Valid IPv4\nAddress: ${ip}\nVersion: 4\nScope: ${isPrivate ? "Private / loopback" : "Public routable"}` };
    }
    if (v6.test(ip)) return { output: `Valid IPv6\nAddress: ${ip}\nVersion: 6` };
    return { output: "", error: "Not a valid IPv4 or IPv6 address" };
  },
  "cidr-calculator": (input) => {
    const m = input.trim().match(/^(\d{1,3}(?:\.\d{1,3}){3})\/(\d{1,2})$/);
    if (!m) return { output: "", error: "Enter CIDR like 192.168.1.0/24" };
    const octets = m[1].split(".").map(Number);
    const prefix = Number(m[2]);
    if (octets.some((o) => o > 255) || prefix < 0 || prefix > 32) return { output: "", error: "Invalid CIDR notation" };
    const ipInt = ((octets[0] << 24) >>> 0) + (octets[1] << 16) + (octets[2] << 8) + octets[3];
    const mask = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
    const network = (ipInt & mask) >>> 0;
    const broadcast = (network | (~mask >>> 0)) >>> 0;
    const hosts = prefix >= 31 ? (prefix === 31 ? 2 : 1) : Math.max(0, (1 << (32 - prefix)) - 2);
    const fmt = (n: number) => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(".");
    return {
      output: [
        `Network: ${fmt(network)}/${prefix}`,
        `Subnet mask: ${fmt(mask)}`,
        `Broadcast: ${fmt(broadcast)}`,
        `First host: ${prefix >= 31 ? fmt(network) : fmt(network + 1)}`,
        `Last host: ${prefix >= 31 ? fmt(broadcast) : fmt(broadcast - 1)}`,
        `Usable hosts: ${hosts}`,
      ].join("\n"),
    };
  },
  "mac-address-formatter": (input, opts) => {
    const hex = input.replace(/[^0-9a-fA-F]/g, "");
    if (hex.length !== 12) return { output: "", error: "MAC address must contain 12 hex digits" };
    const sep = opts?.format === "dash" ? "-" : opts?.format === "dot" ? "." : ":";
    const parts = hex.match(/.{2}/g)!.map((p) => p.toUpperCase());
    return { output: parts.join(sep) };
  },
  "email-validator": (input) => {
    const email = input.trim();
    const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!re.test(email)) return { output: "", error: "Invalid email address format" };
    const [local, domain] = email.split("@");
    const tld = domain.split(".").pop();
    return { output: `Valid email format\nLocal part: ${local}\nDomain: ${domain}\nTLD: ${tld}` };
  },
  "http-status-lookup": (input) => {
    const codes: Record<number, string> = {
      100: "Continue", 101: "Switching Protocols", 102: "Processing",
      200: "OK", 201: "Created", 202: "Accepted", 204: "No Content", 206: "Partial Content",
      301: "Moved Permanently", 302: "Found", 304: "Not Modified", 307: "Temporary Redirect", 308: "Permanent Redirect",
      400: "Bad Request", 401: "Unauthorized", 403: "Forbidden", 404: "Not Found", 405: "Method Not Allowed",
      408: "Request Timeout", 409: "Conflict", 410: "Gone", 413: "Payload Too Large", 415: "Unsupported Media Type",
      418: "I'm a teapot", 422: "Unprocessable Entity", 429: "Too Many Requests",
      500: "Internal Server Error", 502: "Bad Gateway", 503: "Service Unavailable", 504: "Gateway Timeout",
    };
    const code = Number(input.trim());
    if (!Number.isInteger(code) || code < 100 || code > 599) return { output: "", error: "Enter an HTTP status code between 100 and 599" };
    const label = codes[code];
    const family = code >= 500 ? "5xx Server Error" : code >= 400 ? "4xx Client Error" : code >= 300 ? "3xx Redirection" : code >= 200 ? "2xx Success" : "1xx Informational";
    return { output: `Code: ${code}\nStatus: ${label || "Unknown"}\nClass: ${family}` };
  },
  "user-agent-parser": (input) => {
    const ua = input.trim();
    if (!ua) return { output: "", error: "Paste a User-Agent string" };
    const browser =
      /Edg\//.test(ua) ? "Microsoft Edge" :
      /Chrome\//.test(ua) && !/Edg\//.test(ua) ? "Chrome" :
      /Firefox\//.test(ua) ? "Firefox" :
      /Safari\//.test(ua) && !/Chrome\//.test(ua) ? "Safari" :
      /MSIE|Trident/.test(ua) ? "Internet Explorer" : "Unknown";
    const os =
      /Windows NT 10/.test(ua) ? "Windows 10/11" :
      /Windows NT/.test(ua) ? "Windows" :
      /Mac OS X/.test(ua) ? "macOS" :
      /Android/.test(ua) ? "Android" :
      /iPhone|iPad|iPod/.test(ua) ? "iOS" :
      /Linux/.test(ua) ? "Linux" : "Unknown";
    const device = /Mobile|Android|iPhone/.test(ua) ? "Mobile" : /iPad|Tablet/.test(ua) ? "Tablet" : "Desktop";
    return { output: `Browser: ${browser}\nOS: ${os}\nDevice: ${device}\n\nRaw:\n${ua}` };
  },
  "jwt-decoder": (input) => {
    const token = input.trim();
    const parts = token.split(".");
    if (parts.length !== 3) return { output: "", error: "JWT must have three dot-separated parts" };
    const decode = (part: string) => {
      const b64 = part.replace(/-/g, "+").replace(/_/g, "/");
      const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
      return JSON.parse(decodeURIComponent(escape(atob(padded))));
    };
    try {
      const header = decode(parts[0]);
      const payload = decode(parts[1]);
      return {
        output: `Header:\n${JSON.stringify(header, null, 2)}\n\nPayload:\n${JSON.stringify(payload, null, 2)}\n\nNote: Signature is not verified.`,
      };
    } catch {
      return { output: "", error: "Could not decode JWT — check the token format" };
    }
  },
  "dns-lookup": async (input, opts) => {
    const name = input.trim().replace(/^https?:\/\//, "").split("/")[0];
    if (!name) return { output: "", error: "Enter a domain name" };
    const typeMap: Record<string, string> = { A: "1", AAAA: "28", CNAME: "5", MX: "15", TXT: "16", NS: "2" };
    const type = String(opts?.type || "A").toUpperCase();
    const typeNum = typeMap[type];
    if (!typeNum) return { output: "", error: "Unsupported record type" };
    try {
      const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(name)}&type=${typeNum}`);
      const data = await res.json();
      if (data.Status !== 0) return { output: "", error: `DNS lookup failed (RCODE ${data.Status})` };
      const answers = (data.Answer || []) as Array<{ data: string; TTL?: number }>;
      const lines = answers.length
        ? answers.map((a) => `  ${a.data}${a.TTL != null ? `  (TTL ${a.TTL}s)` : ""}`).join("\n")
        : "  (no records found)";
      return { output: `Domain: ${name}\nType: ${type}\n\nRecords:\n${lines}` };
    } catch {
      return { output: "", error: "DNS lookup failed — check your connection" };
    }
  },
  "what-is-my-ip": async () => {
    try {
      const res = await fetch("https://api.ipify.org?format=json");
      const data = await res.json();
      return { output: `Your public IP address:\n${data.ip}\n\nFetched via ipify.org` };
    } catch {
      return { output: "", error: "Could not fetch your IP — check your connection" };
    }
  },
  "meta-tag-generator": (_, opts) => {
    const title = opts?.title || "";
    const desc = opts?.description || "";
    return { output: `<title>${title}</title>\n<meta name="description" content="${desc}">\n<meta name="robots" content="index, follow">` };
  },
  "robots-txt-generator": (_, opts) => ({
    output: `User-agent: *\n${opts?.allowAll ? "Allow: /" : "Disallow: /admin\nDisallow: /dashboard"}\nSitemap: ${opts?.sitemap || "https://example.com/sitemap.xml"}`,
  }),
  "sitemap-generator": (input) => {
    const urls = input.split("\n").filter(Boolean);
    const entries = urls.map((u) => `  <url><loc>${u.trim()}</loc></url>`).join("\n");
    return { output: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>` };
  },
  "open-graph-generator": (_, opts) => ({
    output: `<meta property="og:title" content="${opts?.title || ""}">\n<meta property="og:description" content="${opts?.description || ""}">\n<meta property="og:image" content="${opts?.image || ""}">`,
  }),
  "serp-preview": (_, opts) => ({
    output: `Title: ${opts?.title || "Page Title"}\nURL: ${opts?.url || "https://example.com"}\nDescription: ${opts?.description || "Meta description appears here..."}`,
  }),
  "utm-builder": (_, opts) => {
    const base = String(opts?.url || "https://example.com");
    const params = new URLSearchParams();
    if (opts?.source) params.set("utm_source", String(opts.source));
    if (opts?.medium) params.set("utm_medium", String(opts.medium));
    if (opts?.campaign) params.set("utm_campaign", String(opts.campaign));
    return { output: `${base}${base.includes("?") ? "&" : "?"}${params.toString()}` };
  },
  "keyword-density-checker": (input, opts) => {
    const keyword = String(opts?.keyword || "").toLowerCase();
    const words = input.toLowerCase().split(/\s+/).filter(Boolean);
    const count = words.filter((w) => w.includes(keyword)).length;
    const density = words.length ? ((count / words.length) * 100).toFixed(2) : "0";
    return { output: `Total words: ${words.length}\nKeyword "${keyword}" count: ${count}\nDensity: ${density}%` };
  },
  "unit-converter": (_, opts) => {
    const val = Number(opts?.value || 0);
    const from = String(opts?.from || "m");
    const to = String(opts?.to || "ft");
    const length: Record<string, number> = { m: 1, km: 1000, ft: 0.3048, in: 0.0254, mi: 1609.34 };
    if (!(from in length) || !(to in length)) return { output: "", error: "Unsupported unit" };
    const result = (val * length[from]) / length[to];
    return { output: `${val} ${from} = ${result.toFixed(4)} ${to}` };
  },
  "data-converter": (_, opts) => {
    const val = Number(opts?.value || 0);
    const from = String(opts?.from || "MB");
    const units: Record<string, number> = { B: 1, KB: 1024, MB: 1048576, GB: 1073741824, TB: 1099511627776 };
    const to = String(opts?.to || "GB");
    if (!(from in units) || !(to in units)) return { output: "", error: "Unsupported unit" };
    const result = (val * units[from]) / units[to];
    return { output: `${val} ${from} = ${result.toFixed(4)} ${to}` };
  },
  "currency-converter": (_, opts) => {
    const rates: Record<string, number> = { USD: 1, EUR: 0.92, GBP: 0.79, INR: 83.5, AUD: 1.53 };
    const val = Number(opts?.value || 0);
    const from = String(opts?.from || "USD");
    const to = String(opts?.to || "INR");
    if (!(from in rates) || !(to in rates)) return { output: "", error: "Unsupported currency" };
    const result = (val / rates[from]) * rates[to];
    return { output: `${val} ${from} = ${result.toFixed(2)} ${to}` };
  },
};

export const CALCULATOR_TOOLS = new Set([
  "percentage-calculator", "emi-calculator", "bmi-calculator", "discount-calculator",
  "gst-calculator", "age-calculator", "loan-calculator", "unit-converter", "data-converter", "currency-converter",
]);

export const SEO_FORM_TOOLS = new Set([
  "meta-tag-generator", "open-graph-generator", "serp-preview", "utm-builder", "robots-txt-generator",
]);

export const INTERNET_FORM_TOOLS = new Set([
  "dns-lookup", "mac-address-formatter",
]);

export const NO_INPUT_TOOLS = new Set([
  "uuid-generator", "password-generator", "what-is-my-ip",
]);

export const FILE_CLIENT_TOOLS = new Set([
  "resize-image", "crop-image", "jpg-to-png", "png-to-jpg", "webp-converter", "rotate-image", "flip-image",
]);

export const SERVER_TOOLS = new Set([
  "merge-pdf", "split-pdf", "compress-pdf", "jpg-to-pdf", "pdf-to-jpg", "compress-image",
]);
