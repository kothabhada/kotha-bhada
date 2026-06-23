// Kotha Bada — app logic
// -----------------------------------------------------------
const STORE_KEY = "kothabada_listings";
const FAV_KEY = "kothabada_favs";
let activeChip = "";

// ----- Favorites (saved on this device, no login needed) -----
function getFavs() {
  try { return JSON.parse(localStorage.getItem(FAV_KEY)) || []; }
  catch (e) { return []; }
}
function isFav(id) { return getFavs().includes(String(id)); }
function toggleFav(id, ev) {
  if (ev) ev.stopPropagation();
  id = String(id);
  let favs = getFavs();
  favs = favs.includes(id) ? favs.filter((x) => x !== id) : [id, ...favs];
  localStorage.setItem(FAV_KEY, JSON.stringify(favs));
  // refresh hearts + count + the current view
  document.querySelectorAll(`.fav-btn[data-id="${CSS.escape(id)}"]`).forEach((b) =>
    b.classList.toggle("on", favs.includes(id))
  );
  updateSavedCount();
  if (view === "saved") applyFilters();
}
function updateSavedCount() {
  const n = getFavs().length;
  const el = document.getElementById("saved-count");
  if (el) el.textContent = n ? `(${n})` : "";
}
function heartHTML(l, inDetail) {
  return `<button class="fav-btn${isFav(l.id) ? " on" : ""}${inDetail ? " in-detail" : ""}"
    data-id="${l.id}" title="Save" onclick="toggleFav('${l.id}', event)">
    <span class="heart">❤️</span></button>`;
}

// ----- Language (English / Nepali) -----
const LANG_KEY = "kothabada_lang";
let lang = localStorage.getItem(LANG_KEY) || "en";

const I18N = {
  en: {},
  ne: {
    // header
    mylistings: "मेरा घरहरू", login: "लग इन", logout: "लग आउट", post: "+ हाल्नुहोस्",
    // hero
    hero_title: 'घरधनीबाट सिधै <span>काठमाडौं</span>मा<br/>घर भाडामा लिनुहोस्।',
    hero_sub: "कुनै एजेन्ट छैन। कुनै कमिसन छैन। घर, फ्ल्याट र कोठाहरू — WhatsApp वा फोनबाट घरधनीलाई सिधै सम्पर्क गर्नुहोस्।",
    trust1: "🚫 एजेन्ट शुल्क छैन", trust2: "💬 प्रत्यक्ष सम्पर्क", trust3: "📍 नक्सा खोज", trust4: "❤️ मनपर्ने सुरक्षित",
    // search
    where: "कहाँ", where_ph: "क्षेत्र जस्तै बानेश्वर, ललितपुर", type: "प्रकार",
    anytype: "कुनै पनि प्रकार", maxrent: "अधिकतम भाडा (रू)", anyprice: "कुनै पनि मूल्य",
    price15: "१५,००० भन्दा कम", price25: "२५,००० भन्दा कम", price40: "४०,००० भन्दा कम", price60: "६०,००० भन्दा कम",
    price100: "१ लाख भन्दा कम", price200: "२ लाख भन्दा कम", price500: "५ लाख भन्दा कम", price1000: "१० लाख भन्दा कम",
    search: "खोज्नुहोस्",
    // chips / types
    all: "सबै", house: "घर", flat: "फ्ल्याट", room: "कोठा", office: "अफिस",
    // filters2
    anybeds: "कुनै पनि कोठा", beds1: "१+ कोठा", beds2: "२+ कोठा", beds3: "३+ कोठा", beds4: "४+ कोठा",
    anyfurnish: "कुनै पनि फर्निसिङ", furnished: "फर्निस्ड", semi: "अर्ध-फर्निस्ड", unfurnished: "फर्निसिङ नभएको",
    f_parking: "🅿️ पार्किङ", f_negotiable: "💬 मोलमोलाई", clear: "हटाउनुहोस्",
    // section / views
    available: "अहिले उपलब्ध", v_list: "☰ सूची", v_map: "🗺 नक्सा", v_saved: "♥ सुरक्षित",
    homes: "घर", loading: "लोड हुँदै…", saved_count_word: "सुरक्षित",
    // card / detail
    permonth: "/ महिना", negotiabletag: "मोलमोलाई", bed: "कोठा", bath: "बाथ", parkingword: "पार्किङ",
    rent: "भाडा", typew: "प्रकार", bedrooms: "कोठा", bathrooms: "बाथरूम", furnishing: "फर्निसिङ",
    parkingspec: "पार्किङ", yes: "छ", no: "छैन", postedby: "पोस्ट गर्ने",
    // empty states
    no_match: "तपाईंको खोजसँग मिल्ने घर भेटिएन।<br/>अर्को क्षेत्र वा मूल्य प्रयास गर्नुहोस्।",
    saved_empty: "अहिलेसम्म कुनै सुरक्षित घर छैन।<br/>कुनै घरमा ❤️ थिचेर यहाँ सुरक्षित गर्नुहोस्।",
    // post form
    l_title: "शीर्षक *", ph_title: "जस्तै बानेश्वर नजिक २BHK फ्ल्याट", l_type: "प्रकार *", choose: "छान्नुहोस्",
    l_area: "क्षेत्र / स्थान *", ph_area: "जस्तै नयाँ बानेश्वर", l_rent: "मासिक भाडा (रू) *",
    l_bedrooms: "कोठा", l_bathrooms: "बाथरूम", l_furnishing: "फर्निसिङ", l_extras: "अतिरिक्त",
    c_parking: "🅿️ पार्किङ उपलब्ध", c_negotiable: "💬 मूल्य मोलमोलाई",
    l_desc: "विवरण", ph_desc: "पानीको आपूर्ति, पार्किङ, नजिकका स्थानहरू...",
    l_name: "तपाईंको नाम *", ph_name: "तपाईंको नाम", l_phone: "WhatsApp/फोन नम्बर *",
    l_pin: "नक्सामा स्थान चिन्ह लगाउनुहोस्", h_pin: "घर भएको ठाउँमा नक्सा थिच्नुहोस्। भाडामा बस्नेले नक्सामा देख्नेछन्।",
    l_photos: "तस्बिरहरू", h_photos: "फोन वा कम्प्युटरबाट ५ वटासम्म तस्बिर छान्नुहोस्। पहिलो तस्बिर कभर हुन्छ।",
    l_video: "भिडियो (वैकल्पिक)", h_video: "छोटो वाकथ्रु भिडियो थप्नुहोस् (~५० MB भन्दा कम)। भाडामा बस्नेलाई चलिरहेको ठाउँ हेर्न मन पर्छ।",
    post_title_new: "आफ्नो घर हाल्नुहोस् — निःशुल्क", post_sub_new: "यो भर्नुहोस्, भाडामा बस्नेले तपाईंलाई सिधै सम्पर्क गर्नेछन्। एजेन्ट छैन, शुल्क छैन।",
    post_btn_new: "मेरो घर हाल्नुहोस्", post_title_edit: "आफ्नो घर सम्पादन गर्नुहोस्",
    post_sub_edit: "विवरण अद्यावधिक गर्नुहोस्। थपिएका नयाँ तस्बिर समावेश हुन्छन्; पुराना तस्बिर रहन्छन्।",
    post_btn_edit: "परिवर्तन सुरक्षित गर्नुहोस्", posting: "हाल्दै...", uploading: "तस्बिर अपलोड हुँदै...", saving: "सुरक्षित हुँदै...",
    // auth
    l_email: "इमेल", l_password: "पासवर्ड",
    auth_login_title: "लग इन", auth_login_sub: "घर हाल्न र व्यवस्थापन गर्न लग इन गर्नुहोस्।",
    auth_signup_title: "आफ्नो घरधनी खाता बनाउनुहोस्", auth_signup_sub: "घर हाल्न र व्यवस्थापन गर्न निःशुल्क साइन अप गर्नुहोस्।",
    auth_login_btn: "लग इन", auth_signup_btn: "खाता बनाउनुहोस्", please_wait: "कृपया पर्खनुहोस्...",
    auth_google: "Google बाट जारी राख्नुहोस्", auth_or: "वा इमेल प्रयोग गर्नुहोस्",
    switch_new: "नयाँ घरधनी?", switch_have: "पहिले नै खाता छ?", switch_create: "खाता बनाउनुहोस्", switch_login: "लग इन",
    // my listings
    edit: "सम्पादन", del: "मेट्नुहोस्", loggedinas: "लग इन:",
    // role chooser
    welcome_title: "कोठा भाडामा स्वागत छ 🏠", welcome_sub: "तपाईं आज किन आउनुभयो?",
    role_renter_t: "म घर खोज्दै छु",
    role_renter_d: "घर, फ्ल्याट र कोठाहरू हेर्नुहोस् र घरधनीलाई सिधै सम्पर्क गर्नुहोस्। खाता आवश्यक छैन।",
    role_owner_t: "म आफ्नो घर भाडामा दिन चाहन्छु",
    role_owner_d: "आफ्नो घर हाल्नुहोस् र जुनसुकै बेला व्यवस्थापन गर्नुहोस्। निःशुल्क घरधनी खाता।",
    welcome_foot: "तपाईं पृष्ठको माथिबाट जुनसुकै बेला परिवर्तन गर्न सक्नुहुन्छ।",
    role_renter_chip: "🔍 भाडामा बस्ने", role_owner_chip: "🏠 घरधनी",
    toast_renter: "भाडामा बस्ने रूपमा हेर्दै 🔍", toast_owner: "घरधनी मोड — हाल्न लग इन गर्नुहोस् 🏠",
    // trust signals
    verified: "प्रमाणित", verified_owner: "प्रमाणित घरधनी", views: "हेराइ", call: "कल गर्नुहोस्",
    // share
    share: "सेयर गर्नुहोस्", share_title: "यो घर सेयर गर्नुहोस्",
    share_sub: "परिवार वा साथीहरूलाई पठाउनुहोस् ताकि उनीहरूले पनि हेर्न सकून्।",
    share_whatsapp: "WhatsApp मा सेयर गर्नुहोस्", share_copy: "लिङ्क कपी गर्नुहोस्",
    share_more: "थप विकल्पहरू…", link_copied: "🔗 लिङ्क कपी भयो!",
    // sort
    sort_newest: "↕ नयाँ", sort_price_low: "मूल्य: कम → धेरै", sort_price_high: "मूल्य: धेरै → कम",
    // how it works
    how_title: "कोठा भाडा कसरी काम गर्छ",
    how_sub: "काठमाडौंमा घर भाडामा लिने सजिलो तरिका — एजेन्ट छैन, कमिसन छैन।",
    how1_t: "१. खोज्नुहोस्", how1_d: "क्षेत्र, मूल्य र प्रकार अनुसार घर हेर्नुहोस् — तस्बिर, भिडियो र नक्सासहित।",
    how2_t: "२. घरधनीलाई सम्पर्क", how2_d: "WhatsApp वा फोनबाट घरधनीलाई सिधै सम्पर्क गर्नुहोस्। बिचमा कोही छैन।",
    how3_t: "३. सर्नुहोस्", how3_d: "हेर्नुहोस्, भाडा मिलाउनुहोस्, र सर्नुहोस्। कमिसन छैन, लुकेको शुल्क छैन।",
    // footer
    foot_tagline: "काठमाडौं उपत्यकामा सिधै भाडा।",
    foot_t1: "🚫 एजेन्ट शुल्क छैन", foot_t2: "🔒 घरधनीसँग सिधै", foot_t3: "🇳🇵 काठमाडौंका लागि",
    foot_help: "सहयोग चाहियो?", foot_love: "भाडावाला र घरधनीका लागि ❤️ ले बनाइएको",
  },
};

function t(key) {
  if (lang === "en") return null; // signal: use the element's English default
  return I18N.ne[key] != null ? I18N.ne[key] : null;
}
// For dynamic strings we always need an English value too:
const EN = {
  all: "All", house: "House", flat: "Flat", room: "Room", office: "Office",
  homes: "homes", loading: "Loading…", permonth: "/ month", negotiabletag: "Negotiable",
  bed: "bed", bath: "bath", parkingword: "Parking", rent: "Rent", typew: "Type",
  bedrooms: "Bedrooms", bathrooms: "Bathrooms", furnishing: "Furnishing", parkingspec: "Parking",
  yes: "Yes", no: "No", postedby: "Posted by",
  no_match: "No homes match your search yet.<br/>Try a different area or price.",
  saved_empty: "No saved homes yet.<br/>Tap the ❤️ on any home to save it here.",
  post_title_new: "Post your house — free",
  post_sub_new: "Fill this and renters will contact you directly. No agent, no fees.",
  post_btn_new: "Post my house", post_title_edit: "Edit your listing",
  post_sub_edit: "Update the details. New photos you add will be included; existing photos stay.",
  post_btn_edit: "Save changes", posting: "Posting...", uploading: "Uploading photos...", saving: "Saving...",
  login: "Log in", logout: "Log out", edit: "Edit", del: "Delete", loggedinas: "Logged in as",
  auth_login_title: "Log in", auth_login_sub: "Log in to post and manage your houses.",
  auth_signup_title: "Create your owner account", auth_signup_sub: "Sign up free to post houses and manage them anytime.",
  auth_login_btn: "Log in", auth_signup_btn: "Create account", please_wait: "Please wait...",
  auth_google: "Continue with Google", auth_or: "or use email",
  switch_new: "New owner?", switch_have: "Already have an account?", switch_create: "Create an account", switch_login: "Log in",
  role_renter_chip: "🔍 Renter", role_owner_chip: "🏠 Owner",
  toast_renter: "Browsing as a renter 🔍", toast_owner: "Owner mode — log in to post 🏠",
  verified: "Verified", verified_owner: "Verified owner", views: "views", call: "Call",
  share: "Share", share_title: "Share this home",
  share_sub: "Send it to family or friends so they can see it too.",
  share_whatsapp: "Share on WhatsApp", share_copy: "Copy link",
  share_more: "More options…", link_copied: "🔗 Link copied!",
};
// tt(): translated dynamic string (Nepali if set, else English)
function tt(key) {
  if (lang === "ne" && I18N.ne[key] != null) return I18N.ne[key];
  return EN[key] != null ? EN[key] : key;
}

function applyLang() {
  document.documentElement.lang = lang;
  localStorage.setItem(LANG_KEY, lang);
  document.getElementById("lang-btn").textContent = lang === "en" ? "नेपाली" : "English";
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const v = t(el.getAttribute("data-i18n"));
    if (v != null) el.textContent = v;
    else if (lang === "en" && el.dataset.en) el.textContent = el.dataset.en;
  });
  document.querySelectorAll("[data-i18n-ph]").forEach((el) => {
    const v = t(el.getAttribute("data-i18n-ph"));
    if (v != null) el.placeholder = v;
    else if (lang === "en" && el.dataset.enPh) el.placeholder = el.dataset.enPh;
  });
  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    const v = t(el.getAttribute("data-i18n-html"));
    if (v != null) el.innerHTML = v;
    else if (lang === "en" && el.dataset.enHtml) el.innerHTML = el.dataset.enHtml;
  });
  renderChips();
  if (typeof applyRole === "function") applyRole();
  applyFilters();
  updateSavedCount();
}

function toggleLang() {
  lang = lang === "en" ? "ne" : "en";
  applyLang();
}

// Remember English originals on first run so we can switch back
function cacheEnglishDefaults() {
  document.querySelectorAll("[data-i18n]").forEach((el) => (el.dataset.en = el.textContent));
  document.querySelectorAll("[data-i18n-ph]").forEach((el) => (el.dataset.enPh = el.placeholder));
  document.querySelectorAll("[data-i18n-html]").forEach((el) => (el.dataset.enHtml = el.innerHTML));
}

// ----- Role: renter vs owner -----
const ROLE_KEY = "kothabada_role";
function getRole() {
  return localStorage.getItem(ROLE_KEY); // null | "renter" | "owner"
}
function setRole(r) {
  localStorage.setItem(ROLE_KEY, r);
  closeModals();
  applyRole();
  showToast(r === "owner" ? tt("toast_owner") : tt("toast_renter"));
  // An owner who isn't logged in yet → nudge them to log in
  if (r === "owner" && sb && !currentUser) openAuth();
}
function openWelcome() {
  // Only show the close button if they've already chosen once
  document.getElementById("welcome-close").style.display = getRole() ? "" : "none";
  document.getElementById("welcome-modal").classList.add("open");
  document.body.style.overflow = "hidden";
}
function applyRole() {
  const r = getRole();
  const chip = document.getElementById("role-chip");
  chip.textContent = r === "owner" ? tt("role_owner_chip") : tt("role_renter_chip");
  updateAuthUI();
}
let allListings = []; // in-memory cache of everything we show

// Connect to Supabase if config.js is filled in
let sb = null;
if (typeof SUPABASE_READY !== "undefined" && SUPABASE_READY) {
  sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// ----- Auth state -----
let currentUser = null;
let authMode = "login"; // "login" | "signup"
let editingId = null; // set when editing an existing listing

async function initAuth() {
  if (!sb) return;
  const { data } = await sb.auth.getSession();
  currentUser = data.session ? data.session.user : null;
  updateAuthUI();
  sb.auth.onAuthStateChange((_event, session) => {
    currentUser = session ? session.user : null;
    updateAuthUI();
  });
}

function updateAuthUI() {
  const authBtn = document.getElementById("auth-btn");
  const myBtn = document.getElementById("mylistings-btn");
  const postBtn = document.getElementById("post-btn");
  // Owner-only controls (post / login / my listings) appear only in owner mode
  const owner = getRole() === "owner";
  postBtn.style.display = owner ? "" : "none";
  authBtn.style.display = owner ? "" : "none";

  if (currentUser) {
    authBtn.textContent = tt("logout");
    authBtn.onclick = logout;
    myBtn.style.display = owner ? "" : "none";
  } else {
    authBtn.textContent = tt("login");
    authBtn.onclick = openAuth;
    myBtn.style.display = "none";
  }
}

function openAuth() {
  authMode = "login";
  applyAuthMode();
  document.getElementById("auth-modal").classList.add("open");
  document.body.style.overflow = "hidden";
}

function toggleAuthMode() {
  authMode = authMode === "login" ? "signup" : "login";
  applyAuthMode();
}

function applyAuthMode() {
  const isLogin = authMode === "login";
  document.getElementById("auth-title").textContent = isLogin ? tt("auth_login_title") : tt("auth_signup_title");
  document.getElementById("auth-sub").textContent = isLogin ? tt("auth_login_sub") : tt("auth_signup_sub");
  document.getElementById("auth-submit").textContent = isLogin ? tt("auth_login_btn") : tt("auth_signup_btn");
  document.getElementById("auth-switch-text").textContent = isLogin ? tt("switch_new") : tt("switch_have");
  document.getElementById("auth-switch-link").textContent = isLogin ? tt("switch_create") : tt("switch_login");
}

async function submitAuth(e) {
  e.preventDefault();
  if (!sb) { showToast("⚠️ Database not connected."); return; }
  const fd = new FormData(e.target);
  const email = fd.get("email");
  const password = fd.get("password");
  const btn = document.getElementById("auth-submit");
  btn.disabled = true;
  btn.textContent = tt("please_wait");

  let error;
  if (authMode === "signup") {
    ({ error } = await sb.auth.signUp({ email, password }));
  } else {
    ({ error } = await sb.auth.signInWithPassword({ email, password }));
  }

  btn.disabled = false;
  applyAuthMode();
  if (error) { showToast("⚠️ " + error.message); return; }

  // If email confirmation is ON, signUp won't create a session yet.
  const { data } = await sb.auth.getSession();
  if (!data.session && authMode === "signup") {
    closeModals();
    showToast("📧 Check your email to confirm, then log in.");
    return;
  }
  e.target.reset();
  closeModals();
  showToast(authMode === "signup" ? "✅ Welcome to Kotha Bhada!" : "✅ Logged in!");
}

async function signInWithGoogle() {
  if (!sb) { showToast("⚠️ Database not connected."); return; }
  const { error } = await sb.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: window.location.origin + window.location.pathname }
  });
  if (error) showToast("⚠️ " + error.message);
  // On success the browser redirects to Google, then back here.
}

async function logout() {
  if (sb) await sb.auth.signOut();
  showToast("👋 Logged out.");
}

// Turn a Supabase row (for_who) into our app shape (forWho)
function fromRow(r) {
  return {
    id: r.id,
    title: r.title,
    type: r.type,
    area: r.area,
    city: r.city || "Kathmandu",
    price: r.price,
    bedrooms: r.bedrooms,
    bathrooms: r.bathrooms,
    parking: r.parking,
    furnished: r.furnished,
    forWho: r.for_who,
    description: r.description,
    owner: r.owner,
    phone: r.phone,
    userId: r.user_id,
    verified: !!r.user_id, // posted by a registered owner account
    createdAt: r.created_at,
    views: r.views,
    lat: r.lat,
    lng: r.lng,
    negotiable: r.negotiable,
    video: r.video,
    image: r.image,
    // Prefer the new multi-photo column; fall back to the single old image
    images:
      r.images && r.images.length
        ? r.images
        : r.image
        ? [r.image]
        : [],
  };
}

// Always return a usable list of photo URLs for a listing
function photosOf(l) {
  if (l.images && l.images.length) return l.images;
  if (l.image) return [l.image];
  return [FALLBACK_IMG];
}

// Local fallback (browser-only) when Supabase isn't connected yet
function loadLocal() {
  let saved = [];
  try {
    saved = JSON.parse(localStorage.getItem(STORE_KEY)) || [];
  } catch (e) {}
  return [...saved, ...SAMPLE_LISTINGS];
}

// Fetch everything we should display
async function fetchListings() {
  if (sb) {
    const { data, error } = await sb
      .from("listings")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.warn("Supabase read failed, using local data:", error.message);
      return loadLocal();
    }
    return data.map(fromRow);
  }
  return loadLocal();
}

// Format money: रू 22,000
function npr(n) {
  return "रू " + Number(n).toLocaleString("en-IN");
}

// "Posted 3 days ago" — bilingual, friendly
function timeAgo(dateStr) {
  if (!dateStr) return "";
  const ne = lang === "ne";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  if (mins < 60) return ne ? "भर्खरै" : "just now";
  if (hrs < 24) return ne ? `${hrs} घण्टा अगाडि` : `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
  if (days < 30) return ne ? `${days} दिन अगाडि` : `${days} day${days > 1 ? "s" : ""} ago`;
  const months = Math.floor(days / 30);
  return ne ? `${months} महिना अगाडि` : `${months} month${months > 1 ? "s" : ""} ago`;
}

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=900&q=70";

// ---------- Render ----------
function renderChips() {
  const types = ["", "House", "Flat", "Room", "Office"];
  const labels = {
    "": tt("all"),
    House: "🏡 " + tt("house"),
    Flat: "🏢 " + tt("flat"),
    Room: "🛏 " + tt("room"),
    Office: "💼 " + tt("office"),
  };
  document.getElementById("chips").innerHTML = types
    .map(
      (t) =>
        `<button class="chip ${t === activeChip ? "active" : ""}" onclick="setChip('${t}')">${labels[t]}</button>`
    )
    .join("");
}

function setChip(t) {
  activeChip = t;
  document.getElementById("f-type").value = t;
  renderChips();
  applyFilters();
}

function cardHTML(l) {
  const photos = photosOf(l);
  const img = photos[0];
  const beds = l.bedrooms ? `${l.bedrooms} ${tt("bed")}` : "";
  const baths = l.bathrooms ? `${l.bathrooms} ${tt("bath")}` : "";
  const park = l.parking ? tt("parkingword") : "";
  const meta = [beds, baths, park].filter(Boolean).join(" · ");
  const tags = [];
  if (l.video) tags.push("🎥");
  if (photos.length > 1) tags.push("📷 " + photos.length);
  const countBadge = tags.length ? `<span class="photo-count">${tags.join(" · ")}</span>` : "";
  return `
    <article class="card" onclick="openDetail('${l.id}')">
      <div class="photo">
        <img src="${img}" alt="${l.title}" loading="lazy" onerror="this.src='${FALLBACK_IMG}'" />
        <span class="badge">${l.type}</span>
        ${countBadge}
        ${heartHTML(l, false)}
      </div>
      <div class="card-body">
        <div class="card-title">${l.title}</div>
        <div class="card-loc">📍 ${l.area}</div>
        <div class="card-meta">${meta}</div>
        <div class="card-sub">${
          l.verified ? `<span class="verified">✓ ${tt("verified")}</span>` : ""
        }${l.createdAt ? `${l.verified ? " · " : ""}${timeAgo(l.createdAt)}` : ""}</div>
        <div class="price">${npr(l.price)} <small>${tt("permonth")}</small>${
          l.negotiable ? `<span class="nego-tag">${tt("negotiabletag")}</span>` : ""
        }</div>
      </div>
    </article>`;
}

// Shimmer placeholders while data loads
function renderSkeletons(n) {
  const card = `<div class="skeleton">
    <div class="sk-photo"></div>
    <div class="sk-line"></div>
    <div class="sk-line short"></div>
    <div class="sk-line tiny"></div>
  </div>`;
  document.getElementById("grid").innerHTML = Array(n || 6).fill(card).join("");
  document.getElementById("count").textContent = tt("loading");
}

function renderGrid(list) {
  const grid = document.getElementById("grid");
  document.getElementById("count").textContent = list.length + " " + tt("homes");
  if (!list.length) {
    grid.innerHTML = `<div class="empty" style="grid-column:1/-1">
      <div class="big">🔍</div>
      <p>${tt("no_match")}</p>
    </div>`;
    return;
  }
  grid.innerHTML = list.map(cardHTML).join("");
}

// ---------- Map view ----------
const KTM_CENTER = [27.7172, 85.324];
// Approx coordinates for common Kathmandu Valley areas (fallback when a
// listing has no exact pin yet)
const AREA_COORDS = {
  baneshwor: [27.6894, 85.337],
  kirtipur: [27.6786, 85.2776],
  lalitpur: [27.6776, 85.31],
  jhamsikhel: [27.6745, 85.31],
  patan: [27.6766, 85.325],
  chabahil: [27.7173, 85.346],
  bhaktapur: [27.671, 85.4298],
  putalisadak: [27.7064, 85.3238],
  thamel: [27.7154, 85.3123],
  boudha: [27.7215, 85.362],
  kalanki: [27.6936, 85.281],
  balaju: [27.7308, 85.3015],
  koteshwor: [27.6786, 85.3494],
};

// Best-known location for a listing: exact pin → area lookup → city center
function coordsOf(l) {
  if (typeof l.lat === "number" && typeof l.lng === "number") return [l.lat, l.lng];
  const key = (l.area || "").toLowerCase();
  for (const name in AREA_COORDS) {
    if (key.includes(name)) return AREA_COORDS[name];
  }
  return null; // unknown — we'll skip or jitter around center
}

// ---------- Area autocomplete ----------
// Common Kathmandu Valley neighbourhoods so renters can pick instead of
// typing the full (or correct) spelling. Each has English + Nepali so the
// dropdown matches whichever script the renter types in.
const AREAS = [
  { en: "New Baneshwor", ne: "नयाँ बानेश्वर" },
  { en: "Old Baneshwor", ne: "पुरानो बानेश्वर" },
  { en: "Mid Baneshwor", ne: "मध्य बानेश्वर" },
  { en: "Koteshwor", ne: "कोटेश्वर" },
  { en: "Tinkune", ne: "तिनकुने" },
  { en: "Sinamangal", ne: "सिनामंगल" },
  { en: "Battisputali", ne: "बत्तिसपुतली" },
  { en: "Maitighar", ne: "माइतीघर" },
  { en: "Thapathali", ne: "थापाथली" },
  { en: "Kupondole", ne: "कुपण्डोल" },
  { en: "Jawalakhel", ne: "जावलाखेल" },
  { en: "Pulchowk", ne: "पुल्चोक" },
  { en: "Patan", ne: "पाटन" },
  { en: "Lalitpur", ne: "ललितपुर" },
  { en: "Jhamsikhel", ne: "झम्सिखेल" },
  { en: "Sanepa", ne: "सानेपा" },
  { en: "Kumaripati", ne: "कुमारीपाटी" },
  { en: "Satdobato", ne: "सतडोबाटो" },
  { en: "Gwarko", ne: "ग्वार्को" },
  { en: "Imadol", ne: "इमाडोल" },
  { en: "Lagankhel", ne: "लगनखेल" },
  { en: "Ekantakuna", ne: "एकान्तकुना" },
  { en: "Balkumari", ne: "बालकुमारी" },
  { en: "Bhaktapur", ne: "भक्तपुर" },
  { en: "Madhyapur Thimi", ne: "मध्यपुर थिमी" },
  { en: "Suryabinayak", ne: "सूर्यविनायक" },
  { en: "Chabahil", ne: "चाबहिल" },
  { en: "Boudha", ne: "बौद्ध" },
  { en: "Jorpati", ne: "जोरपाटी" },
  { en: "Mulpani", ne: "मूलपानी" },
  { en: "Kapan", ne: "कपन" },
  { en: "Budhanilkantha", ne: "बूढानीलकण्ठ" },
  { en: "Tokha", ne: "टोखा" },
  { en: "Maharajgunj", ne: "महाराजगञ्ज" },
  { en: "Baluwatar", ne: "बालुवाटार" },
  { en: "Naxal", ne: "नक्साल" },
  { en: "Dillibazar", ne: "डिल्लीबजार" },
  { en: "Putalisadak", ne: "पुतलीसडक" },
  { en: "Bagbazar", ne: "बागबजार" },
  { en: "Anamnagar", ne: "अनामनगर" },
  { en: "New Road", ne: "न्यु रोड" },
  { en: "Thamel", ne: "ठमेल" },
  { en: "Lazimpat", ne: "लाजिम्पाट" },
  { en: "Lainchaur", ne: "लैनचौर" },
  { en: "Balaju", ne: "बालाजु" },
  { en: "Swayambhu", ne: "स्वयम्भू" },
  { en: "Kalanki", ne: "कलंकी" },
  { en: "Kalimati", ne: "कालीमाटी" },
  { en: "Teku", ne: "टेकु" },
  { en: "Tripureshwor", ne: "त्रिपुरेश्वर" },
  { en: "Kuleshwor", ne: "कुलेश्वर" },
  { en: "Naikap", ne: "नैकाप" },
  { en: "Thankot", ne: "थानकोट" },
  { en: "Kirtipur", ne: "कीर्तिपुर" },
  { en: "Chobhar", ne: "चोभार" },
  { en: "Sitapaila", ne: "सीतापाइला" },
  { en: "Ramkot", ne: "रामकोट" },
  { en: "Samakhusi", ne: "समाखुसी" },
  { en: "Gongabu", ne: "गोंगबु" },
  { en: "Basundhara", ne: "बसुन्धरा" },
  { en: "Dhapasi", ne: "धापासी" },
  { en: "Bansbari", ne: "बाँसबारी" },
  { en: "Sukedhara", ne: "सुकेधारा" },
  { en: "Hattigauda", ne: "हात्तीगौडा" },
  { en: "Hadigaun", ne: "हाँडीगाउँ" },
  { en: "Gaushala", ne: "गौशाला" },
  { en: "Mitrapark", ne: "मित्रपार्क" },
  { en: "Tilganga", ne: "तिलगंगा" },
  { en: "Pepsicola", ne: "पेप्सिकोला" },
  { en: "Lokanthali", ne: "लोकन्थली" },
  { en: "Gatthaghar", ne: "गठ्ठाघर" },
  { en: "Jadibuti", ne: "जडिबुटी" },
  { en: "Balkot", ne: "बालकोट" },
  { en: "Nakhipot", ne: "नखिपोट" },
  { en: "Bhaisepati", ne: "भैसेपाटी" },
  { en: "Nakhu", ne: "नख्खु" },
  { en: "Chapagaun", ne: "चापागाउँ" },
  { en: "Godawari", ne: "गोदावरी" },
  { en: "Harisiddhi", ne: "हरिसिद्धि" },
];

// Area autocomplete — two instances share this code:
//   "search" = the Where box on the home page (also live-filters results)
//   "post"   = the Area/Location field in the post-a-property form
const AREA_AC = {
  search: { input: "f-area", box: "area-suggest", filter: true },
  post:   { input: "p-area-input", box: "p-area-suggest", filter: false },
};
const acMatches = { search: [], post: [] };
const acActive = { search: -1, post: -1 };

// Called on every keystroke in an area field.
function areaACInput(which) {
  const cfg = AREA_AC[which];
  if (cfg.filter) applyFilters(); // keep live results updating as they type
  const inp = document.getElementById(cfg.input);
  const box = document.getElementById(cfg.box);
  if (!inp || !box) return;
  const q = inp.value.trim().toLowerCase();
  acActive[which] = -1;
  if (!q) { hideAreaAC(which); return; }
  const isNepali = /[ऀ-ॿ]/.test(q); // did they type in Devanagari?
  const starts = [], contains = [];
  for (const a of AREAS) {
    const en = a.en.toLowerCase();
    const ne = a.ne; // Devanagari unaffected by toLowerCase
    if (en.startsWith(q) || ne.startsWith(q)) starts.push(a);
    else if (en.includes(q) || ne.includes(q)) contains.push(a);
  }
  const matches = starts.concat(contains).slice(0, 8);
  acMatches[which] = matches;
  if (!matches.length) { hideAreaAC(which); return; }
  // Show the name in the script they're typing (Nepali query or Nepali UI → Nepali label)
  const showNe = isNepali || lang === "ne";
  box.innerHTML = matches.map((a, i) => {
    const label = showNe ? a.ne : a.en;
    const idx = label.toLowerCase().indexOf(q);
    const html = idx < 0 ? label
      : label.slice(0, idx) + "<b>" + label.slice(idx, idx + q.length) + "</b>" + label.slice(idx + q.length);
    return `<div class="suggest-item" role="option" data-i="${i}" onmousedown="pickAreaAC('${which}',${i})">📍 ${html}</div>`;
  }).join("");
  box.classList.add("open");
}

// Choose a suggestion (onmousedown fires before the input's blur).
function pickAreaAC(which, i) {
  const cfg = AREA_AC[which];
  const a = acMatches[which][i];
  if (a == null) return;
  // Always store the English name — listings save their area in English,
  // so this keeps search filters and saved listings consistent.
  document.getElementById(cfg.input).value = a.en;
  hideAreaAC(which);
  if (cfg.filter) applyFilters();
}

function hideAreaAC(which) {
  const box = document.getElementById(AREA_AC[which].box);
  if (box) { box.classList.remove("open"); box.innerHTML = ""; }
  acActive[which] = -1;
}

// Arrow-key / Enter / Escape navigation for the dropdown.
function areaACKeydown(which, e) {
  const box = document.getElementById(AREA_AC[which].box);
  if (!box || !box.classList.contains("open")) return;
  const items = [...box.querySelectorAll(".suggest-item")];
  if (e.key === "ArrowDown") {
    e.preventDefault();
    acActive[which] = Math.min(acActive[which] + 1, items.length - 1);
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    acActive[which] = Math.max(acActive[which] - 1, 0);
  } else if (e.key === "Enter") {
    if (acActive[which] >= 0) { e.preventDefault(); pickAreaAC(which, acActive[which]); }
    return;
  } else if (e.key === "Escape") {
    hideAreaAC(which);
    return;
  } else {
    return;
  }
  items.forEach((el, i) => el.classList.toggle("active", i === acActive[which]));
  if (items[acActive[which]]) items[acActive[which]].scrollIntoView({ block: "nearest" });
}

// Back-compat wrappers for the search box's inline handlers.
function areaInput() { areaACInput("search"); }
function pickArea(i) { pickAreaAC("search", i); }
function hideAreaSuggest() { hideAreaAC("search"); }
function areaKeydown(e) { areaACKeydown("search", e); }

let view = "list";
let map = null;
let markers = [];

function setView(v) {
  view = v;
  document.getElementById("vt-list").classList.toggle("active", v === "list");
  document.getElementById("vt-map").classList.toggle("active", v === "map");
  document.getElementById("vt-saved").classList.toggle("active", v === "saved");
  document.getElementById("grid").style.display = v === "map" ? "none" : "";
  document.getElementById("map").style.display = v === "map" ? "" : "none";
  applyFilters();
}

// Fix Leaflet's default marker icons not loading from the CDN
function fixLeafletIcons() {
  if (!window.L || L.__iconsFixed) return;
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
  L.__iconsFixed = true;
}

function renderMap(list) {
  if (!window.L) return;
  fixLeafletIcons();
  if (!map) {
    map = L.map("map").setView(KTM_CENTER, 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap",
    }).addTo(map);
  }

  markers.forEach((m) => map.removeLayer(m));
  markers = [];
  const bounds = [];
  list.forEach((l, i) => {
    let c = coordsOf(l);
    if (!c) {
      // unknown location → scatter gently around the city centre
      c = [KTM_CENTER[0] + (i % 5) * 0.004, KTM_CENTER[1] + (i % 7) * 0.004];
    }
    const photo = photosOf(l)[0];
    const popup = `<div class="map-pop">
      <img src="${photo}" onerror="this.src='${FALLBACK_IMG}'" />
      <div class="t">${l.title}</div>
      <div class="p">${npr(l.price)}/mo</div>
      <button onclick="openDetail('${l.id}')">View details</button>
    </div>`;
    const m = L.marker(c).addTo(map).bindPopup(popup);
    markers.push(m);
    bounds.push(c);
  });

  // The container is often hidden when this runs, so size is wrong until we
  // refresh — fit the view AFTER invalidating size.
  setTimeout(() => {
    map.invalidateSize();
    if (bounds.length) map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    else map.setView(KTM_CENTER, 12);
  }, 80);
}

// ---------- Filters ----------
let lastFiltered = [];
let fParking = false;
let fNegotiable = false;

function toggleFilterBtn(which) {
  if (which === "parking") {
    fParking = !fParking;
    document.getElementById("f-parking").classList.toggle("active", fParking);
  } else if (which === "negotiable") {
    fNegotiable = !fNegotiable;
    document.getElementById("f-negotiable").classList.toggle("active", fNegotiable);
  }
  applyFilters();
}

function clearFilters() {
  document.getElementById("f-sort").value = "newest";
  document.getElementById("f-area").value = "";
  document.getElementById("f-type").value = "";
  document.getElementById("f-price").value = "";
  document.getElementById("f-beds").value = "";
  document.getElementById("f-furnished").value = "";
  fParking = false;
  fNegotiable = false;
  document.getElementById("f-parking").classList.remove("active");
  document.getElementById("f-negotiable").classList.remove("active");
  applyFilters();
}

function applyFilters() {
  const area = document.getElementById("f-area").value.trim().toLowerCase();
  const type = document.getElementById("f-type").value;
  const maxPrice = Number(document.getElementById("f-price").value) || Infinity;
  const minBeds = Number(document.getElementById("f-beds").value) || 0;
  const furnished = document.getElementById("f-furnished").value;
  activeChip = type;
  renderChips();

  const filtered = allListings.filter((l) => {
    const matchArea =
      !area ||
      l.area.toLowerCase().includes(area) ||
      (l.city || "").toLowerCase().includes(area);
    const matchType = !type || l.type === type;
    const matchPrice = l.price <= maxPrice;
    const matchBeds = (l.bedrooms || 0) >= minBeds;
    const matchFurnished = !furnished || l.furnished === furnished;
    const matchParking = !fParking || !!l.parking;
    const matchNego = !fNegotiable || !!l.negotiable;
    return matchArea && matchType && matchPrice && matchBeds && matchFurnished && matchParking && matchNego;
  });

  // Sort the results
  const sort = document.getElementById("f-sort").value;
  if (sort === "price_low") filtered.sort((a, b) => a.price - b.price);
  else if (sort === "price_high") filtered.sort((a, b) => b.price - a.price);
  else filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  lastFiltered = filtered;

  if (view === "map") {
    renderGrid(filtered); // keep grid populated for when they switch back
    renderMap(filtered);
  } else if (view === "saved") {
    const favs = getFavs();
    const saved = filtered.filter((l) => favs.includes(String(l.id)));
    if (!saved.length) {
      document.getElementById("count").textContent = "0";
      document.getElementById("grid").innerHTML = `<div class="empty" style="grid-column:1/-1">
        <div class="big">🤍</div>
        <p>${tt("saved_empty")}</p>
      </div>`;
    } else {
      renderGrid(saved);
    }
  } else {
    renderGrid(filtered);
  }
  updateSavedCount();
}

// ---------- Detail modal ----------
function openDetail(id) {
  const l = allListings.find((x) => String(x.id) === String(id));
  if (!l) return;
  // Build the media list: video first (if any), then photos
  let photos = l.images && l.images.length ? l.images : l.image ? [l.image] : [];
  if (!photos.length && !l.video) photos = [FALLBACK_IMG];
  const media = [];
  if (l.video) {
    media.push(
      `<div class="slide"><video src="${l.video}" controls playsinline preload="metadata"></video></div>`
    );
  }
  photos.forEach((src) => {
    media.push(
      `<div class="slide"><img src="${src}" alt="${l.title}" onerror="this.src='${FALLBACK_IMG}'" /></div>`
    );
  });
  const slides = media.join("");
  const mediaCount = media.length;
  const dots =
    mediaCount > 1
      ? `<div class="gallery-dots">${media
          .map((_, i) => `<span class="${i === 0 ? "on" : ""}" onclick="gallerySlideTo(${i})"></span>`)
          .join("")}</div>`
      : "";
  const arrows =
    mediaCount > 1
      ? `<button class="gal-arrow prev" onclick="galleryNav(-1)" aria-label="Previous">‹</button>
         <button class="gal-arrow next" onclick="galleryNav(1)" aria-label="Next">›</button>
         <div class="gal-counter"><span id="gal-now">1</span>/${mediaCount}</div>`
      : "";
  const waNum = String(l.phone).replace(/\D/g, "");
  const waFull = waNum.length === 10 ? "977" + waNum : waNum;
  const telNum = "+" + waFull;
  const phoneDisplay = waNum.length === 10 ? waNum : telNum;
  const msg = encodeURIComponent(
    `Hi ${l.owner}, I saw your "${l.title}" (${npr(l.price)}/month) on Kotha Bhada. Is it still available?`
  );
  document.getElementById("detail-content").innerHTML = `
    <div class="photo-lg">
      <div class="gallery" id="gallery">${slides}</div>
      ${arrows}
      ${dots}
      ${heartHTML(l, true)}
      <button class="close" onclick="closeModals()">✕</button>
    </div>
    <div class="modal-body">
      <h2>${l.title}</h2>
      <div class="card-loc">📍 ${l.area}, ${l.city}</div>
      <div class="spec-grid">
        <div class="spec"><div class="k">${tt("rent")}</div><div class="v">${npr(l.price)}${tt("permonth")}${
          l.negotiable ? `<span class="nego-tag">${tt("negotiabletag")}</span>` : ""
        }</div></div>
        <div class="spec"><div class="k">${tt("typew")}</div><div class="v">${l.type}</div></div>
        <div class="spec"><div class="k">${tt("bedrooms")}</div><div class="v">${l.bedrooms || "—"}</div></div>
        <div class="spec"><div class="k">${tt("bathrooms")}</div><div class="v">${l.bathrooms || "—"}</div></div>
        <div class="spec"><div class="k">${tt("furnishing")}</div><div class="v">${l.furnished || "—"}</div></div>
        <div class="spec"><div class="k">${tt("parkingspec")}</div><div class="v">${l.parking ? tt("yes") : tt("no")}</div></div>
      </div>
      <p>${l.description || ""}</p>
      <div class="owner-line">${tt("postedby")} <strong>${l.owner}</strong>${
        l.verified ? ` <span class="verified">✓ ${tt("verified_owner")}</span>` : ""
      }</div>
      <div class="listing-stats">${l.createdAt ? timeAgo(l.createdAt) : ""}${
        typeof l.views === "number" ? `${l.createdAt ? " · " : ""}👁 ${l.views} ${tt("views")}` : ""
      }</div>
      <div class="contact-row">
        <a class="contact-btn wa" href="https://wa.me/${waFull}?text=${msg}" target="_blank">💬 WhatsApp</a>
        <a class="contact-btn call" href="tel:${telNum}">📞 ${tt("call")} ${phoneDisplay}</a>
      </div>
      <button class="share-btn" onclick="openShare('${l.id}')">📤 ${tt("share")}</button>
    </div>`;
  document.getElementById("detail-modal").classList.add("open");
  document.body.style.overflow = "hidden";

  // Count this view (fire-and-forget; safe via the increment_views function)
  if (sb && l.id) {
    sb.rpc("increment_views", { listing_id: l.id }).then(({ error }) => {
      if (!error && typeof l.views === "number") l.views += 1;
    });
  }

  // Keep the gallery dots + counter in sync as the user swipes/clicks
  if (mediaCount > 1) {
    const g = document.getElementById("gallery");
    const dotEls = document.querySelectorAll(".gallery-dots span");
    const now = document.getElementById("gal-now");
    g.addEventListener("scroll", () => {
      const i = Math.round(g.scrollLeft / g.clientWidth);
      dotEls.forEach((d, idx) => d.classList.toggle("on", idx === i));
      if (now) now.textContent = i + 1;
    });
  }
}

// Move the open gallery one photo left (-1) or right (+1), looping around
function galleryNav(dir) {
  const g = document.getElementById("gallery");
  if (!g) return;
  const n = g.querySelectorAll(".slide").length;
  let i = Math.round(g.scrollLeft / g.clientWidth);
  i = (i + dir + n) % n;
  g.scrollTo({ left: i * g.clientWidth, behavior: "smooth" });
}
// Jump straight to a photo by index (used by the dots)
function gallerySlideTo(i) {
  const g = document.getElementById("gallery");
  if (!g) return;
  g.scrollTo({ left: i * g.clientWidth, behavior: "smooth" });
}

// ----- Share a listing -----
let currentShare = null; // { url, text }
function shareLinkFor(id) {
  return `${location.origin}${location.pathname}?listing=${id}`;
}
function openShare(id) {
  const l = allListings.find((x) => String(x.id) === String(id));
  if (!l) return;
  const url = shareLinkFor(id);
  const text =
    lang === "ne"
      ? `${l.title} — ${npr(l.price)}/महिना, ${l.area}, काठमाडौं। Kotha Bhada मा हेर्नुहोस्:`
      : `${l.title} — ${npr(l.price)}/month in ${l.area}, Kathmandu. See it on Kotha Bhada:`;
  currentShare = { url, text };
  // Native "More…" only where the device supports it
  document.getElementById("share-native").style.display = navigator.share ? "" : "none";
  document.getElementById("share-modal").classList.add("open");
  document.body.style.overflow = "hidden";
}
function shareWhatsApp() {
  if (!currentShare) return;
  window.open(
    "https://wa.me/?text=" + encodeURIComponent(currentShare.text + " " + currentShare.url),
    "_blank"
  );
}
async function shareCopy() {
  if (!currentShare) return;
  try {
    await navigator.clipboard.writeText(currentShare.url);
    showToast(tt("link_copied"));
  } catch (e) {
    // Fallback for older browsers
    const t = document.createElement("textarea");
    t.value = currentShare.url;
    document.body.appendChild(t);
    t.select();
    document.execCommand("copy");
    t.remove();
    showToast(tt("link_copied"));
  }
}
async function shareNative() {
  if (!currentShare || !navigator.share) return;
  try {
    await navigator.share({ title: "Kotha Bhada", text: currentShare.text, url: currentShare.url });
    closeModals();
  } catch (e) {
    /* user cancelled — ignore */
  }
}

// Open a specific listing if the page was opened via a share link (?listing=ID)
let deepLinkHandled = false;
function handleDeepLink() {
  if (deepLinkHandled) return;
  const id = new URLSearchParams(location.search).get("listing");
  if (id && allListings.some((l) => String(l.id) === String(id))) {
    deepLinkHandled = true;
    openDetail(id);
  }
}

// ---------- Post form ----------
function openPostForm() {
  // Posting requires an account (so owners can manage their listings)
  if (sb && !currentUser) {
    showToast("🔐 Please log in to post a house.");
    openAuth();
    return;
  }
  editingId = null;
  selectedFiles = [];
  selectedVideo = null;
  const form = document.getElementById("post-form");
  form.reset();
  document.getElementById("photo-preview").innerHTML = "";
  document.getElementById("video-preview").innerHTML = "";
  document.getElementById("post-title").textContent = tt("post_title_new");
  document.getElementById("post-sub").textContent = tt("post_sub_new");
  document.getElementById("post-submit").textContent = tt("post_btn_new");
  document.getElementById("post-modal").classList.add("open");
  document.body.style.overflow = "hidden";
}

// Open the post form pre-filled to EDIT an existing listing
function editListing(id) {
  const l = allListings.find((x) => String(x.id) === String(id));
  if (!l) return;
  editingId = id;
  selectedFiles = [];
  selectedVideo = null;
  const form = document.getElementById("post-form");
  form.title.value = l.title || "";
  form.type.value = l.type || "";
  form.area.value = l.area || "";
  form.price.value = l.price || "";
  form.bedrooms.value = l.bedrooms || "";
  form.bathrooms.value = l.bathrooms || "";
  form.furnished.value = l.furnished || "Unfurnished";
  form.parking.checked = !!l.parking;
  form.negotiable.checked = !!l.negotiable;
  form.description.value = l.description || "";
  form.owner.value = l.owner || "";
  form.phone.value = l.phone || "";
  document.getElementById("photo-preview").innerHTML = (l.images || [])
    .map((src) => `<div class="thumb"><img src="${src}" /></div>`)
    .join("");
  document.getElementById("video-preview").innerHTML = l.video
    ? `<video src="${l.video}" controls playsinline></video><div class="vname">🎥 ${
        lang === "ne" ? "हालको भिडियो (बदल्न नयाँ फाइल छान्नुहोस्)" : "Current video (choose a file to replace)"
      }</div>`
    : "";
  document.getElementById("post-title").textContent = tt("post_title_edit");
  document.getElementById("post-sub").textContent = tt("post_sub_edit");
  document.getElementById("post-submit").textContent = tt("post_btn_edit");
  closeModals();
  document.getElementById("post-modal").classList.add("open");
  document.body.style.overflow = "hidden";
}

// ----- My listings -----
function openMyListings() {
  const mine = allListings.filter((l) => currentUser && l.userId === currentUser.id);
  document.getElementById("mylistings-email").textContent = currentUser
    ? tt("loggedinas") + " " + currentUser.email
    : "";
  const box = document.getElementById("mylistings-list");
  if (!mine.length) {
    box.innerHTML = `<div class="ml-empty">${
      lang === "ne"
        ? "तपाईंले अहिलेसम्म कुनै घर हालेको छैन।<br/>“+ हाल्नुहोस्” थिचेर पहिलो घर थप्नुहोस्।"
        : "You haven't posted any houses yet.<br/>Tap “+ Post” to add your first one."
    }</div>`;
  } else {
    box.innerHTML = mine
      .map((l) => {
        const img = photosOf(l)[0];
        return `<div class="ml-row">
          <img src="${img}" onerror="this.src='${FALLBACK_IMG}'" />
          <div class="ml-info">
            <div class="t">${l.title}</div>
            <div class="s">${l.area} · ${npr(l.price)}/mo</div>
          </div>
          <div class="ml-actions">
            <button class="btn ghost sm" onclick="editListing('${l.id}')">${tt("edit")}</button>
            <button class="btn danger sm" onclick="deleteListing('${l.id}')">${tt("del")}</button>
          </div>
        </div>`;
      })
      .join("");
  }
  document.getElementById("mylistings-modal").classList.add("open");
  document.body.style.overflow = "hidden";
}

async function deleteListing(id) {
  if (!confirm("Delete this listing? This cannot be undone.")) return;
  if (sb) {
    const { error } = await sb.from("listings").delete().eq("id", id);
    if (error) { showToast("⚠️ " + error.message); return; }
  }
  showToast("🗑️ Listing deleted.");
  await refresh();
  openMyListings();
}

// Limit to 5 and show thumbnails before posting
let selectedFiles = [];
function previewPhotos(e) {
  selectedFiles = Array.from(e.target.files).slice(0, 5);
  const box = document.getElementById("photo-preview");
  box.innerHTML = selectedFiles
    .map((file, i) => {
      const url = URL.createObjectURL(file);
      return `<div class="thumb"><img src="${url}" />${
        i === 0 ? '<span class="cover-tag">COVER</span>' : ""
      }</div>`;
    })
    .join("");
}

// ----- Video (one optional walkthrough per listing) -----
let selectedVideo = null;
function previewVideo(e) {
  const file = e.target.files[0];
  const box = document.getElementById("video-preview");
  if (!file) {
    selectedVideo = null;
    box.innerHTML = "";
    return;
  }
  // Soft size warning (~50 MB)
  if (file.size > 50 * 1024 * 1024) {
    showToast("⚠️ Video is large (over 50 MB) — upload may be slow or fail.");
  }
  selectedVideo = file;
  const url = URL.createObjectURL(file);
  box.innerHTML = `<video src="${url}" controls playsinline></video>
    <div class="vname">🎥 ${file.name}</div>`;
}

// Upload the chosen video to Supabase Storage, return its public URL
async function uploadVideo() {
  if (!sb || !selectedVideo) return "";
  const ext = (selectedVideo.name.split(".").pop() || "mp4").toLowerCase();
  const path = `videos/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await sb.storage
    .from("listing-photos")
    .upload(path, selectedVideo, { cacheControl: "3600", upsert: false });
  if (error) {
    console.warn("Video upload failed:", error.message);
    showToast("⚠️ Video couldn't upload: " + error.message);
    return "";
  }
  const { data } = sb.storage.from("listing-photos").getPublicUrl(path);
  return data?.publicUrl || "";
}

// Upload chosen files to Supabase Storage, return public URLs
async function uploadPhotos() {
  if (!sb || !selectedFiles.length) return [];
  const urls = [];
  for (const file of selectedFiles) {
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await sb.storage
      .from("listing-photos")
      .upload(path, file, { cacheControl: "3600", upsert: false });
    if (error) {
      console.warn("Photo upload failed:", error.message);
      continue;
    }
    const { data } = sb.storage.from("listing-photos").getPublicUrl(path);
    if (data?.publicUrl) urls.push(data.publicUrl);
  }
  return urls;
}

async function submitListing(e) {
  e.preventDefault();
  const fd = new FormData(e.target);
  const btn = e.target.querySelector('button[type="submit"]');
  btn.disabled = true;

  // When editing, keep the photos the listing already has
  const existing = editingId ? allListings.find((x) => String(x.id) === String(editingId)) : null;
  const keptImages = existing ? existing.images || [] : [];

  // 1) Upload any newly chosen photos
  btn.textContent = selectedFiles.length ? tt("uploading") : tt("saving");
  let uploaded = [];
  if (selectedFiles.length) {
    uploaded = await uploadPhotos();
    if (sb && !uploaded.length) {
      showToast("⚠️ Photos couldn't upload — check the storage bucket.");
    }
  }
  const imageUrls = [...keptImages, ...uploaded];

  // Video: keep the existing one unless a new file was chosen
  const keptVideo = existing ? existing.video || "" : "";
  let videoUrl = keptVideo;
  if (selectedVideo) {
    btn.textContent = tt("uploading");
    videoUrl = (await uploadVideo()) || keptVideo;
  }

  // 2) Build the listing
  const row = {
    title: fd.get("title"),
    type: fd.get("type"),
    area: fd.get("area"),
    city: "Kathmandu",
    price: Number(fd.get("price")),
    bedrooms: Number(fd.get("bedrooms")) || 0,
    bathrooms: Number(fd.get("bathrooms")) || 0,
    parking: fd.get("parking") === "on",
    negotiable: fd.get("negotiable") === "on",
    furnished: fd.get("furnished"),
    for_who: "Anyone",
    description: fd.get("description"),
    owner: fd.get("owner"),
    phone: fd.get("phone"),
    images: imageUrls,
    image: imageUrls[0] || "",
    video: videoUrl,
  };
  if (currentUser) row.user_id = currentUser.id;

  btn.textContent = editingId ? tt("saving") : tt("posting");

  if (sb) {
    let error;
    if (editingId) {
      ({ error } = await sb.from("listings").update(row).eq("id", editingId));
    } else {
      ({ error } = await sb.from("listings").insert(row));
    }
    if (error) {
      showToast("⚠️ Could not save: " + error.message);
      btn.disabled = false;
      btn.textContent = editingId ? tt("post_btn_edit") : tt("post_btn_new");
      return;
    }
  } else {
    // No database yet → save in this browser only (photos as temporary previews)
    const localImages = selectedFiles.map((f) => URL.createObjectURL(f));
    const local = {
      ...row,
      images: localImages,
      image: localImages[0] || "",
      id: "own_" + Date.now(),
      forWho: "Anyone",
    };
    let saved = [];
    try { saved = JSON.parse(localStorage.getItem(STORE_KEY)) || []; } catch (e) {}
    saved.unshift(local);
    localStorage.setItem(STORE_KEY, JSON.stringify(saved));
  }

  const wasEditing = !!editingId;
  e.target.reset();
  selectedFiles = [];
  selectedVideo = null;
  editingId = null;
  document.getElementById("photo-preview").innerHTML = "";
  document.getElementById("video-preview").innerHTML = "";
  btn.disabled = false;
  btn.textContent = tt("post_btn_new");
  closeModals();
  if (wasEditing) {
    showToast("✅ Changes saved!");
  } else {
    showToast(sb ? "✅ Posted! Everyone can see it now." : "✅ Posted (saved on this device).");
  }
  await refresh();
  goHome();
}

// ---------- Helpers ----------
function closeModals() {
  document.querySelectorAll(".modal-backdrop").forEach((m) => m.classList.remove("open"));
  document.body.style.overflow = "";
}

function goHome() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

let toastTimer;
function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2800);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModals();
});

// ---------- Init ----------
async function refresh() {
  allListings = await fetchListings();
  applyFilters();
  handleDeepLink();
}

cacheEnglishDefaults(); // remember English originals
applyLang(); // apply saved language (also renders chips + role chip)
renderSkeletons(6); // shimmer while data loads
refresh();
initAuth();
if (!getRole()) openWelcome(); // first visit → ask renter or owner
