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

let currentCategory = "all";

document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  loadSites();
  setupAutocomplete();
  setupCategoryTabs();
});

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
  const payload = {
    blockList: DEFAULT_BLOCK_LIST,
    enabled: DEFAULT_SETTINGS.enabled,
    strictMode: DEFAULT_SETTINGS.strictMode
  };
  chrome.storage.sync.set(payload, () => {
    setSwitchState('toggleEnabled', DEFAULT_SETTINGS.enabled);
    setSwitchState('toggleStrict', DEFAULT_SETTINGS.strictMode);
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
  chrome.storage.sync.get(["enabled", "strictMode"], (data) => {
    const enabled = data.enabled !== false;
    const strictMode = !!data.strictMode;
    setSwitchState('toggleEnabled', enabled);
    setSwitchState('toggleStrict', strictMode);
    updateStatusPill();
  });
}

function setSwitchState(id, on) {
  const el = document.getElementById(id);
  el.classList.toggle('on', on);
}

function toggleSetting(key) {
  chrome.storage.sync.get([key], (data) => {
    const current = key === 'enabled' ? data.enabled !== false : !!data.strictMode;
    const next = !current;
    chrome.storage.sync.set({ [key]: next }, () => {
      setSwitchState(key === 'enabled' ? 'toggleEnabled' : 'toggleStrict', next);
      updateStatusPill();
    });
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

    if (enabled) {
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
