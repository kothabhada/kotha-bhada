// ============================================================
// Kotha Bada — Supabase connection settings
// ------------------------------------------------------------
// Paste your 2 values from Supabase here:
//   Supabase Dashboard → Project Settings → Data API (or API)
//   1) Project URL        -> SUPABASE_URL
//   2) anon / public key  -> SUPABASE_ANON_KEY
//
// The "anon" key is SAFE to put in front-end code.
// ============================================================

const SUPABASE_URL = "https://lkddojzdpavzdauvsehe.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_EfgSuJGzxp3TqXUl9WlITw_fBy1rXy9";

// Don't edit below — this just checks if you've filled it in.
const SUPABASE_READY =
  SUPABASE_URL.startsWith("http") && SUPABASE_ANON_KEY.length > 20;
