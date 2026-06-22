// World Trading Pvt. Ltd. — Attendance
// Supabase connection (reuses the existing project).
const SUPABASE_URL = "https://lkddojzdpavzdauvsehe.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_EfgSuJGzxp3TqXUl9WlITw_fBy1rXy9";

// Office schedule
const OFFICE_START = "10:00"; // anyone checking in after this is "Late"
const OFFICE_END   = "18:00"; // 6:00 PM — shown in reports

// Nepali (Bikram Sambat) date display.
// If the shown Nepali date is one day off from your calendar, change this to 1 or -1.
const BS_OFFSET = 0;

// Weekly day off (for projecting the full-month salary).
// 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat. Nepal default = Saturday.
const WEEKLY_OFF = 6;

const SUPABASE_READY =
  SUPABASE_URL.startsWith("http") && SUPABASE_ANON_KEY.length > 20;
