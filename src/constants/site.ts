export const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3005";

// Google Search Console verification tokens rendered into <head>. Tokens are
// 40+ char base64url strings; anything shaped like a Google tag ID (G-, GTM-,
// UA-, AW-) is a copy-paste of the analytics ID into the wrong env var and is
// dropped rather than rendered as a bogus verification tag.
const GOOGLE_TAG_ID = /^(G|GTM|UA|AW)-/i;

export const GOOGLE_VERIFICATION_TOKENS = [
  process.env.GOOGLE_SITE_VERIFICATION,
  process.env.GOOGLE_SITE_VERIFICATION_2,
]
  .map((token) => token?.trim())
  .filter(
    (token): token is string =>
      Boolean(token) && !GOOGLE_TAG_ID.test(token as string),
  );

// Brand slug for the external content app (/blog proxy). Client-specific —
// swap via env when bootstrapping a new project. See middleware.ts and
// src/app/api/blog/topics/route.ts for its usage.
export const CONTENT_BRAND_SLUG = process.env.CONTENT_BRAND_SLUG ?? "";

// Secret key required by api.aeo.how, sent as the x-aeo-secret-key header when
// fetching articles/topics for CONTENT_BRAND_SLUG. Server-only — never expose
// to the client. Client-specific, obtained from the external content app.
export const AEO_SECRET_KEY = process.env.AEO_SECRET_KEY ?? "";
