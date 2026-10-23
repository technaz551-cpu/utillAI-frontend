export type PositionTrackingKpi = {
  value: number | null;
  change: number | null;
};

export type PositionTrackingDashboard = {
  domain: string;
  targeting: { country: string; device: string; search_engine: string };
  keywords_count: number;
  competitors_count: number;
  last_updated: string | null;
  kpis: {
    visibility: PositionTrackingKpi;
    est_traffic: PositionTrackingKpi;
    avg_position: PositionTrackingKpi;
    share_of_voice: PositionTrackingKpi;
  };
  visibility_trend: {
    date: string;
    visibility: number;
    share_of_voice: number;
    est_traffic: number;
    avg_position: number | null;
  }[];
  distribution: {
    top_1_3: number;
    top_4_10: number;
    top_11_20: number;
    top_21_100: number;
    not_ranked: number;
  };
  improved_count: number;
  declined_count: number;
  keywords: PositionKeywordRow[];
  top_keywords: PositionKeywordRow[];
  positive_impact: PositionKeywordRow[];
  negative_impact: PositionKeywordRow[];
  pages: { url: string; keywords: number; avg_position: number | null; est_traffic: number }[];
  serp_features: unknown[];
  data_note: string;
};

export type PositionKeywordRow = {
  keyword_id: string;
  phrase: string;
  position: number | null;
  previous_position: number | null;
  position_change: number | null;
  ranking_url: string | null;
  country: string | null;
  device: string | null;
  recorded_at: string | null;
  search_volume: number | null;
  difficulty: number | null;
  visibility_pct: number;
  est_traffic: number;
  intent: string;
};
