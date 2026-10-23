# UTILAI SEO Platform (frontend)

```
features/seo/
├── README.md
├── api/client.ts       # Typed fetch helpers (/api/v1/seo)
├── types.ts
├── components/         # Shell, cards, charts
└── views/              # Page-level sections
```

Routes: `/tools/seo/platform` and `/tools/seo/platform/[projectId]/[section]`.

Requires login — JWT from `utilai_auth_user` in localStorage.
