
import type { ToolMeta } from "@/features/tools/client-processors";

export const localDeveloperTools: ToolMeta[] = [
  {
    id: "json-formatter",
    slug: "json-formatter",
    name: "JSON Formatter",
    description: "Format and beautify JSON data",
    short_description: "Format and beautify JSON data",
    category: "developer",
    category_slug: "developer",
    processing_type: "client",
    seo_title: "JSON Formatter - Free Online JSON Tool",
    meta_description:
      "Format and beautify JSON data online with our free JSON Formatter.",
  },

  {
    id: "json-validator",
    slug: "json-validator",
    name: "JSON Validator",
    description: "Validate JSON syntax",
    short_description: "Validate JSON syntax",
    category: "developer",
    category_slug: "developer",
    processing_type: "client",
    seo_title: "JSON Validator - Free Online JSON Validator",
    meta_description:
      "Validate JSON syntax online with our free JSON Validator.",
  },

  {
    id: "base64",
    slug: "base64",
    name: "Base64 Encoder & Decoder",
    description: "Encode and decode Base64 text",
    short_description: "Encode and decode Base64 text",
    category: "developer",
    category_slug: "developer",
    processing_type: "client",
    seo_title: "Base64 Encoder & Decoder - Free Online Tool",
    meta_description:
      "Encode and decode Base64 text online with this free Base64 tool.",
  },

  {
    id: "url-encoder",
    slug: "url-encoder",
    name: "URL Encoder & Decoder",
    description: "Encode and decode URL text",
    short_description: "Encode and decode URL text",
    category: "developer",
    category_slug: "developer",
    processing_type: "client",
    seo_title: "URL Encoder & Decoder - Free Online Tool",
    meta_description:
      "Encode and decode URL text online with this free URL Encoder and Decoder.",
  },

  {
    id: "uuid-generator",
    slug: "uuid-generator",
    name: "UUID Generator",
    description: "Generate unique UUIDs",
    short_description: "Generate unique UUIDs",
    category: "developer",
    category_slug: "developer",
    processing_type: "client",
    seo_title: "UUID Generator - Free Online UUID Tool",
    meta_description:
      "Generate unique UUIDs online with this free UUID Generator.",
  },

  {
    id: "hash-generator",
    slug: "hash-generator",
    name: "Hash Generator",
    description: "Generate SHA hashes from text",
    short_description: "Generate SHA hashes from text",
    category: "developer",
    category_slug: "developer",
    processing_type: "client",
    seo_title: "Hash Generator - Free Online Hash Tool",
    meta_description:
      "Generate SHA hashes from text with this free online Hash Generator.",
  },

  {
    id: "jwt-decoder",
    slug: "jwt-decoder",
    name: "JWT Decoder",
    description: "Decode JWT header and payload",
    short_description: "Decode JWT header and payload",
    category: "developer",
    category_slug: "developer",
    processing_type: "client",
    seo_title: "JWT Decoder - Free Online JWT Tool",
    meta_description:
      "Decode JWT headers and payloads online with this free JWT Decoder.",
  },

  {
    id: "timestamp-converter",
    slug: "timestamp-converter",
    name: "Timestamp Converter",
    description: "Convert Unix timestamps to dates",
    short_description: "Convert Unix timestamps to dates",
    category: "developer",
    category_slug: "developer",
    processing_type: "client",
    seo_title: "Unix Timestamp Converter - Free Online Tool",
    meta_description:
      "Convert Unix timestamps to readable dates with this free online tool.",
  },
];

export const DEVELOPER_CATEGORY = {
  slug: "developer",
  name: "Developer Tools",
  description: "Useful tools for developers and programmers",
  tools: localDeveloperTools,
};

export function getDeveloperTool(
  slug: string
): ToolMeta | undefined {
  return localDeveloperTools.find(
    (tool) => tool.slug === slug
  );
}

