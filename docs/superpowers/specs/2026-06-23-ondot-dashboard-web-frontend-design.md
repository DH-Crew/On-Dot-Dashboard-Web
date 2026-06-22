# On-Dot Dashboard Web (프론트) 설계안

> 상태: 설계 확정 (2026-06-23) · 대상 레포: `On-Dot-Dashboard-Web` (React + TS + Vite)
> 관련 문서: 백엔드 SSOT 설계안 (`On-Dot_BE` 레포 `docs/superpowers/specs/2026-06-21-analytics-monitoring-dashboard-design.md`), API 계약 (`ondot-dashboard` 스킬 `references/api-contract.md`), 지표 카탈로그 (`references/metrics-and-feasibility.md`)

## 1. 목표 / 비목표

### 목표
- On-Dot 내부 분석 대시보드의 **프론트엔드**. 데이터 분석가가 날짜·필터만 조작해 서비스 현황과 변화량을 본다 (셀프서브 SQL 없음, 큐레이션 대시보드).
- v1 기능: **오버뷰 카드 그리드**(현재값 + 전일/전주/전월 Δ) + **영역별 시계열 차트 섹션**(성장 / 일정 / 알람 / 기능사용), 탭/라우팅으로 영역 구분, 날짜 프리셋(7d/30d/90d/custom).
- 인증: 카카오 로그인 → 회원 JWT → allowlist 통과 멤버만 접근.

### 비목표 (v1 제외)
- 리텐션(DAU/WAU/MAU·코호트) — 백엔드 데이터 부재로 계약에서 제외됨.
- 셀프서브 SQL/노트북, 대시보드 편집 UI, 실시간(당일) 수치.
- 지표 CRUD·관리자 화면. allowlist 관리(백엔드 DB 직접).

## 2. 기술 스택 & 컨벤션 (확정)

| 항목 | 선택 | 비고 |
|---|---|---|
| 빌드 | **Vite + React + TypeScript** | SSOT 스펙 확정 |
| 패키지 매니저 | **npm** | |
| 스타일링 | **styled-components** | desk-web 동일 컨벤션 (`*.styled.ts`) |
| 데이터 페칭 | **TanStack Query (react-query)** | 계층적 query key |
| HTTP | **axios** (+ `axios-retry`) | 요청 인터셉터로 Bearer 주입 |
| 라우팅 | **react-router-dom** | |
| 차트 | **recharts** | desk-web 동일 |
| 목 | **MSW** | 계약 기반 가짜 응답, env 토글 |
| 테스트 | **Vitest** | 스캐폴드는 설치만, 테스트 작성은 develop |
| Path alias | **PascalCase** (`Api/*`, `Hooks/*`, `Services/*`, `Components/*`, `Queries/*`, `Types/*`, `Utils/*`, `Constants/*`, `Features/*`) | desk-web 동일. tsconfig paths + vite alias 양쪽 등록 |
| Env | `import.meta.env.VITE_*` | 중앙 `Constants/env.ts` 로만 접근 (산발 `import.meta.env` 금지) |

> Vite 주의: 환경변수는 `VITE_` 접두 필수, `import.meta.env` 로 접근(데스크웹의 `process.env` 와 다름). styled-components 는 `@vitejs/plugin-react-swc` + `@swc/plugin-styled-components` 로 displayName/DX 확보.

## 3. 2단계 작업 흐름 (main / develop)

### Phase 0 — `main`: 순수 스캐폴드 (이번 작업)
빌드·린트·폴더구조·의존성·Hello 플레이스홀더만. **실제 화면/로직 없음.**

- `npm create vite` (react-ts) 기반 초기화.
- TypeScript strict + PascalCase path alias (tsconfig + vite alias).
- ESLint(flat config) + Prettier.
- 의존성 설치(이후 import 가능하도록): `react-router-dom`, `@tanstack/react-query`, `axios`, `axios-retry`, `styled-components`(+ `@types/styled-components`), `recharts`, devDep `msw`, `vitest`.
- 폴더 골격 생성(아래 §4) — 빈 디렉토리는 `.gitkeep` 또는 placeholder `index.ts`.
- `Constants/env.ts` (env 접근 중앙화), `.env.example`.
- `src/App.tsx` 는 **Hello 플레이스홀더만** 렌더. Provider(QueryClient)·Router wiring 은 로직으로 보고 develop 첫 작업으로 미룸.
- 완료 기준: `npm run build` · `npm run lint` · `tsc --noEmit` 통과 + dev 서버에서 Hello 렌더.

**Git**: 스캐폴드를 `main` 에 커밋 → `origin/main` 푸시 → `develop` 분기 생성. (현재 워크스페이스 브랜치가 아니라 `main` 직접 반영이 맞는지 구현 직전 1회 확인.)

### Phase 1+ — `develop`: v1 기능 (이후 작업)
인증 → 레이아웃/라우팅 → 메트릭 카탈로그 → 오버뷰 카드 → 영역별 차트 → MSW 목. main 에서 분기해 진행.

## 4. 폴더 구조

```
src/
├─ main.tsx, App.tsx
├─ api/                    # axios client + 인터셉터, 엔드포인트 함수
│  └─ client.ts
├─ queries/                # TanStack Query 훅 + query key factory
│  ├─ queryKeys.ts
│  ├─ useOverview.ts
│  └─ useMetrics.ts
├─ features/               # 영역별 페이지 모듈 (overview/growth/schedule/alarm/usage)
├─ components/             # 범용 UI (OverviewCard, MetricChart, DateRangePicker, AreaTabs …)
├─ hooks/                  # 범용 훅 (useDateRange …)
├─ services/               # AuthStorageService 등 싱글턴
├─ constants/              # env.ts, metricCatalog.ts, dimensionLabels.ts
├─ types/                  # API 응답 타입, 도메인 타입
├─ utils/                  # 포맷 함수(단위/Δ/%/날짜)
├─ styles/                 # global, theme
└─ mocks/                  # MSW handlers, browser worker (develop)
```

## 5. 핵심 아키텍처 — 설정(config) 기반 렌더링

API 계약이 `metric_key` + `dimension` 으로 일반화돼 있으므로, **중앙 메트릭 카탈로그**가 진실의 원천이 된다.

### 5.1 메트릭 카탈로그 (`Constants/metricCatalog.ts`)
각 `metric_key` 엔트리:
```ts
interface MetricDef {
  key: string;            // 'signup.count'
  label: string;          // '가입 수'
  area: 'growth' | 'schedule' | 'alarm' | 'usage';
  unit: 'count' | 'ratio' | 'seconds' | 'perMember'; // 포맷·표시 결정
  isSnapshot: boolean;    // 스냅샷 지표(추세로 표시, 일별증감 의미 약함)
  dimensions?: string[];  // 차트 분해축 (생략 시 _ALL_)
  chart?: 'line' | 'bar'; // 기본 line, 카테고리 분해는 bar
  note?: string;          // 주의문구 (플랫폼/사유 등)
}
```
계약의 22개 metric_key 를 카탈로그에 등재. 지표 추가 = 엔트리 한 줄.

### 5.2 dimension 레이블 (`Constants/dimensionLabels.ts`)
`KAKAO→카카오`, `CAR→자동차`, `PUBLIC_TRANSPORT→대중교통`, `STOP→중지`, `ODSAY/TMAP/TMAP_TRANSIT` 등. `_ALL_` → 전체. `withdrawal.byReason` 의 reason_id↔레이블은 v1 미제공 API라 프론트 매핑 테이블로 보유(없으면 id 그대로 노출 + note).

### 5.3 범용 컴포넌트
- `OverviewCard` — `/analytics/overview` 의 card + 카탈로그 엔트리로 렌더. value 포맷(명/%/초), DoD·WoW·MoM Δ(절대/%) 표시, pct null/첫데이터 처리.
- `MetricChart` — `/analytics/metrics` 의 series + 카탈로그로 시계열 렌더. dimension 별 라인/바, 레이블 변환, 결측 처리.
- **override 훅**: 특수 케이스는 per-metric 커스텀 렌더 허용 — `schedule.byAppointmentHour`(24시간 히스토그램), `withdrawal.byReason`(reason 매핑), 스냅샷 지표(추세 강조).

### 5.4 영역 페이지
각 영역 페이지 = 카탈로그에서 `area` 로 필터한 metric_key 목록 → 범용 컴포넌트에 주입. 오버뷰 페이지 = 영역 대표 지표들의 카드 그리드.

## 6. 데이터 흐름

```
카카오 SDK ─access_token→ POST /auth/login/oauth ─JWT→ AuthStorageService(localStorage)
                                                          │
UI(날짜/탭) → TanStack Query 훅 → axios(client, Bearer 주입) → /analytics/overview, /analytics/metrics
                                            │ (VITE_USE_MOCK=true 면) → MSW handlers (계약 기반 가짜 응답)
                                            ▼
                                   metricCatalog 로 포맷 → OverviewCard / MetricChart
```

- `GET /analytics/overview?keys=...&asOf=YYYY-MM-DD` → 카드.
- `GET /analytics/metrics?keys=...&dimensions=...&from=...&to=...` → 시계열.
- 날짜는 모두 `YYYY-MM-DD`(KST). 프리셋 7d/30d/90d/custom, `asOf` 기본 어제.

## 7. 인증 (v1 풀플로우)

- 카카오 JS SDK 로 `access_token` 획득 → `POST /auth/login/oauth?provider=KAKAO&access_token=...` 로 회원 JWT 교환.
- `AuthStorageService`: JWT localStorage 저장/조회/만료체크. axios 요청 인터셉터가 `Authorization: Bearer <jwt>` 주입.
- 응답 처리: **401**(토큰 없음/무효) → 로그인 페이지 리다이렉트. **403**(allowlist 미등록) → "대시보드 접근 권한 없음" 안내 페이지. **400** → 파라미터 에러 토스트.
- 라우트 가드: 미인증 시 보호 라우트 → `/login`. 로그인 페이지 포함.

## 8. 에러 / 결측 처리

- 빈 series·결측 날짜 정상 처리(에러 아님) — 차트에서 gap 표시.
- 스냅샷 지표(`*.active`, `*.Ratio`, `member.dailyReminderRatio`)는 "그날 현재값", 추세로 표시 — 일별 증감 강조 안 함.
- 비율 지표 value 는 0~1 소수 → 표시 시 `*100`.
- 플랫폼 분해(`signup.count` IOS/ANDROID)·`UNKNOWN` dimension → "mobileType 추가 시점 이후만 정확" note.
- `member.dailyReminderRatio` 는 현재값 스냅샷만 의미 → 시계열 추세 경고 note.

## 9. 테스트 전략

- **Phase 0(main)**: 빌드/타입체크/린트 통과 + dev 서버 Hello 렌더가 완료 기준. Vitest 는 설치만.
- **Phase 1+(develop)**: 포맷 유틸(단위/Δ/%/날짜) 단위 테스트, 카탈로그 셀렉터 테스트, MSW 기반 쿼리 훅 테스트.

## 10. 위험 / 의존성

- **백엔드 미구현**: `/analytics/**` 가 아직 없음 → MSW 목으로 UI 완성, 백엔드 준비 시 `VITE_USE_MOCK` 로 전환. 계약 필드명 변경 시 타입·목·카탈로그 동기화 필요.
- **카카오 SDK 키/도메인 등록**: 카카오 JS 키와 redirect/도메인 화이트리스트가 환경별로 필요(인증 구현 전 확보).
- **reason_id 매핑 부재**: `withdrawal.byReason` 사유 텍스트 API 없음 → 프론트 매핑 테이블 또는 후속 API.

## 11. 단계 요약

| 단계 | 브랜치 | 산출물 |
|---|---|---|
| 0 | main | 순수 스캐폴드 (빌드/린트/구조/의존성/Hello) |
| 1 | develop | Provider/Router wiring + 레이아웃 + 인증(로그인/가드/401·403) |
| 2 | develop | 메트릭 카탈로그 + axios client + query 훅 + MSW 목 |
| 3 | develop | 오버뷰 카드 그리드 + 날짜 프리셋 |
| 4 | develop | 영역별 시계열 차트 섹션 + override 케이스 |
