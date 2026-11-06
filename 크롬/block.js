document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const targetUrl = urlParams.get('target');
  const siteName = urlParams.get('name');
  const strict = urlParams.get('strict') === '1';
  const focus = urlParams.get('focus') === '1';
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
  "잠깐의 멈춤이, 큰 흐름을 지켜줍니다.",

  "\"모든 것을 잃을 것처럼 겸손하고, 잃을 게 없는 것처럼 담대하라.\"",
  "\"달을 향해 쏴라. 빗나가더라도 별들 사이에 머무를 것이다.\" — 노먼 빈센트 필",
  "\"호기심을 가지고 열정적으로 임하라. 하지만 말은 많이 하지 마라.\"",
  "\"항상 말보다 행동으로 신뢰를 얻어라.\"",
  "\"실패는 사건이지, 사람이 아니다.\" — 지그 지글러",
  "\"배우기만 하고 생각하지 않으면 얻는 것이 없고, 생각하기만 하고 배우지 않으면 위태롭다.\" — 공자",

  "\"성공은 최종적인 것이 아니며, 실패는 치명적인 것이 아니다. 중요한 것은 계속하는 용기다.\" — 윈스턴 처칠",
  "\"천 리 길도 한 걸음부터.\" — 노자",
  "\"시작이 반이다.\" — 아리스토텔레스(속담으로도 널리 사용)",
  "\"기회는 준비된 사람에게 온다.\" — 루이 파스퇴르",
  "\"미래를 예측하는 가장 좋은 방법은 미래를 만드는 것이다.\" — 피터 드러커",
  "\"오늘 할 수 있는 일을 내일로 미루지 마라.\" — 벤저민 프랭클린",
  "\"행동은 모든 성공의 기초 열쇠다.\" — 파블로 피카소",
  "\"성공의 비결은 시작하는 것이다.\" — 마크 트웨인",
  "\"포기하지 않는 사람을 이길 수 있는 사람은 드물다.\" — 베이브 루스",
  "\"넘어지는 것은 실패가 아니다. 일어나지 않는 것이 실패다.\" — 메리 픽포드",
  "\"할 수 있다고 믿든, 할 수 없다고 믿든 믿는 대로 된다.\" — 헨리 포드",
  "\"꿈은 이루어지는 것이 아니라 이루어가는 것이다.\"",
  "\"노력은 배신하지 않는다. 다만 결과가 늦게 올 뿐이다.\"",
  "\"오늘의 선택이 내일의 습관이 되고, 습관이 미래를 만든다.\"",
  "\"꾸준함은 재능을 이긴다.\"",
  "\"완벽을 기다리기보다 시작하라.\"",
  "\"어제의 나를 이기는 것이 가장 가치 있는 승리다.\"",
  "\"작은 진전도 진전이다.\"",
  "\"집중은 해야 할 일을 선택하는 것이 아니라, 하지 않을 일을 선택하는 것이다.\"",
  "\"한 번의 유혹은 하루를 잃고, 반복된 유혹은 인생을 잃는다.\"",
  "\"지금의 10분이 미래의 10일을 바꾼다.\"",
  "\"오늘의 편안함이 내일의 불편함이 될 수 있다.\"",
  "\"의지는 시작하게 만들고, 습관은 계속하게 만든다.\"",
  "\"자신과의 약속을 지키는 사람이 결국 큰 약속도 지킨다.\"",
  "\"시간은 누구에게나 공평하지만, 사용하는 방식은 공평하지 않다.\"",
  "\"남과 비교하지 말고 어제의 나와 비교하라.\"",
  "\"결과보다 성장에 집중하면 결과는 따라온다.\"",
  "\"성공은 반복된 작은 선택들의 합이다.\"",
  "\"지금의 불편함은 미래의 자유를 만든다.\"",
  "\"시계를 보지 말고 시계가 하는 일을 하라. 계속 가라.\" — 샘 레벤슨",
  "\"성공은 행복의 열쇠가 아니다. 행복이 성공의 열쇠다.\" — 앨버트 슈바이처",
  "\"가장 큰 위험은 아무런 위험도 감수하지 않는 것이다.\" — 마크 저커버그",
  "\"간단한 것이 복잡한 것보다 어렵다.\" — 스티브 잡스",
  "\"배고픈 상태를 유지하고, 어리석은 상태를 유지하라.\" — 스티브 잡스",
  "\"변명은 실패의 집을 짓는 못이다.\" — 돈 와일더",
  "\"승자는 포기하지 않고, 포기하는 자는 이기지 못한다.\" — 빈스 롬바르디",
  "\"성공하려면 실패를 두려워하지 마라.\" — 마이클 조던",
  "\"재능은 경기에서 이기지만, 팀워크와 지성은 우승을 만든다.\" — 마이클 조던",
  "\"고통은 일시적이다. 포기는 영원하다.\" — 랜스 암스트롱",
  "\"성공은 열정을 잃지 않고 실패를 거듭할 수 있는 능력이다.\" — 윈스턴 처칠",
  "\"당신이 할 수 있는 최선을 다하라. 그것이면 충분하다.\" — 조지 S. 패튼",
"\"큰 성취는 작은 일의 반복에서 시작된다.\" — 빈센트 반 고흐",
"\"목표를 높게 세우고, 그 목표에 도달할 때까지 멈추지 마라.\" — 보 잭슨",
"\"불가능은 도전하지 않은 사람의 변명이다.\" — 무하마드 알리",
"\"의심은 실패를 만들고, 자신감은 성공을 만든다.\" — 무하마드 알리",
"\"행동하지 않는 비전은 꿈일 뿐이다.\" — 일본 속담",
"\"좋은 습관은 최고의 하인이고, 나쁜 습관은 최악의 주인이다.\" — 나다니엘 에머슨",
"\"독서는 마음을 위한 운동이다.\" — 조지프 애디슨",
"\"성공은 준비와 노력, 그리고 실패에서 배우는 결과다.\" — 콜린 파월",
"\"할 수 있는 일을 하라. 지금 있는 곳에서. 가진 것으로.\" — 시어도어 루스벨트",
"\"믿음은 첫걸음을 내딛게 한다.\" — 마틴 루터 킹 주니어",
"\"불가능해 보이는 일도 끝나고 나면 가능했던 일이 된다.\" — 넬슨 만델라",
"\"한계를 정하는 순간 성장은 멈춘다.\"",
"\"실력은 하루아침에 생기지 않는다.\"",
"\"계속하는 사람이 결국 특별해진다.\"",
"\"지름길은 없다. 꾸준함이 가장 빠른 길이다.\"",
"\"오늘의 노력은 내일의 자신감이다.\"",
"\"멈추지 않으면 결국 도착한다.\"",
"\"결심보다 중요한 것은 실행이다.\"",
"\"오늘의 작은 성공이 내일의 큰 성공을 만든다.\"",
"\"어려운 길이 종종 가장 가치 있는 곳으로 이어진다.\"",
"\"집중하는 순간 평범함은 특별함이 된다.\"",
"\"오늘 흘린 땀은 내일 웃음이 된다.\"",
"\"나태함은 현재는 편하지만 미래는 무겁다.\"",
"\"실패를 두려워하면 성공도 멀어진다.\"",
"\"매일 조금씩 나아지는 것이 가장 강한 성장이다.\"",
"\"포기하지 않는 습관이 성공을 만든다.\"",
"\"지금 시작하는 사람이 결국 앞서간다.\"",
"\"생각은 방향을 만들고, 행동은 결과를 만든다.\"",
"\"할 일은 기분이 아니라 책임이 결정한다.\"",
"\"작은 성실함이 큰 신뢰를 만든다.\"",
"\"오늘이 가장 좋은 시작이다.\"",
"\"노력은 실력을 만들고, 실력은 자신감을 만든다.\"",
"\"결과를 바꾸고 싶다면 습관부터 바꿔라.\"",
"\"남들이 쉴 때 한 걸음 더 가라.\"",
"\"집중은 최고의 경쟁력이다.\"",
"\"시간을 아끼는 사람이 인생을 아낀다.\"",
"\"미래는 기다리는 것이 아니라 준비하는 것이다.\"",
"\"반복이 실력을 만든다.\"",
"\"꾸준함은 결국 재능처럼 보인다.\"",
"\"끝까지 버티는 사람이 마지막에 웃는다.\"",
"\"오늘의 선택은 미래의 나에게 보내는 편지다.\"",
"\"해야 할 일을 먼저 하면 하고 싶은 일을 할 시간이 생긴다.\"",
"\"작은 행동 하나가 인생의 방향을 바꾼다.\"",
"\"한 번 더 해보는 사람이 결국 해낸다.\"",
"\"집중한 하루는 흐릿한 일주일보다 가치 있다.\"",
"\"지금 흘리는 땀은 미래의 눈물을 줄인다.\"",
"\"완벽한 타이밍은 없다. 시작하는 순간이 가장 좋은 때다.\"",
"\"오늘의 노력은 절대 내일의 적이 되지 않는다.\"",
"\"쉬운 선택은 삶을 어렵게 만들고, 어려운 선택은 삶을 쉽게 만든다.\"",
"\"매일의 반복이 인생의 수준을 결정한다.\"",
"\"성공은 운이 아니라 습관의 결과다.\"",
"\"어제보다 단 1% 성장하면 충분하다.\"",
"\"할 수 있을 때 하지 않으면, 하고 싶을 때 할 수 없다.\"",
"\"결국 기억되는 것은 말이 아니라 행동이다.\"",
"\"목표는 방향을 알려주고, 습관은 목적지까지 데려간다.\"",
"\"자신을 이기는 사람이 가장 강한 사람이다.\"",
"\"지금 견디는 시간이 미래를 만든다.\"",
"\"성장은 불편함을 견디는 능력에서 시작된다.\"",
"\"오늘의 인내는 내일의 실력이 된다.\"",

"\"우리가 반복적으로 하는 행동이 곧 우리 자신이다. 그러므로 탁월함은 행동이 아니라 습관이다.\" — 윌 듀랜트",
"\"집중한다는 것은 '아니오'라고 말하는 것이다.\" — 스티브 잡스",
"\"잃어버린 시간은 결코 다시 찾을 수 없다.\" — 벤저민 프랭클린",
"\"전혀 할 필요가 없는 일을 효율적으로 하는 것만큼 쓸모없는 일은 없다.\" — 피터 드러커",
"\"깊이 몰입하는 능력은 점점 희소해지고, 그래서 점점 더 가치 있어지고 있다.\" — 칼 뉴포트",
"\"아는 것만으로는 부족하다. 적용해야 한다. 의지만으로는 부족하다. 실행해야 한다.\" — 괴테",
"\"물방울이 바위를 뚫는 것은 힘이 아니라 끈기 때문이다.\" — 오비디우스",
"\"인내는 쓰다. 그러나 그 열매는 달다.\" — 장 자크 루소",
"\"천천히 가는 것을 두려워하지 말고, 멈추는 것을 두려워하라.\" — 중국 속담",
"\"두 마리 토끼를 쫓는 자는 한 마리도 잡지 못한다.\" — 속담",
"\"가장 어두운 시간은 해 뜨기 직전이다.\" — 토머스 풀러",
"\"우리는 무엇을 아느냐가 아니라 무엇을 하느냐로 평가받는다.\" — 존 러스킨",
"\"휴식은 게으름이 아니다. 하지만 도피는 휴식이 아니다.\"",
"\"피드를 내리는 손가락을 멈추면, 인생이 앞으로 나아간다.\"",
"\"알고리즘은 당신의 시간을 원한다. 당신의 시간은 당신의 것이다.\"",
"\"딱 한 편만, 딱 한 번만이 오늘을 통째로 가져간다.\"",
"\"지금 보려던 그 영상은 내일도 그 자리에 있다. 오늘의 기회는 아니다.\"",
"\"무한 스크롤에는 끝이 없지만, 오늘 하루에는 끝이 있다.\"",
"\"알림을 끄는 순간, 내 목소리가 들리기 시작한다.\"",
"\"남의 하이라이트를 보느라 내 하루를 놓치지 말자.\"",
"\"심심함은 창의력이 시작되는 자리다.\"",
"\"지금 이 탭을 닫으면, 미래의 내가 고마워한다.\"",
"\"딴짓은 쉬어가는 게 아니라 미뤄두는 것이다.\"",
"\"집중력은 근육이다. 오늘 참은 만큼 내일 더 강해진다.\"",
"\"5분만 더 하면 시작할 이유가, 5분만 쉬면 멈출 이유가 생긴다.\"",
"\"해야 할 일 하나를 끝내는 것이 할 일 열 개를 계획하는 것보다 낫다.\"",
"\"마음이 산만할 때는 가장 작은 일부터 하나 끝내라.\"",
"\"의욕을 기다리지 말고 움직여라. 의욕은 움직이는 사람에게 온다.\"",
"\"하기 싫은 일을 먼저 끝내면, 나머지 하루가 가벼워진다.\"",
"\"지금 미루는 일은 사라지지 않는다. 더 무거워져서 돌아올 뿐이다.\"",
"\"오늘 하루는 다시 오지 않는 단 한 번의 기회다.\"",
"\"잘하는 사람보다 끝까지 하는 사람이 더 멀리 간다.\"",
"\"하루를 바꾸는 건 거창한 결심이 아니라 작은 멈춤이다.\"",
"\"유혹을 이긴 횟수가 쌓이면 그것이 곧 실력이 된다.\"",
"\"내가 쓴 시간이 곧 내가 된다.\"",
"\"멈춰서 숨 한 번 고르는 것, 그것이 넛지다.\"",
"\"충동은 10초면 지나간다. 지금 그 10초를 버텨보자.\"",
"\"진짜 쉬고 싶다면 화면을 끄고 눈을 감자.\"",
"\"목표가 흐려질 때는 왜 시작했는지 떠올려라.\"",
"\"계획은 종이 위에 있고, 성과는 실행 위에 있다.\"",
"\"내일의 나는 오늘의 나를 믿고 있다.\"",
"\"집중한 한 시간은 흩어진 하루보다 많은 것을 남긴다.\"",
"\"지금 하는 일을 사랑하지 않아도 괜찮다. 끝내는 나를 사랑하면 된다.\"",
"\"작은 약속을 지키는 하루가 큰 자신감을 만든다.\""
];

// 직전에 본 명언은 연속으로 나오지 않게 한다.
let quoteIndex = Math.floor(Math.random() * quotes.length);
try {
  const last = parseInt(localStorage.getItem('lastQuoteIndex'), 10);
  if (quotes.length > 1 && quoteIndex === last) quoteIndex = (quoteIndex + 1) % quotes.length;
  localStorage.setItem('lastQuoteIndex', String(quoteIndex));
} catch (e) {}
document.getElementById('quoteBox').innerText = quotes[quoteIndex];

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

  if (focus) {
    showFocusMode();
  } else if (strict) {
    backLink.style.display = 'none';
    strictNote.style.display = 'block';
  }

  function showFocusMode() {
    document.getElementById('gameBox').style.display = 'none';
    document.getElementById('timeSettingBox').style.display = 'none';
    document.getElementById('focusBox').style.display = 'block';
    unlockBtn.style.display = 'none';

    const remainingEl = document.getElementById('focusRemaining');
    const focusDesc = document.getElementById('focusDesc');

    chrome.storage.local.get(['focusUntil'], ({ focusUntil = 0 }) => {
      const tick = () => {
        const left = focusUntil - Date.now();
        if (left <= 0) {
          clearInterval(timer);
          remainingEl.innerText = '00:00';
          focusDesc.innerText = '집중 세션이 끝났어요. 수고했어요!';
          unlockBtn.style.display = 'block';
          unlockBtn.innerText = '계속 이동하기';
          // 세션이 끝나면 평소 규칙대로 다시 판단하도록 원래 주소로 보낸다.
          unlockBtn.onclick = () => targetUrl ? window.location.replace(targetUrl) : goBackSafely();
          return;
        }
        const totalSec = Math.ceil(left / 1000);
        const m = String(Math.floor(totalSec / 60)).padStart(2, '0');
        const s = String(totalSec % 60).padStart(2, '0');
        remainingEl.innerText = `${m}:${s}`;
      };
      const timer = setInterval(tick, 1000);
      tick();
    });
  }

  const tryUnlock = () => {
    if (focus) return;
    const userValue = gameInput.value.trim();

    if (userValue === reversedNum) {
      errorMsg.classList.remove('show');
      unlockBtn.disabled = true;
      unlockBtn.innerText = "이동 중...";

      const durationMin = unlockDurationSelect ? parseInt(unlockDurationSelect.value, 10) : 5;

      if (targetUrl) {
        chrome.runtime.sendMessage({ type: "UNLOCK_TAB", targetUrl, durationMin, key }, (res) => {
          const err = chrome.runtime.lastError;
          // 그 사이 집중 세션이 시작됐다면 해제 대신 집중 화면을 보여준다.
          if (res && res.status === "denied") {
            const params = new URLSearchParams(window.location.search);
            params.set('focus', '1');
            window.location.replace(`${window.location.pathname}?${params}`);
            return;
          }
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

  if (focus || !strict) {
    backLink.addEventListener('click', () => {
      chrome.runtime.sendMessage({ type: "RECORD_STAT", stat: "returned" }, () => chrome.runtime.lastError);
      goBackSafely();
    });
  }

  function goBackSafely() {
    try {
      if (window.history.length > 2) {
        window.history.go(-2);
      } else {
        openNewTabAndClose();
      }
    } catch (e) {
      openNewTabAndClose();
    }
  }

  // chrome://newtab 은 파이어폭스에서 열 수 없으므로, 주소 없이 새 탭을 열어 브라우저 기본 새 탭을 쓴다.
  function openNewTabAndClose() {
    chrome.tabs.getCurrent((tab) => {
      chrome.tabs.create({}, () => {
        if (tab) chrome.tabs.remove(tab.id);
      });
    });
  }
});
