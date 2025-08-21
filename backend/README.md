# 🏒 Ice Hockey Statistics API

아이스하키 통계 관리를 위한 Node.js REST API 백엔드입니다.

## 🚀 빠른 시작

### 1. 환경 설정

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp env.example .env
# .env 파일을 열어서 데이터베이스 정보를 입력하세요
```

### 2. 데이터베이스 설정

MySQL 서버가 실행 중이어야 합니다.

```bash
# 전체 설정 (데이터베이스 생성 + 스키마 + 시드 데이터)
node setup.js

# 또는 개별 설정
node setup.js --schema-only  # 스키마만 생성
node setup.js --seed-only    # 시드 데이터만 생성
```

### 3. 서버 실행

```bash
# 개발 모드 (nodemon 사용)
npm run dev

# 프로덕션 모드
npm start
```

서버가 실행되면 `http://localhost:3001`에서 API에 접근할 수 있습니다.

## 📚 API 문서

### 🏒 Teams API

#### 모든 팀 조회
```http
GET /api/teams
```

**쿼리 파라미터:**
- `region`: 지역 필터 (예: 서울, 부산)
- `age_group`: 연령대 필터 (U10, U12, U15, U16, U18, Senior)
- `search`: 팀명 검색
- `sort_by`: 정렬 기준 (points, wins, win_rate, goals_for, team_name)
- `order_dir`: 정렬 방향 (ASC, DESC)

**예시:**
```bash
curl "http://localhost:3001/api/teams?region=서울&sort_by=points"
```

#### 특정 팀 상세 조회
```http
GET /api/teams/:id
```

**예시:**
```bash
curl "http://localhost:3001/api/teams/1"
```

#### 팀 순위 조회
```http
GET /api/teams/ranking
```

**쿼리 파라미터:**
- `season`: 시즌 (기본값: 2024)

#### 팀의 최근 경기 조회
```http
GET /api/teams/:id/matches
```

**쿼리 파라미터:**
- `limit`: 조회할 경기 수 (기본값: 5)

### ⚔️ Head-to-Head (H2H) API

#### 두 팀 간 상대전적 조회
```http
GET /api/h2h/:team1Id/:team2Id
```

**예시:**
```bash
curl "http://localhost:3001/api/h2h/1/2"
```

#### 특정 팀의 모든 상대전적 조회
```http
GET /api/h2h/:teamId
```

**예시:**
```bash
curl "http://localhost:3001/api/h2h/1"
```

#### H2H 통계 재계산
```http
POST /api/h2h/calculate
Content-Type: application/json

{
  "team1Id": 1,
  "team2Id": 2
}
```

## 🗄️ 데이터베이스 구조

### 주요 테이블

#### `teams` - 팀 정보
- `team_id`: 팀 고유 ID
- `team_name`: 팀명 (예: 레오파즈)
- `full_name`: 전체 팀명 (예: 서울 레오파즈)
- `region`: 지역
- `age_group`: 연령대
- `colors`: 팀 컬러 (JSON 배열)

#### `matches` - 경기 정보
- `match_id`: 경기 고유 ID
- `team1_id`, `team2_id`: 참가 팀 ID
- `team1_score`, `team2_score`: 경기 점수
- `match_date`: 경기 날짜
- `status`: 경기 상태 (scheduled, live, completed, cancelled)

#### `team_stats` - 팀 통계
- `team_id`: 팀 ID
- `season`: 시즌
- `total_matches`: 총 경기 수
- `wins`, `losses`, `draws`: 승/패/무
- `goals_for`, `goals_against`: 득점/실점
- `win_rate`: 승률
- `points`: 승점

#### `h2h_stats` - 상대전적 통계
- `team1_id`, `team2_id`: 팀 ID (항상 작은 ID가 team1)
- `team1_wins`, `team2_wins`: 각 팀의 승수
- `draws`: 무승부 수
- `recent_matches`: 최근 경기 결과 (JSON)

## 🔧 개발 도구

### 스크립트

```bash
npm run dev         # 개발 서버 시작 (nodemon)
npm start          # 프로덕션 서버 시작
npm test           # 테스트 실행
npm run db:seed    # 시드 데이터 재생성
```

### 설정 스크립트

```bash
node setup.js --help        # 도움말
node setup.js              # 전체 설정
node setup.js --reset      # 데이터 리셋 후 재설정
node setup.js --schema-only # 스키마만 생성
node setup.js --seed-only   # 시드 데이터만 생성
```

## 📦 프로젝트 구조

```
backend/
├── src/
│   ├── config/
│   │   └── database.js         # 데이터베이스 연결 설정
│   ├── models/
│   │   ├── Team.js             # 팀 모델
│   │   └── H2H.js              # H2H 모델
│   ├── routes/
│   │   ├── teams.js            # 팀 API 라우트
│   │   ├── h2h.js              # H2H API 라우트
│   │   ├── matches.js          # 경기 API 라우트 (예정)
│   │   └── stats.js            # 통계 API 라우트 (예정)
│   ├── middleware/
│   │   └── validation.js       # 입력 검증 미들웨어
│   └── database/
│       ├── schema.sql          # 데이터베이스 스키마
│       └── seed.js             # 시드 데이터 스크립트
├── server.js                   # 메인 서버 파일
├── setup.js                    # 설정 스크립트
└── package.json
```

## 🔗 프론트엔드 연동

프론트엔드에서 API를 사용하려면:

```javascript
// 팀 목록 조회
const response = await fetch('http://localhost:3001/api/teams');
const data = await response.json();

// 특정 팀 조회
const team = await fetch('http://localhost:3001/api/teams/1');
const teamData = await team.json();

// H2H 조회
const h2h = await fetch('http://localhost:3001/api/h2h/1/2');
const h2hData = await h2h.json();
```

## 🔒 보안 기능

- **Rate Limiting**: IP당 15분에 100회 요청 제한
- **CORS**: 설정된 오리진에서만 접근 허용
- **Helmet**: 보안 헤더 자동 설정
- **Input Validation**: Joi를 사용한 입력 검증

## 🐛 트러블슈팅

### 데이터베이스 연결 오류
1. MySQL 서버가 실행 중인지 확인
2. `.env` 파일의 데이터베이스 정보 확인
3. 데이터베이스 권한 확인

### 포트 충돌
```bash
# 포트 사용 중인 프로세스 확인
lsof -i :3001

# 또는 .env에서 PORT 변경
PORT=3002
```

### 시드 데이터 재생성
```bash
node setup.js --seed-only
```

## 📝 TODO

- [ ] 경기 관리 API 완성
- [ ] 선수 관리 API 추가
- [ ] 실시간 통계 계산
- [ ] 캐싱 시스템 구현 (Redis)
- [ ] API 문서 자동화 (Swagger)
- [ ] 테스트 코드 작성
- [ ] Docker 컨테이너화
- [ ] AWS 배포 스크립트

## 📞 지원

문제가 발생하면 다음을 확인해주세요:

1. `http://localhost:3001/health` - 서버 상태 확인
2. MySQL 연결 상태
3. 로그 메시지 확인

---

**Made with ❄️ for Ice Hockey Statistics**
