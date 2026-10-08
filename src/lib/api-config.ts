const API_V1_SUFFIX = "/api/v1";
const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/+$/, "");

export const API_BASE = configuredApiUrl
  ? configuredApiUrl.endsWith(API_V1_SUFFIX)
    ? configuredApiUrl
    : `${configuredApiUrl}${API_V1_SUFFIX}`
  : `http://localhost:8001${API_V1_SUFFIX}`;
