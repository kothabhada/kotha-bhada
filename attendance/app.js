// ============================================================
// World Trading Pvt. Ltd. — Attendance
// Manager dashboard: mark everyone Present / Absent / On Leave.
// Auto-timestamps Check In / Check Out. Late = check-in after 10:00.
// Online (Supabase) with an automatic local fallback so it always
// works even before the SQL has been run.
// ============================================================

const SEED_STAFF = [
  "Suhana Basnet", "Narayan Acharya", "Rupali Magar", "Bina Limbu",
  "Lalit Bastola", "Raj Limbu", "Pabitra Shrestha", "Laxmi Parajuli",
];

let sb = null;
let MODE = "local"; // 'cloud' | 'local' — decided at startup
let STAFF = [];     // [{id, name}]

// ---------- date / time helpers ----------
const pad = (n) => String(n).padStart(2, "0");
function ymd(d) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }
function todayStr() { return ymd(new Date()); }

function fmtTime(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  let h = d.getHours(), m = d.getMinutes();
  const ap = h >= 12 ? "PM" : "AM";
  h = h % 12; if (h === 0) h = 12;
  return `${h}:${pad(m)} ${ap}`;
}
function isLate(iso) {
  if (!iso) return false;
  const d = new Date(iso);
  const [sh, sm] = OFFICE_START.split(":").map(Number);
  return d.getHours() * 60 + d.getMinutes() > sh * 60 + sm;
}

// ---------- hours & pay ----------
const STD_HOURS = (function () {
  const [a, b] = OFFICE_START.split(":").map(Number);
  const [c, d] = OFFICE_END.split(":").map(Number);
  return ((c * 60 + d) - (a * 60 + b)) / 60; // 10:00–18:00 = 8h
})();
function workedHours(rec) {
  if (rec && rec.status === "present" && rec.check_in && rec.check_out) {
    const h = (new Date(rec.check_out) - new Date(rec.check_in)) / 3600000;
    return h > 0 ? h : 0;
  }
  return 0;
}
function overtimeHours(rec) { return Math.max(0, workedHours(rec) - STD_HOURS); }
function fmtHours(h) { const m = Math.round((h || 0) * 60); return `${Math.floor(m / 60)}h ${m % 60}m`; }
// working days (excluding the weekly day off) still ahead this month, for the salary projection
function remainingWorkingDays(year, month /* 1-12 */) {
  const off = (typeof WEEKLY_OFF === "number") ? WEEKLY_OFF : 6;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const days = new Date(year, month, 0).getDate();
  let n = 0;
  for (let d = 1; d <= days; d++) {
    const dt = new Date(year, month - 1, d);
    if (dt > today && dt.getDay() !== off) n++;
  }
  return n;
}
function rs(n) { return "Rs " + Math.round(n || 0).toLocaleString("en-IN"); }
function initials(name) {
  const p = name.trim().split(/\s+/);
  return ((p[0]?.[0] || "") + (p[1]?.[0] || "")).toUpperCase();
}

// ---------- Bikram Sambat (Nepali) date ----------
// Days in each B.S. month (Baishakh..Chaitra). Anchor: 2081-01-01 = 2024-04-13 AD.
const NP_MONTHS = {
  2078: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  2079: [31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30],
  2080: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  2081: [31, 32, 31, 32, 31, 31, 30, 30, 29, 29, 30, 30],
  2082: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  2083: [31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30],
  2084: [31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30],
  2085: [31, 32, 31, 31, 32, 30, 31, 29, 30, 29, 30, 30],
  2086: [31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30],
  2087: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
};
const NP_ANCHOR = { bsYear: 2081, adUTC: Date.UTC(2024, 3, 13) }; // April 13, 2024
const NP_MONTH_NAMES = ["बैशाख", "जेठ", "असार", "साउन", "भदौ", "असोज", "कात्तिक", "मंसिर", "पुष", "माघ", "फागुन", "चैत"];
const NP_DAY_NAMES = ["आइतबार", "सोमबार", "मंगलबार", "बुधबार", "बिहीबार", "शुक्रबार", "शनिबार"];
const NP_DIGITS = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
function npNum(n) { return String(n).split("").map((c) => (/\d/.test(c) ? NP_DIGITS[+c] : c)).join(""); }

function adToBs(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  const targetUTC = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
  let diff = Math.round((targetUTC - NP_ANCHOR.adUTC) / 86400000) + (typeof BS_OFFSET === "number" ? BS_OFFSET : 0);
  let y = NP_ANCHOR.bsYear, m = 1;
  if (diff >= 0) {
    while (true) {
      const months = NP_MONTHS[y]; if (!months) return null;
      if (diff < months[m - 1]) break;
      diff -= months[m - 1]; m++; if (m > 12) { m = 1; y++; }
    }
  } else {
    while (diff < 0) {
      m--; if (m < 1) { m = 12; y--; }
      const months = NP_MONTHS[y]; if (!months) return null;
      diff += months[m - 1];
    }
  }
  return { year: y, month: m, day: diff + 1, weekday: d.getDay() };
}
function npDateText(dateStr) {
  const b = adToBs(dateStr);
  if (!b) return "";
  return `${NP_MONTH_NAMES[b.month - 1]} ${npNum(b.day)}, ${npNum(b.year)} · ${NP_DAY_NAMES[b.weekday]}`;
}

// ---------- toast ----------
let toastTimer;
function toast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg; el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
}

// ============================================================
// DATA LAYER — branches on MODE
// ============================================================

// localStorage shape: { "YYYY-MM-DD": { "<staffId>": {status,check_in,check_out,late} } }
const LS_KEY = "wt_attendance";
function lsAll() { try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch { return {}; } }
function lsSave(o) { localStorage.setItem(LS_KEY, JSON.stringify(o)); }

async function boot() {
  if (typeof supabase !== "undefined" && SUPABASE_READY) {
    sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    try {
      const { data, error } = await sb.from("staff").select("id,name,department,hourly_rate").eq("active", true).order("sort_order");
      if (error) throw error;
      if (data && data.length) {
        MODE = "cloud";
        STAFF = data.map((s) => ({ ...s, department: s.department || "", rate: Number(s.hourly_rate) || 0 }));
        return;
      }
    } catch (e) {
      console.warn("Supabase unavailable, using local mode:", e.message);
    }
  }
  // local fallback
  MODE = "local";
  const meta = lsMeta();
  STAFF = SEED_STAFF.map((name, i) => ({
    id: i + 1, name,
    department: (meta[i + 1] && meta[i + 1].department) || "",
    rate: (meta[i + 1] && meta[i + 1].rate) || 0,
  }));
}

// staff metadata (department) for local mode
const META_KEY = "wt_staff_meta";
function lsMeta() { try { return JSON.parse(localStorage.getItem(META_KEY)) || {}; } catch { return {}; } }
function lsMetaSave(o) { localStorage.setItem(META_KEY, JSON.stringify(o)); }

async function setDepartment(staffId, dept) {
  if (MODE === "cloud") {
    const { error } = await sb.from("staff").update({ department: dept }).eq("id", staffId);
    if (error) { toast("Save error: " + error.message); return; }
  } else {
    const m = lsMeta();
    m[staffId] = { ...(m[staffId] || {}), department: dept };
    lsMetaSave(m);
  }
  const s = STAFF.find((x) => x.id === staffId);
  if (s) s.department = dept;
  renderDay();
}

async function setRate(staffId, rate) {
  rate = Number(rate) || 0;
  if (MODE === "cloud") {
    const { error } = await sb.from("staff").update({ hourly_rate: rate }).eq("id", staffId);
    if (error) { toast("Save error: " + error.message); return; }
  } else {
    const m = lsMeta();
    m[staffId] = { ...(m[staffId] || {}), rate };
    lsMetaSave(m);
  }
  const s = STAFF.find((x) => x.id === staffId);
  if (s) s.rate = rate;
  renderDay();
}

// HH:MM (local) <-> ISO for the given day
function isoToHM(iso) { if (!iso) return ""; const d = new Date(iso); return `${pad(d.getHours())}:${pad(d.getMinutes())}`; }
async function setTimeField(staffId, field, hm) {
  const patch = {};
  patch[field] = hm ? new Date(`${curDate}T${hm}:00`).toISOString() : null;
  if (field === "check_in") {
    patch.status = "present";
    patch.late = hm ? isLate(patch.check_in) : false;
  }
  await saveRecord(staffId, curDate, patch);
  renderDay();
}

// returns { [staffId]: record }
async function loadDay(dateStr) {
  if (MODE === "cloud") {
    const { data, error } = await sb.from("attendance").select("*").eq("work_date", dateStr);
    if (error) { toast("Load error: " + error.message); return {}; }
    const map = {};
    (data || []).forEach((r) => (map[r.staff_id] = r));
    return map;
  }
  return lsAll()[dateStr] || {};
}

async function saveRecord(staffId, dateStr, patch) {
  if (MODE === "cloud") {
    const row = { staff_id: staffId, work_date: dateStr, updated_at: new Date().toISOString(), ...patch };
    const { error } = await sb.from("attendance").upsert(row, { onConflict: "staff_id,work_date" });
    if (error) { toast("Save error: " + error.message); throw error; }
  } else {
    const all = lsAll();
    all[dateStr] = all[dateStr] || {};
    all[dateStr][staffId] = { ...(all[dateStr][staffId] || {}), staff_id: staffId, work_date: dateStr, ...patch };
    lsSave(all);
  }
}

async function loadMonth(year, month /* 1-12 */) {
  const first = `${year}-${pad(month)}-01`;
  const last = `${year}-${pad(month)}-${pad(new Date(year, month, 0).getDate())}`;
  if (MODE === "cloud") {
    const { data, error } = await sb.from("attendance").select("*").gte("work_date", first).lte("work_date", last);
    if (error) { toast("Load error: " + error.message); return []; }
    return data || [];
  }
  const all = lsAll(); const rows = [];
  Object.keys(all).forEach((dateStr) => {
    if (dateStr >= first && dateStr <= last) {
      Object.values(all[dateStr]).forEach((r) => rows.push(r));
    }
  });
  return rows;
}

// ============================================================
// DAILY VIEW
// ============================================================
let curDate = todayStr();
let dayData = {};

async function renderDay() {
  const list = document.getElementById("staffList");
  list.innerHTML = '<div class="loading">Loading…</div>';
  dayData = await loadDay(curDate);

  list.innerHTML = "";
  STAFF.forEach((s) => list.appendChild(staffCard(s, dayData[s.id] || {})));
  renderSummary();
  const np = document.getElementById("npDate");
  if (np) np.textContent = npDateText(curDate);
}

function statusBadge(rec) {
  if (rec.status === "absent") return '<span class="badge badge-absent">Absent</span>';
  if (rec.status === "leave") return '<span class="badge badge-leave">On Leave</span>';
  if (rec.status === "present") {
    let b = '<span class="badge badge-present">Present</span>';
    if (rec.late || isLate(rec.check_in)) b += ' <span class="badge badge-late">Late</span>';
    return b;
  }
  return '<span class="badge badge-leave" style="opacity:.6">Not marked</span>';
}

function staffCard(staff, rec) {
  const card = document.createElement("div");
  card.className = "staff-card";

  const dept = staff.department || "";
  const deptHtml = `<button class="dept${dept ? "" : " dept-empty"}" data-dept>${dept || "+ department"}</button>`;
  const rate = staff.rate || 0;
  const rateHtml = `<button class="rate${rate ? "" : " dept-empty"}" data-rate>${rate ? "Rs " + rate + "/hr" : "+ rate"}</button>`;

  // times are editable when Present or not-marked (so you can type them in manually)
  const showTimes = !rec.status || rec.status === "present";
  const timesHtml = showTimes
    ? `<div class="staff-times">
         <span>In: <button class="t-edit" data-field="check_in">${fmtTime(rec.check_in)}</button></span>
         <span class="t-out">Out: <button class="t-edit" data-field="check_out">${fmtTime(rec.check_out)}</button></span>
       </div>`
    : "";

  const w = workedHours(rec);
  const ot = overtimeHours(rec);
  // Daily shows worked hours only; salary lives on the Monthly report.
  const workedHtml = w > 0
    ? `<div class="worked">Worked: <b>${fmtHours(w)}</b>${ot > 0 ? ` · OT <b>${fmtHours(ot)}</b>` : ""}</div>`
    : "";

  card.innerHTML = `
    <div class="staff-main">
      <div class="avatar">${initials(staff.name)}</div>
      <div>
        <div class="staff-name">${staff.name}</div>
        <div class="dept-row">${deptHtml} ${rateHtml}</div>
        <div class="badges">${statusBadge(rec)}</div>
        ${timesHtml}
        ${workedHtml}
      </div>
    </div>
    <div class="actions"></div>`;

  attachDept(card, staff);
  attachRate(card, staff);
  if (showTimes) attachTimes(card, staff, rec);

  const actions = card.querySelector(".actions");

  if (rec.status === "present") {
    if (!rec.check_out) {
      actions.appendChild(btn("Check Out", "btn btn-out", () => doCheckOut(staff.id)));
    } else {
      actions.appendChild(btn("✓ Done", "btn", null, true));
    }
    actions.appendChild(btn("Reset", "btn btn-link", () => doReset(staff.id)));
  } else {
    actions.appendChild(btn("Check In", "btn btn-in", () => doCheckIn(staff.id)));
    actions.appendChild(btn("Absent", "btn small btn-absent" + (rec.status === "absent" ? " is-active" : ""), () => doStatus(staff.id, "absent")));
    actions.appendChild(btn("On Leave", "btn small btn-leave" + (rec.status === "leave" ? " is-active" : ""), () => doStatus(staff.id, "leave")));
    if (rec.status === "absent" || rec.status === "leave") {
      actions.appendChild(btn("Reset", "btn btn-link", () => doReset(staff.id)));
    }
  }
  return card;
}

function btn(label, cls, onClick, disabled) {
  const b = document.createElement("button");
  b.className = cls; b.textContent = label;
  if (disabled) b.disabled = true;
  if (onClick) b.addEventListener("click", onClick);
  return b;
}

// click the department chip -> type it in
function attachDept(card, staff) {
  const el = card.querySelector("[data-dept]");
  el.addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "text"; input.className = "dept-input";
    input.value = staff.department || ""; input.placeholder = "Department";
    el.replaceWith(input); input.focus();
    let done = false;
    const save = () => { if (done) return; done = true; setDepartment(staff.id, input.value.trim()); };
    input.addEventListener("blur", save);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") input.blur();
      if (e.key === "Escape") { done = true; renderDay(); }
    });
  });
}

// click the rate chip -> type the hourly rate
function attachRate(card, staff) {
  const el = card.querySelector("[data-rate]");
  el.addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "number"; input.min = "0"; input.step = "1"; input.className = "rate-input";
    input.value = staff.rate || ""; input.placeholder = "Rs/hr";
    el.replaceWith(input); input.focus();
    let done = false;
    const save = () => { if (done) return; done = true; setRate(staff.id, input.value); };
    input.addEventListener("blur", save);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") input.blur();
      if (e.key === "Escape") { done = true; renderDay(); }
    });
  });
}

// click an In/Out time -> type the exact time
function attachTimes(card, staff, rec) {
  card.querySelectorAll(".t-edit").forEach((b) => {
    b.addEventListener("click", () => {
      const field = b.dataset.field;
      const input = document.createElement("input");
      input.type = "time"; input.className = "time-input";
      input.value = isoToHM(rec[field]);
      b.replaceWith(input); input.focus();
      let done = false;
      const save = () => { if (done) return; done = true; setTimeField(staff.id, field, input.value); };
      input.addEventListener("blur", save);
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") input.blur();
        if (e.key === "Escape") { done = true; renderDay(); }
      });
    });
  });
}

async function doCheckIn(staffId) {
  const now = new Date().toISOString();
  await saveRecord(staffId, curDate, { status: "present", check_in: now, check_out: null, late: isLate(now) });
  toast(isLate(now) ? "Checked in — marked Late" : "Checked in");
  renderDay();
}
async function doCheckOut(staffId) {
  await saveRecord(staffId, curDate, { check_out: new Date().toISOString() });
  toast("Checked out");
  renderDay();
}
async function doStatus(staffId, status) {
  await saveRecord(staffId, curDate, { status, check_in: null, check_out: null, late: false });
  toast(status === "absent" ? "Marked Absent" : "Marked On Leave");
  renderDay();
}
async function doReset(staffId) {
  await saveRecord(staffId, curDate, { status: null, check_in: null, check_out: null, late: false });
  renderDay();
}

function renderSummary() {
  let present = 0, absent = 0, leave = 0, late = 0;
  STAFF.forEach((s) => {
    const r = dayData[s.id] || {};
    if (r.status === "present") { present++; if (r.late || isLate(r.check_in)) late++; }
    else if (r.status === "absent") absent++;
    else if (r.status === "leave") leave++;
  });
  document.getElementById("daySummary").innerHTML = `
    ${sumChip("var(--green)", "Present", present)}
    ${sumChip("var(--amber)", "Late", late)}
    ${sumChip("var(--red)", "Absent", absent)}
    ${sumChip("var(--slate)", "On Leave", leave)}`;
}
function sumChip(color, label, n) {
  return `<span class="sum-chip"><span class="swatch" style="background:${color}"></span>${label} <b>${n}</b></span>`;
}

// ============================================================
// MONTHLY REPORT
// ============================================================
async function renderMonthly() {
  const box = document.getElementById("monthlyReport");
  box.innerHTML = '<div class="loading">Loading…</div>';
  const [y, m] = document.getElementById("monthPicker").value.split("-").map(Number);
  const rows = await loadMonth(y, m);

  const stat = {};
  STAFF.forEach((s) => (stat[s.id] = { present: 0, late: 0, absent: 0, leave: 0, hours: 0, ot: 0 }));
  rows.forEach((r) => {
    const t = stat[r.staff_id]; if (!t) return;
    if (r.status === "present") {
      t.present++;
      if (r.late || isLate(r.check_in)) t.late++;
      t.hours += workedHours(r);
      t.ot += overtimeHours(r);
    } else if (r.status === "absent") t.absent++;
    else if (r.status === "leave") t.leave++;
  });

  const remDays = remainingWorkingDays(y, m); // working days left this month
  let body = "", totalEarned = 0, totalProjected = 0;
  STAFF.forEach((s) => {
    const t = stat[s.id];
    const earned = t.hours * (s.rate || 0);
    const projected = earned + remDays * STD_HOURS * (s.rate || 0);
    totalEarned += earned;
    totalProjected += projected;
    body += `<tr>
      <td class="staff-cell">${s.name}</td>
      <td class="dept-col">${s.department || "—"}</td>
      <td class="num">${pill(t.present, "var(--green)")}</td>
      <td class="num">${pill(t.late, "var(--amber)")}</td>
      <td class="num">${pill(t.absent, "var(--red)")}</td>
      <td class="num">${pill(t.leave, "var(--slate)")}</td>
      <td class="num">${s.rate ? "Rs " + s.rate : "—"}</td>
      <td class="num">${t.hours ? fmtHours(t.hours) : "—"}</td>
      <td class="num">${t.ot ? fmtHours(t.ot) : "—"}</td>
      <td class="num pay">${earned ? rs(earned) : "—"}</td>
      <td class="num projected">${projected ? rs(projected) : "—"}</td>
    </tr>`;
  });

  box.innerHTML = `<table>
    <thead><tr>
      <th class="staff-cell">Staff</th><th>Department</th><th class="num">Present</th><th class="num">Late</th>
      <th class="num">Absent</th><th class="num">On Leave</th>
      <th class="num">Rate/hr</th><th class="num">Hours</th><th class="num">Overtime</th>
      <th class="num">Earned<br><small>so far</small></th><th class="num">Projected<br><small>full month</small></th>
    </tr></thead>
    <tbody>${body}</tbody>
    <tfoot><tr>
      <td colspan="9" class="total-label">Total payroll</td>
      <td class="num pay total-pay">${rs(totalEarned)}</td>
      <td class="num projected total-pay">${rs(totalProjected)}</td>
    </tr></tfoot>
  </table>
  <div class="report-note">“Earned so far” = hours actually worked × rate. “Projected” assumes normal 8-hour days for the ${remDays} working day(s) left this month (Saturdays off).</div>`;
}
function pill(n, color) {
  if (!n) return '<span class="pill pill-0">0</span>';
  return `<span class="pill" style="color:${color};background:${color}1a">${n}</span>`;
}

async function exportCsv() {
  const [y, m] = document.getElementById("monthPicker").value.split("-").map(Number);
  const rows = await loadMonth(y, m);
  const byId = {}, deptById = {}, rateById = {};
  STAFF.forEach((s) => { byId[s.id] = s.name; deptById[s.id] = s.department || ""; rateById[s.id] = s.rate || 0; });
  rows.sort((a, b) => (a.work_date.localeCompare(b.work_date)) || (byId[a.staff_id] || "").localeCompare(byId[b.staff_id] || ""));

  let csv = "Date,Staff,Department,Status,Late,Check In,Check Out,Hours,Overtime,Rate/hr,Pay\n";
  rows.forEach((r) => {
    const name = byId[r.staff_id] || "";
    const status = r.status || "";
    const late = (r.late || isLate(r.check_in)) ? "Yes" : "";
    const w = workedHours(r), ot = overtimeHours(r), rate = rateById[r.staff_id];
    csv += `${r.work_date},"${name}","${deptById[r.staff_id] || ""}",${status},${late},${fmtTime(r.check_in)},${fmtTime(r.check_out)},${w ? w.toFixed(2) : ""},${ot ? ot.toFixed(2) : ""},${rate || ""},${w && rate ? Math.round(w * rate) : ""}\n`;
  });

  // monthly summary per staff: total hours, earned so far, projected full month
  const remDays = remainingWorkingDays(y, m);
  const sum = {};
  STAFF.forEach((s) => (sum[s.id] = 0));
  rows.forEach((r) => { if (sum[r.staff_id] !== undefined) sum[r.staff_id] += workedHours(r); });
  csv += `\nSUMMARY\nStaff,Department,Total Hours,Rate/hr,Earned so far,Projected full month\n`;
  STAFF.forEach((s) => {
    const hrs = sum[s.id] || 0;
    const earned = hrs * (s.rate || 0);
    const projected = earned + remDays * STD_HOURS * (s.rate || 0);
    csv += `"${s.name}","${s.department || ""}",${hrs.toFixed(2)},${s.rate || 0},${Math.round(earned)},${Math.round(projected)}\n`;
  });
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `attendance-${y}-${pad(m)}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
  toast("CSV exported");
}

// ============================================================
// WIRING
// ============================================================
function shiftDay(delta) {
  const d = new Date(curDate + "T00:00:00");
  d.setDate(d.getDate() + delta);
  curDate = ymd(d);
  document.getElementById("dayPicker").value = curDate;
  renderDay();
}

async function init() {
  await boot();

  // tabs
  document.querySelectorAll(".tab").forEach((t) => {
    t.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((x) => x.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach((x) => x.classList.remove("active"));
      t.classList.add("active");
      document.getElementById("tab-" + t.dataset.tab).classList.add("active");
      if (t.dataset.tab === "monthly") renderMonthly();
    });
  });

  // daily controls
  const dp = document.getElementById("dayPicker");
  dp.value = curDate;
  dp.addEventListener("change", () => { curDate = dp.value || todayStr(); renderDay(); });
  document.getElementById("prevDay").addEventListener("click", () => shiftDay(-1));
  document.getElementById("nextDay").addEventListener("click", () => shiftDay(1));
  document.getElementById("todayBtn").addEventListener("click", () => { curDate = todayStr(); dp.value = curDate; renderDay(); });

  // monthly controls
  const mp = document.getElementById("monthPicker");
  mp.value = curDate.slice(0, 7);
  mp.addEventListener("change", renderMonthly);
  document.getElementById("exportBtn").addEventListener("click", exportCsv);

  if (MODE === "local") {
    toast("Demo mode — run the SQL to save online");
  }
  renderDay();
}

document.addEventListener("DOMContentLoaded", init);
