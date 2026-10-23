export type KeywordOverview = {
  phrase: string;
  country: string | null;
  in_project: boolean;
  keyword_id: string | null;
  volume: number | null;
  keyword_difficulty: number | null;
  intent: string | null;
  cpc: number | null;
  competitive_density: number | null;
  global_volume: number | null;
  volume_by_country: { country_code: string; country_name: string; volume: number | null }[];
  trend: { date: string; value: number }[];
  variations: KeywordIdeaRow[];
  questions: KeywordIdeaRow[];
  clusters: { name: string; keywords: string[]; count: number }[];
  serp_results: SerpResultRow[];
  latest_rank: number | null;
  provider_connected: boolean;
  provider_message: string;
  data_source: string | null;
};

export type KeywordIdeaRow = {
  phrase: string;
  volume: number | null;
  keyword_difficulty: number | null;
  intent: string | null;
  in_project: boolean;
};

export type SerpResultRow = {
  url: string;
  title: string | null;
  page_authority: number | null;
  referring_domains: number | null;
  backlinks: number | null;
  search_traffic: number | null;
  url_keywords: number | null;
  is_ai_overview?: boolean;
};
