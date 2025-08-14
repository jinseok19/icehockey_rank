# 🏒 아이스하키 클럽 랭킹 - 전적 조회 사이트

유소년 아이스하키 클럽팀의 전적을 조회하고 분석할 수 있는 웹사이트입니다.

## ✨ 주요 기능

### 🏠 홈페이지
- **최근 핫매치**: 최근 경기 결과를 한눈에 확인
- **인기 팀**: 승률 기준 상위 팀 표시
- **전체 팀 목록**: 모든 팀을 다양한 기준으로 정렬 및 검색
- **실시간 검색**: 팀명, 지역, 연령대로 빠른 검색

### 🏒 팀 상세 페이지
- **팀 프로필**: 팀 정보, 통계, 성과
- **최근 경기 폼**: 최근 10경기 결과 시각화
- **상대전적 분석**: H2H(Head-to-Head) 상세 통계
- **차트 및 그래프**: 승률, 득실점 등 시각적 분석

### ⚽ 경기 상세 페이지
- **경기 요약**: 스코어, 팀 정보, 경기 메타데이터
- **스코어보드**: 기간별 스코어, 득점자, 파워플레이 통계
- **타임라인**: 득점과 반칙의 시간순 기록
- **선수 명단**: 양팀 선수 정보
- **반칙 로그**: 상세한 반칙 기록

### 🔍 검색 및 필터링
- **전역 검색**: 헤더에서 언제든지 팀 검색
- **시즌 필터**: 2023/2024 시즌 선택
- **연령대 필터**: U10, U12, U15, U18 선택
- **정렬 옵션**: 승률, 이름, 지역, 연령대, 경기수 기준

## 🚀 시작하기

### 1. 저장소 클론
```bash
git clone https://github.com/yourusername/icehockey_rank.git
cd icehockey_rank
```

### 2. 로컬 서버 실행
```bash
# Python 3
python -m http.server 8000

# 또는 Node.js
npx serve .

# 또는 PHP
php -S localhost:8000
```

### 3. 브라우저에서 접속
```
http://localhost:8000
```

## 📁 프로젝트 구조

```
icehockey_rank/
├── index.html          # 홈페이지
├── team.html          # 팀 상세 페이지
├── match.html         # 경기 상세 페이지
├── 404.html           # 404 에러 페이지
├── assets/
│   ├── css/
│   │   └── style.css  # 메인 스타일시트
│   ├── img/
│   │   └── logo.svg   # 로고 이미지
│   └── emblems/       # 팀 엠블럼 (향후 추가)
├── data/
│   ├── teams.json     # 팀 데이터
│   ├── matches.json   # 경기 데이터
│   └── rivals.json    # 상대전적 데이터
├── js/
│   ├── app.js         # 메인 애플리케이션
│   ├── search.js      # 검색 기능
│   ├── team.js        # 팀 페이지 관리
│   ├── match.js       # 경기 페이지 관리
│   └── h2h.js         # H2H 분석
└── README.md
```

## 🛠️ 기술 스택

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **차트**: Chart.js
- **아이콘**: Lucide Icons
- **스타일링**: CSS Grid, Flexbox, CSS Variables
- **반응형**: Mobile-first 접근법

## 📊 데이터 구조

### 팀 데이터 (teams.json)
```json
{
  "id": "leopards",
  "name": "레오파즈",
  "fullName": "서울 레오파즈",
  "ageGroup": "U15",
  "region": "서울",
  "stats": {
    "totalMatches": 45,
    "wins": 28,
    "draws": 5,
    "losses": 12,
    "winRate": 62.2
  }
}
```

### 경기 데이터 (matches.json)
```json
{
  "id": "match_001",
  "date": "2024-01-15",
  "homeTeam": "leopards",
  "awayTeam": "bears",
  "homeScore": 3,
  "awayScore": 1,
  "scorers": [...],
  "penalties": [...]
}
```

## 🎨 디자인 특징

- **다크/라이트 테마**: 시스템 설정에 따른 자동 테마 전환
- **모던한 UI**: 깔끔하고 직관적인 인터페이스
- **반응형 디자인**: 모든 디바이스에서 최적화된 경험
- **접근성**: 키보드 네비게이션 및 스크린 리더 지원

## 🔧 커스터마이징

### 새로운 팀 추가
1. `data/teams.json`에 팀 정보 추가
2. `data/matches.json`에 경기 데이터 추가
3. `data/rivals.json`에 상대전적 데이터 추가

### 스타일 수정
- `assets/css/style.css`에서 CSS 변수 수정
- 테마 색상, 폰트, 간격 등 조정 가능

### 기능 확장
- `js/` 폴더의 각 모듈에서 기능 추가
- 새로운 차트 타입이나 분석 도구 구현

## 📱 브라우저 지원

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 문의

프로젝트에 대한 문의사항이나 버그 리포트는 GitHub Issues를 통해 제출해주세요.

---

**아이스하키 클럽 랭킹** - 유소년 아이스하키의 모든 것을 한 곳에서! 🏒✨