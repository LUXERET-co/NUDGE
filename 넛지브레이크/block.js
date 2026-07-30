document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const targetUrl = urlParams.get('target');
  const siteName = urlParams.get('name');
  const strict = urlParams.get('strict') === '1';
  const key = urlParams.get('key');
  const source = urlParams.get('source');

  const titleEl = document.getElementById('siteTitle');
  const infoEl = document.getElementById('targetInfo');

  if (source === 'search' && siteName) {
    titleEl.innerText = `"${siteName}" 검색은 잠시 멈출 시간`;
    infoEl.innerText = `차단 목록에 있는 검색어라 결과 페이지를 열지 않았습니다.`;
  } else if (siteName) {
    titleEl.innerText = `${siteName}, 지금은 잠시 멈출 시간`;
    infoEl.innerText = `습관적인 방문을 끊을 수 있도록 ${siteName} 접속이 일시 중지되었습니다.`;
  } else if (targetUrl) {
    infoEl.innerText = `이 사이트 접속이 일시 중지되었습니다.`;
  }

  const quotes = [
    "지금 집중하면, 오늘의 나에게 미안하지 않습니다.",
    "\"누구나 훌륭한 계획을 갖고 있다. 쳐맞기 전까지는.\" — 마이크 타이슨",
    "작은 방종이 쌓여 내일의 후회가 됩니다.",
    "당신의 미래는 오늘 무엇을 보느냐에 달려 있습니다.",
    "잠깐의 멈춤이, 큰 흐름을 지켜줍니다."
  ];
  document.getElementById('quoteBox').innerText = quotes[Math.floor(Math.random() * quotes.length)];

  const digits = strict ? 4 : 3;
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  const randomNum = Math.floor(min + Math.random() * (max - min)).toString();
  const reversedNum = randomNum.split('').reverse().join('');

  document.getElementById('targetNum').innerText = randomNum;

  const gameInput = document.getElementById('gameInput');
  const unlockBtn = document.getElementById('unlockBtn');
  const errorMsg = document.getElementById('errorMsg');
  const backLink = document.getElementById('backLink');
  const strictNote = document.getElementById('strictNote');
  const unlockDurationSelect = document.getElementById('unlockDuration');

  if (strict) {
    backLink.style.display = 'none';
    strictNote.style.display = 'block';
  }

  const tryUnlock = () => {
    const userValue = gameInput.value.trim();

    if (userValue === reversedNum) {
      errorMsg.classList.remove('show');
      unlockBtn.disabled = true;
      unlockBtn.innerText = "이동 중...";

      const durationMin = unlockDurationSelect ? parseInt(unlockDurationSelect.value, 10) : 5;

      if (targetUrl) {
        chrome.runtime.sendMessage({ type: "UNLOCK_TAB", targetUrl, durationMin, key }, () => {
          const err = chrome.runtime.lastError;
          window.location.replace(targetUrl);
        });
      } else {
        goBackSafely();
      }
    } else {
      errorMsg.classList.add('show');
      gameInput.value = '';
      gameInput.focus();
    }
  };

  unlockBtn.addEventListener('click', tryUnlock);
  gameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') tryUnlock();
  });

  if (!strict) {
    backLink.addEventListener('click', goBackSafely);
  }

  function goBackSafely() {
    try {
      if (window.history.length > 2) {
        window.history.go(-2);
      } else {
        chrome.tabs.create({ url: 'chrome://newtab' });
      }
    } catch (e) {
      chrome.tabs.create({ url: 'chrome://newtab' });
    }
  }
});
