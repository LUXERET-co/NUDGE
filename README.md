<div align="center">

<img src="logo.png" width="128" alt="NUDGE Logo">

# 넛지브레이크 (NUDGE)

### 방해는 멀리, 집중은 가까이.

자꾸 들어가게 되는 사이트를 막아,
해야 할 일에 집중하도록 도와주는 브라우저 확장 프로그램입니다.

Chrome과 Firefox를 지원하며,
NAVER Whale도 지원합니다.

<br>

<p>

<img src="https://img.shields.io/badge/Google_Chrome-Supported-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white">

<img src="https://img.shields.io/badge/Mozilla_Firefox-Supported-FF7139?style=for-the-badge&logo=firefoxbrowser&logoColor=white">

<img src="https://img.shields.io/badge/NAVER_Whale-Supported-03C75A?style=for-the-badge&logo=naver&logoColor=white">

</p>

<p>

<img src="https://img.shields.io/badge/Version-1.1.0-orange?style=for-the-badge">

<img src="https://img.shields.io/badge/Manifest-V3-success?style=for-the-badge">

<img src="https://img.shields.io/badge/Privacy-Local_Only-brightgreen?style=for-the-badge">

<img src="https://img.shields.io/badge/License-CC--BY--NC--4.0-blue?style=for-the-badge">

</p>

<p>

<a href="https://github.com/LUXERET-co/NUDGE/issues">
<img src="https://img.shields.io/badge/Issues-Welcome-blue?style=for-the-badge&logo=github">
</a>

<a href="https://github.com/LUXERET-co/NUDGE/pulls">
<img src="https://img.shields.io/badge/Pull_Requests-Welcome-brightgreen?style=for-the-badge&logo=github">
</a>

<a href="https://github.com/LUXERET-co/NUDGE/stargazers">
<img src="https://img.shields.io/github/stars/LUXERET-co/NUDGE?style=for-the-badge&logo=github">
</a>

</p>

</div>

---

# 🆕 v1.1.0 업데이트

- ⏱️ **집중 타이머** — 25 · 50 · 90분 동안 어떤 방법으로도 해제할 수 없는 집중 세션
- 🗓️ **시간대 예약 차단** — 정한 요일 · 시간에만 자동으로 차단
- 📊 **오늘의 기록** — 차단 · 참고 돌아감 · 해제 횟수와 가장 많이 막은 사이트
- 💬 **명언 155개** — 차단 화면 명언을 대폭 추가하고, 같은 명언이 연달아 나오지 않도록 개선
- 🎨 **새로운 디자인** — 홈 · 사이트 · 설정 탭으로 나눈 둥근 카드형 팝업
- 🛠️ **안정성 개선**
  - 잠금 해제 후 허용 시간이 설정보다 일찍 끝나던 문제 수정
  - Firefox에서 "이전 페이지로 돌아가기"가 동작하지 않던 문제 수정

---

# ✨ 주요 기능

## 🚫 사이트 차단

등록한 사이트에 접속하면 차단 화면이 표시됩니다.

- 사이트 주소를 직접 등록할 수 있습니다.
- 미러 주소도 함께 차단합니다.

예:

```
youtu.be → youtube.com
```

---

## 🔍 검색어 차단

검색창에 등록한 사이트나 키워드를 입력하면

검색 결과가 열리기 전에 차단합니다.

Google · 네이버 · 다음 · Bing · DuckDuckGo · Yahoo 검색을 지원합니다.

---

## 🇰🇷 한글 사이트 이름 인식

사이트 이름을 정확히 몰라도 괜찮습니다.

다양한 표현을 자동으로 인식합니다.

예:

- 유튜브
- 유투브
- 인스타
- 인스타그램

---

## ⏱️ 집중 타이머 <sup>NEW</sup>

지금 당장 집중해야 할 때 사용하세요.

- 25분 · 50분 · 90분 세션을 한 번에 시작합니다.
- 세션 중에는 **차단 기능 끄기, 사이트 삭제, 숫자 게임 해제가 모두 막힙니다.**
- 차단 화면에는 미니게임 대신 남은 시간이 표시됩니다.
- 엄격 모드와 함께 쓰면 세션을 중간에 멈출 수 없습니다.

---

## 🗓️ 시간대 예약 차단 <sup>NEW</sup>

정해진 시간에만 자동으로 차단합니다.

- 요일과 시작 · 종료 시간을 자유롭게 설정할 수 있습니다.
- 예약 시간이 아닐 때는 모든 사이트가 허용됩니다.
- `22:00 ~ 02:00`처럼 자정을 넘기는 시간대도 지원합니다.

예:

```
평일 09:00 ~ 18:00 → 업무 시간에만 차단
```

---

## 📊 오늘의 기록 <sup>NEW</sup>

오늘 얼마나 유혹을 이겨냈는지 확인할 수 있습니다.

- 🚫 차단된 횟수
- 🔙 차단 화면에서 참고 돌아간 횟수
- 🔓 잠금을 해제한 횟수
- 누적 차단 횟수와 오늘 가장 많이 막은 사이트

> 기록은 브라우저 안에만 저장되며, 최근 30일치만 보관합니다.

---

## 💬 차단 화면 명언

차단 화면마다 집중을 돕는 명언이 표시됩니다.

- 155개의 명언과 집중 문구
- 같은 명언이 연달아 나오지 않습니다.

---

## 🔒 엄격 모드

더 강한 집중 환경이 필요하다면 사용할 수 있습니다.

제공 기능:

- 뒤로가기 차단
- 잠금 해제 번호 강화 (3자리 → 4자리)
- 집중 타이머 중단 불가

---

## ⏳ 임시 잠금 해제

정말 필요한 경우에만 잠시 사용할 수 있습니다.

숫자를 역순으로 입력하는 미니게임을 통과하면
원하는 시간 동안 사이트 접근을 허용합니다.

지원 시간:

- 3분
- 5분
- 10분
- 30분

> 집중 타이머가 진행 중일 때는 잠금 해제를 사용할 수 없습니다.

---

## 📂 차단 목록 관리

차단 목록을 카테고리별로 관리할 수 있습니다.

- 🎮 엔터테인먼트
- 💬 커뮤니티
- 🛒 쇼핑·포털
- 📌 기타

---

## ⚡ 프리셋 추가

자주 차단하는 사이트는 검색 후 바로 추가할 수 있습니다.

---

# 📦 기본 제공 사이트

기본 프리셋:

- YouTube
- Instagram
- 나무위키
- Facebook
- X (Twitter)
- TikTok
- Netflix
- Twitch
- Reddit
- 디시인사이드
- 에펨코리아
- 뽐뿌
- 쿠팡
- 네이버
- 카카오

프리셋에 없는 사이트와 키워드도 직접 추가할 수 있습니다.

---

# 🚀 설치 방법

---

## <img src="./icons/chrome.svg" width="24"> Google Chrome

[![Chrome 웹 스토어에서 설치](https://img.shields.io/badge/Chrome%20웹%20스토어에서%20설치-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)](https://chromewebstore.google.com/detail/%EB%84%9B%EC%A7%80%EB%B8%8C%EB%A0%88%EC%9D%B4%ED%81%AC-nudge/gfgkikikfablkcpkjdljmlbboohimobm)

---

## <img src="./icons/firefox.svg" width="24"> Mozilla Firefox

[![Firefox 부가 기능에서 설치](https://img.shields.io/badge/Firefox%20부가%20기능에서%20설치-FF7139?style=for-the-badge&logo=firefoxbrowser&logoColor=white)](https://addons.mozilla.org/ko/firefox/addon/%EB%84%9B%EC%A7%80%EB%B8%8C%EB%A0%88%EC%9D%B4%ED%81%AC-nudge/)

---

## <img src="./icons/whale.svg" width="24"> NAVER Whale

[![네이버 웨일 스토어에서 설치](https://img.shields.io/badge/네이버%20웨일%20스토어에서%20설치-03C75A?style=for-the-badge&logo=naver&logoColor=white)](https://store.whale.naver.com/detail/hhmoiggmkccdgcapkhnicokgjefhdoda)

---

# 📖 사용 방법

팝업은 **홈 · 사이트 · 설정** 세 개의 탭으로 구성되어 있습니다.

1. 확장 프로그램 아이콘을 클릭합니다.
2. **사이트** 탭에서 차단할 사이트 또는 키워드를 추가합니다.
3. **설정** 탭에서 차단 기능을 켜고, 필요하면 엄격 모드와 예약 시간을 설정합니다.
4. 지금 바로 집중하고 싶다면 **홈** 탭에서 집중 타이머를 시작합니다.
5. 차단 화면에서 정말 필요한 경우에만 잠시 잠금을 해제합니다.
6. **홈** 탭에서 오늘의 기록을 확인합니다.

---

# 📂 프로젝트 구조

```text
.
├── manifest.json       # Manifest V3 설정
├── background.js       # 차단 로직, 예약 시간·집중 세션 판단, 기록 저장
├── popup.html
├── popup.js            # 설정 화면 (홈 · 사이트 · 설정)
├── block.html
├── block.js            # 차단 화면, 명언, 잠금 해제
├── icons/              # 확장 프로그램 아이콘
└── logo.png
```

---

# 🛡️ 권한 안내

| 권한 | 사용 목적 |
|---|---|
| `storage` | 차단 목록, 설정, 예약 시간, 집중 세션, 오늘의 기록을 저장합니다. |
| `webNavigation` | 페이지 이동을 감지하고 차단 여부를 확인합니다. |
| `tabs` | (Firefox) 차단 페이지로 이동하기 위해 사용합니다. |

> 넛지브레이크는 개인정보와 방문 기록을 외부 서버로 전송하지 않습니다.

차단 기록을 포함한 모든 데이터는 사용자의 브라우저 내부에 저장됩니다.

---

# 🤝 기여하기

버그 제보와 기능 제안을 환영합니다.

참여 방법:

1. 저장소 Fork
2. 새로운 Branch 생성
3. 변경 사항 작성
4. Pull Request 생성

도움이 필요한 경우:

- 🐞 [Bug Report](https://github.com/LUXERET-co/NUDGE/issues)
- 💡 [Feature Request](https://github.com/LUXERET-co/NUDGE/issues)
- 🔀 [Pull Request](https://github.com/LUXERET-co/NUDGE/pulls)

---

# 💖 후원하기

넛지브레이크가 도움이 되었다면
프로젝트를 응원해 주세요.

<p align="center">

<a href="https://litt.ly/luxeret">

<img src="https://img.shields.io/badge/☕_후원하기-FFDD00?style=for-the-badge">

</a>

</p>

---

# 📜 라이선스

이 프로젝트는  
**CC BY-NC 4.0 License**를 따릅니다.

허용:

- ✅ 수정
- ✅ 개인 사용
- ✅ 원작자 표시 후 재배포

제한:

- ❌ 상업적 이용
- ❌ 판매 목적 배포

---

# 🏢 사업자 정보

| 항목 | 내용 |
|---|---|
| 상호명 | 룩세렛 |
| 대표자 | 김태준 |
| 사업자등록번호 | 802-68-00634 |
| 통신판매업신고 | 제2026-서울강동-1782호 |
| 주소 | 서울특별시 강동구 고덕로 47 정산 301-115호 |

---

<div align="center">

## ⭐ 방해는 멀리, 집중은 가까이.

집중하고 싶은 순간마다  
**넛지브레이크**가 함께합니다.

<br>

<a href="https://github.com/LUXERET-co/NUDGE/stargazers">

<img src="https://img.shields.io/badge/⭐_Star_this_project-yellow?style=for-the-badge">

</a>

<a href="https://litt.ly/luxeret">

<img src="https://img.shields.io/badge/☕_후원하기-FFDD00?style=for-the-badge">

</a>

<br><br>

Made with ❤️ by **룩세렛**

</div>
