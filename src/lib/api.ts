import {
  PDF_CATEGORY,
  collapseMergedPdfTools,
  getPdfTool,
  localPdfTools,
} from "@/features/tools/pdf-catalog";

import {
  AI_CATEGORY,
  collapseMergedAiTools,
  getAiTool,
  localAiTools,
} from "@/features/tools/ai-catalog";

import {
  IMAGE_CATEGORY,
  getImageTool,
  localImageTools,
} from "@/features/tools/image-catalog";

import {
  INTERNET_CATEGORY,
  collapseMergedInternetTools,
  getInternetTool,
  localInternetTools,
} from "@/features/tools/internet-catalog";

import {
  DEVELOPER_CATEGORY,
  getDeveloperTool,
  localDeveloperTools,
} from "@/features/tools/developertools/developer-catalog";

import type { ToolMeta } from "@/features/tools/client-processors";

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api/v1";

export const SITE_NAME = "ToolForge";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

type CategoryRecord = Record<string, unknown> & {
  slug?: string;
  tools?: unknown[];
};

const LOCAL_CATEGORIES = [
  PDF_CATEGORY,
  AI_CATEGORY,
  IMAGE_CATEGORY,
  INTERNET_CATEGORY,
  DEVELOPER_CATEGORY,
];

function ensureLocalCategories(
  categories: CategoryRecord[]
): CategoryRecord[] {
  let result = [...categories];

  for (const local of LOCAL_CATEGORIES) {
    const existing = result.find((c) => c.slug === local.slug);

    if (!existing) {
      result =
        local.slug === "pdf"
          ? [local, ...result]
          : [...result, local];

      continue;
    }

    const current = (existing.tools || []) as Array<{
      slug?: string;
    }>;

    if (!current.length) {
      result = result.map((c) =>
        c.slug === local.slug
          ? {
            ...c,
            ...local,
            tools: local.tools,
          }
          : c
      );
    } else {
      const have = new Set(current.map((t) => t.slug));

      const extra = local.tools.filter(
        (t) => !have.has(t.slug)
      );

      const tools = extra.length
        ? [...extra, ...current]
        : current;

      result = result.map((c) =>
        c.slug === local.slug
          ? {
            ...c,
            tools: overlayCategoryTools(
              local.slug,
              tools as Array<Record<string, unknown>>
            ),
          }
          : c
      );
    }
  }

  return result;
}

function mergeMissing(
  result: Array<Record<string, unknown>>,
  extras: ToolMeta[]
) {
  const have = new Set(
    result.map(
      (t) => `${t.category_slug}:${t.slug}`
    )
  );

  const add = extras.filter(
    (t) =>
      !have.has(
        `${t.category_slug}:${t.slug}`
      )
  ) as unknown as Array<Record<string, unknown>>;

  return add.length
    ? [...add, ...result]
    : result;
}

function overlayInternetTools(
  tools: Array<Record<string, unknown>>
) {
  const local = new Map(
    localInternetTools().map((item) => [
      item.slug,
      item,
    ])
  );

  return tools.map((item) => {
    const extra =
      typeof item.slug === "string"
        ? local.get(item.slug)
        : undefined;

    return extra
      ? { ...item, ...extra }
      : item;
  });
}

function overlayMergedAiTool(
  tools: Array<Record<string, unknown>>
) {
  const sentiment = localAiTools().find(
    (t) => t.slug === "sentiment-analyzer"
  );

  const humanizer = localAiTools().find(
    (t) => t.slug === "human-summarizer"
  );

  return tools.map((t) => {
    if (
      t.slug === "sentiment-analyzer" &&
      sentiment
    ) {
      return {
        ...t,
        ...sentiment,
      };
    }

    if (
      t.slug === "human-summarizer" &&
      humanizer
    ) {
      return {
        ...t,
        ...humanizer,
      };
    }

    return t;
  });
}

function overlayMergedPdfTool(
  tools: Array<Record<string, unknown>>
) {
  const mergeSplit = localPdfTools().find(
    (t) => t.slug === "merge-pdf"
  );

  const convert = localPdfTools().find(
    (t) => t.slug === "jpg-to-pdf"
  );

  return tools.map((t) => {
    if (
      t.slug === "merge-pdf" &&
      mergeSplit
    ) {
      return {
        ...t,
        ...mergeSplit,
      };
    }

    if (
      t.slug === "split-pdf" &&
      mergeSplit
    ) {
      return {
        ...t,
        ...mergeSplit,
        id: t.id ?? "split-pdf",
        slug: "split-pdf",
      };
    }

    if (
      t.slug === "jpg-to-pdf" &&
      convert
    ) {
      return {
        ...t,
        ...convert,
      };
    }

    if (
      t.slug === "pdf-to-jpg" &&
      convert
    ) {
      return {
        ...t,
        ...convert,
        id: t.id ?? "pdf-to-jpg",
        slug: "pdf-to-jpg",
      };
    }

    return t;
  });
}

function overlayMergedInternetTool(
  tools: Array<Record<string, unknown>>
) {
  const combined =
    localInternetTools().find(
      (t) =>
        t.slug === "generate-random-email"
    );

  if (!combined) return tools;

  return tools.map((t) => {
    if (
      t.slug === "generate-random-email"
    ) {
      return {
        ...t,
        ...combined,
      };
    }

    if (
      t.slug === "generate-otp" ||
      t.slug === "verify-otp"
    ) {
      return {
        ...t,
        ...combined,
        id: t.id ?? t.slug,
        slug: t.slug,
      };
    }

    return t;
  });
}

function overlayCategoryTools(
  slug: string,
  tools: Array<Record<string, unknown>>
) {
  if (slug === "ai") {
    return overlayMergedAiTool(
      collapseMergedAiTools(tools)
    );
  }

  if (slug === "pdf") {
    return collapseMergedPdfTools(
      overlayMergedPdfTool(tools)
    );
  }

  if (slug === "internet") {
    return collapseMergedInternetTools(
      overlayMergedInternetTool(
        overlayInternetTools(tools)
      )
    );
  }

  return tools;
}

function mergeLocalTools(
  tools: Array<Record<string, unknown>>,
  params?: {
    category?: string;
    popular?: boolean;
  }
) {
  let result = [...tools];

  if (
    !params?.category ||
    params.category === "pdf"
  ) {
    result = mergeMissing(
      result,
      localPdfTools(params)
    );
  }

  if (
    !params?.category ||
    params.category === "ai"
  ) {
    result = mergeMissing(
      result,
      localAiTools(params)
    );
  }

  if (
    !params?.category ||
    params.category === "image"
  ) {
    result = mergeMissing(
      result,
      localImageTools(params)
    );
  }

  if (
    !params?.category ||
    params.category === "internet"
  ) {
    result = overlayInternetTools(
      mergeMissing(
        result,
        localInternetTools(params)
      )
    );
  }

  // Developer Tools
  if (
    !params?.category ||
    params.category === "developer"
  ) {
    result = mergeMissing(
      result,
      localDeveloperTools
    );
  }
  return overlayMergedAiTool(
    collapseMergedAiTools(
      collapseMergedPdfTools(
        overlayMergedPdfTool(
          collapseMergedInternetTools(
            overlayMergedInternetTool(result)
          )
        )
      )
    )
  );
}

function localCatalogTools(
  params?: {
    category?: string;
    popular?: boolean;
  }
) {
  return [
    ...localPdfTools(params),
    ...localAiTools(params),
    ...localImageTools(params),
    ...localInternetTools(params),
    ...localDeveloperTools,
  ];
}

function getLocalTool(
  category: string,
  slug: string
): ToolMeta | null {
  return (
    getPdfTool(category, slug) ??
    getAiTool(category, slug) ??
    getImageTool(category, slug) ??
    getInternetTool(category, slug) ??
    getDeveloperTool(slug) ??
    null
  );
}

function getLocalCategory(slug: string) {
  if (slug === "pdf") {
    return PDF_CATEGORY;
  }

  if (slug === "ai") {
    return AI_CATEGORY;
  }

  if (slug === "image") {
    return IMAGE_CATEGORY;
  }

  if (slug === "internet") {
    return INTERNET_CATEGORY;
  }

  if (slug === "developer") {
    return DEVELOPER_CATEGORY;
  }

  return null;
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(
    `${API_BASE}${path}`,
    {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
    }
  );

  const body = await res.json();

  if (!res.ok) {
    throw new Error(
      body.message || "Request failed"
    );
  }

  if (
    body &&
    typeof body === "object" &&
    "success" in body &&
    body.success === false
  ) {
    throw new Error(
      body.message || "Request failed"
    );
  }

  return (body.data ?? body) as T;
}

export async function fetchTool(
  category: string,
  slug: string
) : Promise<ToolMeta | null>{
  const localMerged = getLocalTool(
    category,
    slug
  );

  const localOnlyTools = new Set([
    "sentiment-analyzer",
    "keyword-extractor",
    "human-summarizer",
    "humanize-text",
    "ai-likelihood-detector",

    "merge-pdf",
    "split-pdf",
    "jpg-to-pdf",
    "pdf-to-jpg",

    "pdf-editor",

    
    // Developer Tools
    "json-formatter",
    "json-validator",
    "base64",
    "url-encoder",
    "uuid-generator",
    "hash-generator",
    "jwt-decoder",
    "timestamp-converter",
  ]);

  if (
    localMerged &&
    (
      category === "internet" ||
      category === "developer" ||
      localOnlyTools.has(slug)
    )
  ) {
    return localMerged;
  }

  try {
    const res = await fetch(
      `${API_BASE}/tools/${category}/${slug}`,
      {
        next: {
          revalidate: 300,
        },
      }
    );

    if (res.ok) {
      const json = await res.json();

      if (json.data) {
        return json.data as ToolMeta;
      }
    }
  } catch {
    // Fall through to local catalog
  }

  return getLocalTool(
    category,
    slug
  );
}

export async function fetchCategory(
  slug: string
) {
  try {
    const data =
      await apiFetch<CategoryRecord>(
        `/categories/${slug}`
      );

    if (data?.slug) {
      const local =
        getLocalCategory(slug);

      if (local) {
        const current =
          (data.tools || []) as Array<{
            slug?: string;
          }>;

        if (!current.length) {
          return {
            ...data,
            ...local,
            tools: local.tools,
          };
        }

        const have = new Set(
          current.map((t) => t.slug)
        );

        const extra =
          local.tools.filter(
            (t) => !have.has(t.slug)
          );

        const tools = extra.length
          ? [...extra, ...current]
          : current;

        const next =
          overlayCategoryTools(
            local.slug,
            tools as Array<
              Record<string, unknown>
            >
          );

        return {
          ...data,
          tools: next,
        };
      }

      return data;
    }
  } catch {
    // Fall through
  }

  return getLocalCategory(slug);
}

export async function fetchCategories() {
  try {
    const categories =
      await apiFetch<CategoryRecord[]>(
        "/categories"
      );

    return ensureLocalCategories(
      Array.isArray(categories)
        ? categories
        : []
    );
  } catch {
    return LOCAL_CATEGORIES;
  }
}

export async function fetchTools(
  params?: {
    category?: string;
    popular?: boolean;
  }
) {
  const q = new URLSearchParams();

  if (params?.category) {
    q.set(
      "category",
      params.category
    );
  }

  if (params?.popular) {
    q.set(
      "popular",
      "true"
    );
  }

  try {
    const tools =
      await apiFetch<
        Array<Record<string, unknown>>
      >(`/tools?${q}`);

    return mergeLocalTools(
      Array.isArray(tools)
        ? tools
        : [],
      params
    );
  } catch {
    return localCatalogTools(params);
  }
}