const DEFAULT_BLOCK_LIST = ["youtube.com", "namu.wiki", "instagram.com"];
const DEFAULT_SETTINGS = { enabled: true, strictMode: false };

const PRESET_SITES = [
  { keyword: "유튜브", domain: "youtube.com", category: "엔터테인먼트" },
  { keyword: "유투브", domain: "youtube.com", category: "엔터테인먼트" },
  { keyword: "인스타그램", domain: "instagram.com", category: "엔터테인먼트" },
  { keyword: "인스타", domain: "instagram.com", category: "엔터테인먼트" },
  { keyword: "넷플릭스", domain: "netflix.com", category: "엔터테인먼트" },
  { keyword: "트위치", domain: "twitch.tv", category: "엔터테인먼트" },
  { keyword: "틱톡", domain: "tiktok.com", category: "엔터테인먼트" },
  { keyword: "나무위키", domain: "namu.wiki", category: "커뮤니티" },
  { keyword: "디시인사이드", domain: "dcinside.com", category: "커뮤니티" },
  { keyword: "디시", domain: "dcinside.com", category: "커뮤니티" },
  { keyword: "에펨코리아", domain: "fmkorea.com", category: "커뮤니티" },
  { keyword: "펨코", domain: "fmkorea.com", category: "커뮤니티" },
  { keyword: "뽐뿌", domain: "ppomppu.co.kr", category: "커뮤니티" },
  { keyword: "레딧", domain: "reddit.com", category: "커뮤니티" },
  { keyword: "네이버", domain: "naver.com", category: "쇼핑/포털" },
  { keyword: "쿠팡", domain: "coupang.com", category: "쇼핑/포털" },
  { keyword: "카카오", domain: "kakao.com", category: "쇼핑/포털" },
  { keyword: "카톡", domain: "kakao.com", category: "쇼핑/포털" },
  { keyword: "페이스북", domain: "facebook.com", category: "엔터테인먼트" },
  { keyword: "페북", domain: "facebook.com", category: "엔터테인먼트" },
  { keyword: "트위터", domain: "twitter.com", category: "엔터테인먼트" },
  { keyword: "엑스", domain: "twitter.com", category: "엔터테인먼트" }
];

const CATEGORIES = ["엔터테인먼트", "커뮤니티", "쇼핑/포털", "기타"];
const DEFAULT_SCHEDULE = { enabled: false, days: [1, 2, 3, 4, 5], start: "09:00", end: "18:00" };
const DAY_LABELS = [[1, "월"], [2, "화"], [3, "수"], [4, "목"], [5, "금"], [6, "토"], [0, "일"]];

let currentCategory = "all";
let focusUntil = 0;
let strictOn = false;
let schedule = { ...DEFAULT_SCHEDULE };

document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  loadSites();
  setupAutocomplete();
  setupCategoryTabs();
  setupFocus();
  setupSchedule();
  setupMainTabs();
  renderStats();
});

function setupMainTabs() {
  const tabs = document.querySelectorAll('#mainTabs .tab');
  const show = (name) => {
    tabs.forEach(t => t.classList.toggle('active', t.dataset.pane === name));
    document.querySelectorAll('.pane').forEach(p => p.classList.toggle('active', p.id === `pane-${name}`));
    try { localStorage.setItem('lastPane', name); } catch (e) {}
  };
  tabs.forEach(t => t.addEventListener('click', () => show(t.dataset.pane)));

  let saved = null;
  try { saved = localStorage.getItem('lastPane'); } catch (e) {}
  if (saved && document.getElementById(`pane-${saved}`)) show(saved);
}

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.stats) renderStats();
  if (area === 'local' && changes.focusUntil) {
    focusUntil = changes.focusUntil.newValue || 0;
    renderFocus();
    updateStatusPill();
  }
});

function isFocusActive() {
  return focusUntil > Date.now();
}

function blockedByFocus() {
  if (!isFocusActive()) return false;
  showToast('집중 세션 중에는 바꿀 수 없어요');
  return true;
}

document.getElementById('addBtn').addEventListener('click', () => addDomain());
document.getElementById('domainInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    document.getElementById('suggestionsBox').style.display = 'none';
    addDomain();
  }
});

document.getElementById('toggleEnabled').addEventListener('click', () => toggleSetting('enabled'));
document.getElementById('toggleStrict').addEventListener('click', () => toggleSetting('strictMode'));

document.getElementById('resetBtn').addEventListener('click', () => {
  if (blockedByFocus()) return;
  const payload = {
    blockList: DEFAULT_BLOCK_LIST,
    enabled: DEFAULT_SETTINGS.enabled,
    strictMode: DEFAULT_SETTINGS.strictMode,
    schedule: DEFAULT_SCHEDULE
  };
  chrome.storage.sync.set(payload, () => {
    setSwitchState('toggleEnabled', DEFAULT_SETTINGS.enabled);
    setSwitchState('toggleStrict', DEFAULT_SETTINGS.strictMode);
    strictOn = DEFAULT_SETTINGS.strictMode;
    schedule = { ...DEFAULT_SCHEDULE };
    renderSchedule();
    renderFocus();
    loadSites();
    updateStatusPill();
    showToast('기본값으로 초기화되었습니다');
  });
});

document.getElementById('githubBtn').addEventListener('click', () => {
  chrome.tabs.create({ url: 'https://github.com/LUXERET-co/NUDGE' });
});

document.getElementById('donateBtn').addEventListener('click', () => {
  chrome.tabs.create({ url: 'https://litt.ly/luxeret' });
});

function setupAutocomplete() {
  const input = document.getElementById('domainInput');
  const box = document.getElementById('suggestionsBox');

  input.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase();
    box.innerHTML = '';
    if (!query) {
      box.style.display = 'none';
      return;
    }

    const matches = PRESET_SITES.filter(item =>
      item.keyword.toLowerCase().includes(query) || item.domain.toLowerCase().includes(query)
    );

    if (matches.length === 0) {
      box.style.display = 'none';
      return;
    }

    matches.forEach(match => {
      const div = document.createElement('div');
      div.className = 'suggestion-item';

      const label = document.createElement('span');
      label.textContent = `${match.keyword} (${match.domain})`;

      const cat = document.createElement('span');
      cat.className = 's-cat';
      cat.textContent = match.category;

      div.appendChild(label);
      div.appendChild(cat);

      div.addEventListener('click', () => {
        input.value = match.keyword;
        box.style.display = 'none';
        addDomain(match.keyword);
      });
      box.appendChild(div);
    });
    box.style.display = 'block';
  });

  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !box.contains(e.target)) {
      box.style.display = 'none';
    }
  });
}

function setupCategoryTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-category');
      loadSites();
    });
  });
}

function getCategory(item) {
  const found = PRESET_SITES.find(p => p.keyword.toLowerCase() === item.toLowerCase() || p.domain.toLowerCase() === item.toLowerCase());
  return found ? found.category : "기타";
}

function addDomain(val = null) {
  const input = document.getElementById('domainInput');
  const rawValue = val || input.value;
  let value = rawValue.trim().toLowerCase();
  if (!value) return;

  if (value.includes('.') && !value.includes(' ')) {
    value = value.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
  }

  chrome.storage.sync.get(["blockList"], (data) => {
    const blockList = data.blockList || [];
    if (!blockList.includes(value)) {
      blockList.push(value);
      chrome.storage.sync.set({ blockList }, () => {
        input.value = '';
        document.getElementById('suggestionsBox').style.display = 'none';
        loadSites();
        updateStatusPill();
        showToast(`"${value}" 차단 목록에 추가됨`);
      });
    } else {
      input.value = '';
      document.getElementById('suggestionsBox').style.display = 'none';
      showToast('이미 등록된 사이트입니다');
    }
  });
}

function loadSites() {
  const siteListUl = document.getElementById('siteList');
  siteListUl.innerHTML = '';

  chrome.storage.sync.get(["blockList"], (data) => {
    const blockList = data.blockList || [];

    updateCategoryCounts(blockList);
    updateStatusPill(blockList.length);

    const filteredList = blockList.filter(item => {
      if (currentCategory === 'all') return true;
      return getCategory(item) === currentCategory;
    });

    if (filteredList.length === 0) {
      siteListUl.innerHTML = '<div class="empty-state">해당 카테고리에 차단된 사이트가 없습니다</div>';
      return;
    }

    filteredList.forEach((item) => {
      const category = getCategory(item);
      const li = document.createElement('li');

      const leftDiv = document.createElement('div');
      leftDiv.className = 'li-left';

      const tag = document.createElement('span');
      tag.className = 'category-tag';
      tag.textContent = category;

      const span = document.createElement('span');
      span.className = 'domain';
      span.textContent = item;

      leftDiv.appendChild(tag);
      leftDiv.appendChild(span);

      const btn = document.createElement('button');
      btn.className = 'delete-btn';
      btn.textContent = '×';
      btn.title = '삭제';
      btn.addEventListener('click', () => {
        if (blockedByFocus()) return;
        const updatedList = blockList.filter(d => d !== item);
        chrome.storage.sync.set({ blockList: updatedList }, () => {
          loadSites();
          updateStatusPill();
        });
      });

      li.appendChild(leftDiv);
      li.appendChild(btn);
      siteListUl.appendChild(li);
    });
  });
}

function updateCategoryCounts(blockList) {
  const counts = { all: blockList.length };
  CATEGORIES.forEach(c => (counts[c] = 0));
  blockList.forEach(item => {
    const cat = getCategory(item);
    counts[cat] = (counts[cat] || 0) + 1;
  });

  document.getElementById('count-all').textContent = counts.all;
  CATEGORIES.forEach(c => {
    const el = document.getElementById(`count-${c}`);
    if (el) el.textContent = counts[c] || 0;
  });
}

function loadSettings() {
  chrome.storage.sync.get(["enabled", "strictMode", "schedule"], (data) => {
    const enabled = data.enabled !== false;
    const strictMode = !!data.strictMode;
    strictOn = strictMode;
    schedule = { ...DEFAULT_SCHEDULE, ...(data.schedule || {}) };
    setSwitchState('toggleEnabled', enabled);
    setSwitchState('toggleStrict', strictMode);
    renderSchedule();
    renderFocus();
    updateStatusPill();
  });
}

function setSwitchState(id, on) {
  const el = document.getElementById(id);
  el.classList.toggle('on', on);
}

function toggleSetting(key) {
  if (blockedByFocus()) return;
  chrome.storage.sync.get([key], (data) => {
    const current = key === 'enabled' ? data.enabled !== false : !!data.strictMode;
    const next = !current;
    chrome.storage.sync.set({ [key]: next }, () => {
      setSwitchState(key === 'enabled' ? 'toggleEnabled' : 'toggleStrict', next);
      if (key === 'strictMode') {
        strictOn = next;
        renderFocus();
      }
      updateStatusPill();
    });
  });
}

function setupFocus() {
  document.querySelectorAll('.focus-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const min = parseInt(btn.getAttribute('data-min'), 10);
      chrome.storage.local.set({ focusUntil: Date.now() + min * 60 * 1000 }, () => {
        showToast(`${min}분 집중 세션을 시작했어요`);
      });
    });
  });

  document.getElementById('focusStop').addEventListener('click', () => {
    if (strictOn) return;
    chrome.storage.local.set({ focusUntil: 0 }, () => showToast('집중 세션을 중단했어요'));
  });

  chrome.storage.local.get(["focusUntil"], (data) => {
    focusUntil = data.focusUntil || 0;
    renderFocus();
    updateStatusPill();
  });

  setInterval(() => {
    if (!focusUntil) return;
    if (!isFocusActive()) focusUntil = 0;
    renderFocus();
    updateStatusPill();
  }, 1000);
}

function formatRemaining(ms) {
  const totalSec = Math.max(0, Math.ceil(ms / 1000));
  const m = String(Math.floor(totalSec / 60)).padStart(2, '0');
  const s = String(totalSec % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function renderFocus() {
  const active = isFocusActive();
  document.body.classList.toggle('focus-locked', active);
  document.getElementById('heroCard').classList.toggle('active', active);
  document.getElementById('focusIdle').style.display = active ? 'none' : 'flex';
  document.getElementById('focusRunning').style.display = active ? 'flex' : 'none';
  if (!active) return;

  document.getElementById('focusTime').textContent = formatRemaining(focusUntil - Date.now());
  document.getElementById('focusStop').style.display = strictOn ? 'none' : 'block';
  document.getElementById('focusSub').textContent = strictOn
    ? '엄격 모드라 끝날 때까지 중단할 수 없어요'
    : '집중하는 중이에요';
}

function setupSchedule() {
  const chips = document.getElementById('dayChips');
  DAY_LABELS.forEach(([value, label]) => {
    const chip = document.createElement('button');
    chip.className = 'day-chip';
    chip.textContent = label;
    chip.dataset.day = value;
    chip.addEventListener('click', () => {
      if (blockedByFocus()) return;
      const days = new Set(schedule.days);
      days.has(value) ? days.delete(value) : days.add(value);
      saveSchedule({ days: [...days] });
    });
    chips.appendChild(chip);
  });

  document.getElementById('toggleSchedule').addEventListener('click', () => {
    if (blockedByFocus()) return;
    saveSchedule({ enabled: !schedule.enabled });
  });

  ['scheduleStart', 'scheduleEnd'].forEach(id => {
    document.getElementById(id).addEventListener('change', (e) => {
      if (blockedByFocus()) {
        renderSchedule();
        return;
      }
      if (!e.target.value) return renderSchedule();
      saveSchedule({ [id === 'scheduleStart' ? 'start' : 'end']: e.target.value });
    });
  });

  renderSchedule();
}

function saveSchedule(patch) {
  schedule = { ...schedule, ...patch };
  chrome.storage.sync.set({ schedule }, () => {
    renderSchedule();
    updateStatusPill();
  });
}

function renderSchedule() {
  setSwitchState('toggleSchedule', schedule.enabled);
  document.getElementById('scheduleBox').classList.toggle('show', schedule.enabled);
  document.querySelectorAll('.day-chip').forEach(chip => {
    chip.classList.toggle('on', schedule.days.includes(Number(chip.dataset.day)));
  });
  document.getElementById('scheduleStart').value = schedule.start;
  document.getElementById('scheduleEnd').value = schedule.end;
}

function toMinutes(hhmm) {
  const [h, m] = (hhmm || "0:0").split(":").map(Number);
  return h * 60 + m;
}

// background.js 의 isInSchedule 과 같은 규칙
function isInSchedule(sch, now) {
  if (!sch || !sch.enabled) return true;
  const days = sch.days || [];
  const day = now.getDay();
  const mins = now.getHours() * 60 + now.getMinutes();
  const start = toMinutes(sch.start);
  const end = toMinutes(sch.end);

  if (start === end) return days.includes(day);
  if (start < end) return days.includes(day) && mins >= start && mins < end;
  if (mins >= start) return days.includes(day);
  if (mins < end) return days.includes((day + 6) % 7);
  return false;
}

function scheduleSummary(sch) {
  const order = DAY_LABELS.filter(([v]) => sch.days.includes(v)).map(([, l]) => l);
  let days = order.join('');
  if (order.length === 7) days = '매일';
  else if (days === '월화수목금') days = '평일';
  else if (days === '토일') days = '주말';
  return `${days || '요일 미선택'} ${sch.start}~${sch.end}`;
}

function todayKey(d = new Date()) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function siteLabel(key) {
  const preset = PRESET_SITES.find(p => p.domain === key || p.keyword === key);
  return preset ? preset.keyword : key;
}

function renderStats() {
  chrome.storage.local.get(["stats"], ({ stats }) => {
    const daily = (stats && stats.daily) || {};
    const totals = (stats && stats.totals) || {};
    const today = daily[todayKey()] || {};

    document.getElementById('statBlocked').textContent = today.blocked || 0;
    document.getElementById('statReturned').textContent = today.returned || 0;
    document.getElementById('statUnlocked').textContent = today.unlocked || 0;

    const foot = document.getElementById('statsFoot');
    if (!totals.blocked) {
      foot.textContent = '아직 기록이 없어요';
      return;
    }

    const sites = Object.entries(today.sites || {}).sort((a, b) => b[1] - a[1]);
    const top = sites.length ? ` · 오늘 가장 많이 막은 곳: ${siteLabel(sites[0][0])} ${sites[0][1]}회` : '';
    foot.textContent = `누적 ${totals.blocked}회 차단${top}`;
  });
}

function updateStatusPill(knownCount = null) {
  chrome.storage.sync.get(["blockList", "enabled", "strictMode"], (data) => {
    const enabled = data.enabled !== false;
    const strictMode = !!data.strictMode;
    const count = knownCount !== null ? knownCount : (data.blockList ? data.blockList.length : DEFAULT_BLOCK_LIST.length);

    const pill = document.getElementById('statusPill');
    const main = document.getElementById('statusMain');
    const sub = document.getElementById('statusSub');

    if (isFocusActive()) {
      pill.classList.add('active');
      main.textContent = '집중 세션 중';
      sub.textContent = `${formatRemaining(focusUntil - Date.now())} 남음 · ${count}개 사이트 해제 불가`;
    } else if (enabled && !isInSchedule(schedule, new Date())) {
      pill.classList.remove('active');
      main.textContent = '예약 시간 외';
      sub.textContent = `${scheduleSummary(schedule)}에만 차단 · 지금은 허용 중`;
    } else if (enabled) {
      pill.classList.add('active');
      main.textContent = strictMode ? '차단 중 (엄격 모드)' : '차단 중';
      sub.textContent = `${count}개 사이트 · 관련 검색어도 함께 차단`;
    } else {
      pill.classList.remove('active');
      main.textContent = '차단 꺼짐';
      sub.textContent = `${count}개 사이트 등록됨 · 지금은 모두 허용 중`;
    }
  });
}

let toastTimer = null;
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
}
