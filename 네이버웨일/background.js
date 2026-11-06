const DEFAULT_BLOCK_LIST = ["youtube.com", "namu.wiki", "instagram.com"];

const SITE_ALIASES = [
  { canonical: "youtube.com", displayName: "유튜브",
    domains: ["youtube.com", "youtu.be", "youtube-nocookie.com"],
    names: ["유튜브", "유투브", "youtube", "yt"] },
  { canonical: "instagram.com", displayName: "인스타그램",
    domains: ["instagram.com", "instagr.am"],
    names: ["인스타그램", "인스타", "instagram", "insta"] },
  { canonical: "namu.wiki", displayName: "나무위키",
    domains: ["namu.wiki"],
    names: ["나무위키", "나무위", "namu wiki", "namuwiki"] },
  { canonical: "facebook.com", displayName: "페이스북",
    domains: ["facebook.com", "fb.com", "fb.me"],
    names: ["페이스북", "페북", "facebook"] },
  { canonical: "twitter.com", displayName: "트위터",
    domains: ["twitter.com", "x.com", "t.co"],
    names: ["트위터", "엑스", "twitter"] },
  { canonical: "tiktok.com", displayName: "틱톡",
    domains: ["tiktok.com"],
    names: ["틱톡", "tiktok"] },
  { canonical: "netflix.com", displayName: "넷플릭스",
    domains: ["netflix.com"],
    names: ["넷플릭스", "넷플", "netflix"] },
  { canonical: "twitch.tv", displayName: "트위치",
    domains: ["twitch.tv"],
    names: ["트위치", "twitch"] },
  { canonical: "reddit.com", displayName: "레딧",
    domains: ["reddit.com", "redd.it"],
    names: ["레딧", "reddit"] },
  { canonical: "dcinside.com", displayName: "디시인사이드",
    domains: ["dcinside.com"],
    names: ["디시인사이드", "디시", "dc인사이드"] },
  { canonical: "fmkorea.com", displayName: "에펨코리아",
    domains: ["fmkorea.com"],
    names: ["에펨코리아", "펨코", "에펨"] },
  { canonical: "ppomppu.co.kr", displayName: "뽐뿌",
    domains: ["ppomppu.co.kr"],
    names: ["뽐뿌"] },
  { canonical: "coupang.com", displayName: "쿠팡",
    domains: ["coupang.com"],
    names: ["쿠팡", "coupang"] },
  { canonical: "naver.com", displayName: "네이버",
    domains: ["naver.com", "naver.me"],
    names: ["네이버", "naver"] },
  { canonical: "kakao.com", displayName: "카카오",
    domains: ["kakao.com", "kakaocorp.com", "kakaotalk.com"],
    names: ["카카오", "카톡", "kakao"] }
];

const SEARCH_ENGINES = [
  { hostPattern: /(^|\.)google\.[a-z.]+$/, param: "q" },
  { hostPattern: /(^|\.)naver\.com$/, param: "query" },
  { hostPattern: /(^|\.)daum\.net$/, param: "q" },
  { hostPattern: /(^|\.)bing\.com$/, param: "q" },
  { hostPattern: /(^|\.)duckduckgo\.com$/, param: "q" },
  { hostPattern: /(^|\.)yahoo\.com$/, param: "p" },
  { hostPattern: /(^|\.)search\.daum\.net$/, param: "q" }
];

const DEFAULT_UNLOCK_DURATION_MIN = 5;
const DEFAULT_SCHEDULE = { enabled: false, days: [1, 2, 3, 4, 5], start: "09:00", end: "18:00" };
const STATS_KEEP_DAYS = 30;

// 서비스 워커는 잠들면 메모리가 사라지므로, 허용 시간은 storage에 저장한다.
const unlockStore = chrome.storage.session || chrome.storage.local;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(["blockList", "enabled", "strictMode", "schedule"], (data) => {
    const patch = {};
    if (!data.blockList) patch.blockList = DEFAULT_BLOCK_LIST;
    if (data.enabled === undefined) patch.enabled = true;
    if (data.strictMode === undefined) patch.strictMode = false;
    if (!data.schedule) patch.schedule = DEFAULT_SCHEDULE;
    if (Object.keys(patch).length) chrome.storage.sync.set(patch);
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "UNLOCK_TAB" && sender.tab) {
    unlockTab(sender.tab.id, message).then(sendResponse);
    return true;
  }
  if (message.type === "RECORD_STAT" && message.stat === "returned") {
    recordStat("returned");
  }
  return false;
});

chrome.tabs.onRemoved.addListener(async (tabId) => {
  const unlocks = await getUnlocks();
  if (unlocks[tabId]) {
    delete unlocks[tabId];
    await unlockStore.set({ unlocks });
  }
});

async function unlockTab(tabId, message) {
  if (await isFocusActive()) return { status: "denied" };

  const durationMs = (message.durationMin || DEFAULT_UNLOCK_DURATION_MIN) * 60 * 1000;
  const unlocks = await getUnlocks();
  unlocks[tabId] = {
    key: message.key || getHost(message.targetUrl),
    expires: Date.now() + durationMs
  };
  await unlockStore.set({ unlocks });
  recordStat("unlocked");
  return { status: "success" };
}

async function getUnlocks() {
  const data = await unlockStore.get("unlocks");
  return data.unlocks || {};
}

async function isFocusActive() {
  const { focusUntil = 0 } = await chrome.storage.local.get("focusUntil");
  return focusUntil > Date.now();
}

function toMinutes(hhmm) {
  const [h, m] = (hhmm || "0:0").split(":").map(Number);
  return h * 60 + m;
}

function isInSchedule(schedule, now) {
  if (!schedule || !schedule.enabled) return true;
  const days = schedule.days || [];
  const day = now.getDay();
  const mins = now.getHours() * 60 + now.getMinutes();
  const start = toMinutes(schedule.start);
  const end = toMinutes(schedule.end);

  if (start === end) return days.includes(day);
  if (start < end) return days.includes(day) && mins >= start && mins < end;
  // 자정을 넘기는 시간대 (예: 22:00~02:00): 자정 이후는 전날 요일 기준
  if (mins >= start) return days.includes(day);
  if (mins < end) return days.includes((day + 6) % 7);
  return false;
}

function todayKey(d = new Date()) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// 동시에 여러 탭에서 기록해도 값이 덮어써지지 않도록 순서대로 처리한다.
let statsQueue = Promise.resolve();
function recordStat(type, key = null) {
  statsQueue = statsQueue.then(async () => {
    const { stats = {} } = await chrome.storage.local.get("stats");
    const daily = stats.daily || {};
    const totals = stats.totals || { blocked: 0, returned: 0, unlocked: 0 };
    const day = todayKey();
    const entry = daily[day] || { blocked: 0, returned: 0, unlocked: 0, sites: {} };

    entry[type] = (entry[type] || 0) + 1;
    totals[type] = (totals[type] || 0) + 1;
    if (key) entry.sites[key] = (entry.sites[key] || 0) + 1;
    daily[day] = entry;

    const days = Object.keys(daily).sort();
    days.slice(0, Math.max(0, days.length - STATS_KEEP_DAYS)).forEach(d => delete daily[d]);

    await chrome.storage.local.set({ stats: { daily, totals } });
  }).catch(() => {});
}

function getHost(urlStr) {
  try {
    return new URL(urlStr).hostname.toLowerCase();
  } catch {
    return "";
  }
}

function hostMatchesDomain(host, domain) {
  const d = domain.toLowerCase();
  return host === d || host.endsWith("." + d);
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function findAlias(cleanEntry) {
  return SITE_ALIASES.find(site =>
    site.canonical.toLowerCase() === cleanEntry ||
    site.domains.some(d => d.toLowerCase() === cleanEntry) ||
    site.names.some(n => n.toLowerCase() === cleanEntry)
  ) || null;
}

function getSearchTermsForEntry(cleanEntry) {
  const alias = findAlias(cleanEntry);
  if (alias) {
    return [...alias.names, ...alias.domains, alias.canonical].map(s => s.toLowerCase());
  }
  return [cleanEntry];
}

function containsWord(text, word) {
  if (!word) return false;
  const escaped = escapeRegExp(word);
  const re = new RegExp(`(^|[^a-z0-9가-힣])${escaped}([^a-z0-9가-힣]|$)`, "i");
  return re.test(text);
}

function getSearchQuery(urlStr) {
  try {
    const u = new URL(urlStr);
    const host = u.hostname.toLowerCase();
    for (const engine of SEARCH_ENGINES) {
      if (engine.hostPattern.test(host)) {
        const q = u.searchParams.get(engine.param);
        if (q) return q.trim().toLowerCase();
      }
    }
  } catch {
  }
  return null;
}

function findDomainMatch(host, blockList) {
  for (const entry of blockList) {
    const cleanEntry = entry.trim().toLowerCase();
    if (!cleanEntry) continue;
    const alias = findAlias(cleanEntry);
    if (alias) {
      for (const d of alias.domains) {
        if (hostMatchesDomain(host, d)) return alias.canonical;
      }
      continue;
    }
    if (hostMatchesDomain(host, cleanEntry) || host.includes(cleanEntry)) {
      return cleanEntry;
    }
  }
  return null;
}
function findSearchMatch(query, blockList) {
  if (!query) return null;
  for (const entry of blockList) {
    const cleanEntry = entry.trim().toLowerCase();
    if (!cleanEntry) continue;

    const terms = getSearchTermsForEntry(cleanEntry);
    for (const term of terms) {
      if (containsWord(query, term)) {
        return cleanEntry;
      }
    }
  }
  return null;
}
function classifyNavigation(urlStr, blockList) {
  const host = getHost(urlStr);
  if (!host) return null;

  const domainKey = findDomainMatch(host, blockList);
  if (domainKey) return { key: domainKey, source: "domain" };

  const query = getSearchQuery(urlStr);
  const searchKey = findSearchMatch(query, blockList);
  if (searchKey) return { key: searchKey, source: "search" };

  return null;
}

function getDisplayName(key) {
  const alias = findAlias(key.toLowerCase());
  if (alias) return alias.displayName;
  return key;
}

async function handleNavigation(details) {
  if (details.frameId !== 0) return;
  const url = details.url;

  if (url.startsWith(chrome.runtime.getURL(""))) return;

  const data = await chrome.storage.sync.get(["blockList", "enabled", "strictMode", "schedule"]);
  const focusActive = await isFocusActive();

  // 집중 세션 중에는 차단 꺼짐·예약 시간과 상관없이 무조건 차단한다.
  if (!focusActive) {
    if (data.enabled === false) return;
    if (!isInSchedule(data.schedule, new Date())) return;
  }

  const blockList = data.blockList && data.blockList.length ? data.blockList : DEFAULT_BLOCK_LIST;
  const matched = classifyNavigation(url, blockList);
  if (!matched) return;

  if (!focusActive) {
    const unlocks = await getUnlocks();
    const unlock = unlocks[details.tabId];
    if (unlock) {
      if (Date.now() < unlock.expires) {
        if (unlock.key === matched.key) return;
      } else {
        delete unlocks[details.tabId];
        await unlockStore.set({ unlocks });
      }
    }
  }

  const siteName = getDisplayName(matched.key);
  const strict = data.strictMode ? "1" : "0";
  const focus = focusActive ? "1" : "0";
  const blockPageUrl = chrome.runtime.getURL(
    `block.html?target=${encodeURIComponent(url)}&name=${encodeURIComponent(siteName)}&strict=${strict}&focus=${focus}&key=${encodeURIComponent(matched.key)}&source=${matched.source}`
  );

  recordStat("blocked", matched.key);
  chrome.tabs.update(details.tabId, { url: blockPageUrl });
}

chrome.webNavigation.onBeforeNavigate.addListener(handleNavigation, {
  url: [{ schemes: ["http", "https"] }]
});

chrome.webNavigation.onHistoryStateUpdated.addListener(handleNavigation);
