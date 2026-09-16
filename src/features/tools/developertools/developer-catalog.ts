export const localDeveloperTools = [
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    description: "Format and beautify JSON data",
    short_description: "Format and beautify JSON data",
    category: "developer",
    category_slug: "developer",
  },
  {
    slug: "json-validator",
    name: "JSON Validator",
    description: "Validate JSON syntax",
    short_description: "Validate JSON syntax",
    category: "developer",
    category_slug: "developer",
  },
  {
    slug: "base64",
    name: "Base64 Encoder & Decoder",
    description: "Encode and decode Base64 text",
    short_description: "Encode and decode Base64 text",
    category: "developer",
    category_slug: "developer",
  },
  {
    slug: "url-encoder",
    name: "URL Encoder & Decoder",
    description: "Encode and decode URL text",
    short_description: "Encode and decode URL text",
    category: "developer",
    category_slug: "developer",
  },
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    description: "Generate unique UUIDs",
    short_description: "Generate unique UUIDs",
    category: "developer",
    category_slug: "developer",
  },
  {
    slug: "hash-generator",
    name: "Hash Generator",
    description: "Generate SHA hashes from text",
    short_description: "Generate SHA hashes from text",
    category: "developer",
    category_slug: "developer",
  },
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    description: "Decode JWT header and payload",
    short_description: "Decode JWT header and payload",
    category: "developer",
    category_slug: "developer",
  },
  {
    slug: "timestamp-converter",
    name: "Timestamp Converter",
    description: "Convert Unix timestamps to dates",
    short_description: "Convert Unix timestamps to dates",
    category: "developer",
    category_slug: "developer",
  },
];

export const DEVELOPER_CATEGORY = {
  slug: "developer",
  name: "Developer Tools",
  description: "Useful tools for developers and programmers",
  tools: localDeveloperTools,
};

export function getDeveloperTool(slug: string) {
  return localDeveloperTools.find(
    (tool) => tool.slug === slug
  );
}