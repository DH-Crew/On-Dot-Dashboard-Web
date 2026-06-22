# On-Dot Dashboard Web Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** On-Dot 내부 분석 대시보드 프론트(React+TS+Vite)를 main 순수 스캐폴드 → develop 에서 설정(메트릭 카탈로그) 기반 v1(인증/오버뷰카드/영역별차트)까지 구현.

**Architecture:** 중앙 `metricCatalog` 가 진실의 원천. 범용 `OverviewCard`/`MetricChart` 가 카탈로그 + `/analytics/**` 응답으로 렌더. 백엔드 미구현이라 MSW 목으로 UI 완성, `VITE_USE_MOCK` 로 실 백엔드 전환. 카카오 로그인 → 회원 JWT → axios Bearer 인터셉터 → allowlist 403 처리.

**Tech Stack:** Vite, React 18, TypeScript(strict), react-router-dom, @tanstack/react-query, axios + axios-retry, styled-components, recharts, MSW, Vitest, npm.

## Global Constraints

- 패키지 매니저: **npm**.
- Path alias: **PascalCase** (`Api/* Hooks/* Services/* Components/* Queries/* Types/* Utils/* Constants/* Features/* Mocks/* Styles/*`) — tsconfig paths + vite alias 양쪽 등록.
- Env: `import.meta.env.VITE_*` 만, **중앙 `Constants/env.ts`** 경유.
- 스타일: styled-components, 파일 `*.styled.ts`.
- 날짜: `YYYY-MM-DD` (KST). 프리셋 7d/30d/90d/custom, `asOf` 기본 어제.
- 비율 value 는 0~1 → 표시 시 `*100`. 스냅샷 지표는 추세로 표시.
- TypeScript strict, `noImplicitAny:false` 허용(desk-web 관례).
- main = 순수 스캐폴드(로직 없음). 기능은 develop.

---

## Phase 0 — main: 순수 스캐폴드

### Task 0.1: Git 준비 (main 에 작업)

- [ ] `git checkout main && git merge --ff-only ondot-dashboard-setup` (설계 문서 커밋을 main 으로). FF 실패 시 `git merge ondot-dashboard-setup`.
- [ ] 확인: `git log --oneline -3` 에 docs 커밋 존재.

### Task 0.2: Vite 스캐폴드 생성

비대화형으로 임시 디렉토리에 생성 후 필요한 파일만 레포로 복사 (README.md/docs/ 보존).

- [ ] `npm create vite@latest /tmp/ondot-scaffold -- --template react-ts`
- [ ] 임시 디렉토리에서 `src/`, `index.html`, `vite.config.ts`, `tsconfig*.json`, `package.json`, `.gitignore`, `eslint.config.js` 를 레포로 복사(기존 README/docs 유지). 복사 후 `src/` 의 데모(`App.css`, `assets/`, 데모 App.tsx) 정리.
- [ ] `npm install`

### Task 0.3: 의존성 설치

- [ ] `npm install react-router-dom @tanstack/react-query axios axios-retry styled-components`
- [ ] `npm install -D @types/styled-components msw vitest @vitejs/plugin-react-swc @swc/plugin-styled-components vite-tsconfig-paths jsdom @testing-library/react @testing-library/jest-dom`
- [ ] recharts: `npm install recharts`
- [ ] jwt-decode: `npm install jwt-decode`

### Task 0.4: 설정 파일

- [ ] `tsconfig.app.json` (또는 tsconfig.json)에 `baseUrl:"."`, `paths` PascalCase alias 추가.
- [ ] `vite.config.ts`: `@vitejs/plugin-react-swc` + `@swc/plugin-styled-components`, `vite-tsconfig-paths`, dev server `port:5180`, vitest `test:{environment:'jsdom', globals:true, setupFiles}`.
- [ ] `.env.example`: `VITE_API_BASE_URL=`, `VITE_USE_MOCK=true`, `VITE_KAKAO_JS_KEY=`.
- [ ] `package.json` scripts: `dev`, `build`, `lint`, `preview`, `typecheck`("tsc --noEmit"), `test`("vitest run"), `test:watch`.

### Task 0.5: 폴더 골격 + env 상수 + Hello

- [ ] 디렉토리 생성: `src/{api,queries,features,components,hooks,services,constants,types,utils,styles,mocks}` 각 `.gitkeep`.
- [ ] `src/constants/env.ts`:

```ts
export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL ?? '',
  USE_MOCK: (import.meta.env.VITE_USE_MOCK ?? 'true') === 'true',
  KAKAO_JS_KEY: import.meta.env.VITE_KAKAO_JS_KEY ?? '',
} as const;
```

- [ ] `src/App.tsx`: Hello 플레이스홀더만 (`<h1>On-Dot Dashboard</h1>`). Provider/Router 없음.
- [ ] `src/main.tsx`: `<App/>` 만 렌더.

### Task 0.6: 검증 + 커밋 + 푸시 + develop 분기

- [ ] `npm run build` PASS, `npm run typecheck` PASS, `npm run lint` PASS.
- [ ] dev 서버 기동 후 Hello 렌더 확인(브라우저 자동화 또는 curl).
- [ ] `git add -A && git commit -m "chore: Vite+React+TS 스캐폴드 기본 세팅"`
- [ ] `git push origin main`
- [ ] `git checkout -b develop && git push -u origin develop`

---

## Phase 1 — develop: Provider/Router/레이아웃/인증

### Task 1.1: 테마 + 글로벌 스타일 + Provider wiring

**Files:** Create `src/styles/theme.ts`, `src/styles/GlobalStyle.ts`, `src/App.tsx`(개편), `src/main.tsx`(개편).

- [ ] `theme.ts`: 색/spacing 토큰. `GlobalStyle.ts`: reset + 기본 폰트.
- [ ] `main.tsx`: `QueryClientProvider` + `ThemeProvider` + `GlobalStyle` + `BrowserRouter`.
- [ ] `App.tsx`: `<AppRoutes/>` 렌더.
- [ ] `npm run dev` 로 흰 화면 정상.
- [ ] commit.

### Task 1.2: 타입 정의

**Files:** Create `src/types/analytics.ts`.

```ts
export interface Delta { abs: number; pct: number | null; }
export interface OverviewCard {
  key: string; value: number;
  dod: Delta; wow: Delta; mom: Delta;
}
export interface OverviewResponse { asOf: string; cards: OverviewCard[]; }
export interface MetricPoint { date: string; value: number; }
export interface MetricSeries { key: string; dimension: string; points: MetricPoint[]; }
export interface MetricsResponse { series: MetricSeries[]; }
export interface AuthResponse { accessToken: string; }
```

- [ ] commit.

### Task 1.3: AuthStorageService (TDD)

**Files:** Create `src/services/AuthStorageService.ts`, Test `src/services/AuthStorageService.test.ts`.

- [ ] 테스트: setToken→getToken 반환, clear 후 null, 만료 토큰 isExpired=true.
- [ ] 구현: localStorage key `ondot.auth.token`, `jwt-decode` 로 exp 체크. `getToken/setToken/clear/isExpired/getAuthHeader()→{Authorization:'Bearer x'}|{}`.
- [ ] `npm test` PASS. commit.

### Task 1.4: axios client + 인터셉터

**Files:** Create `src/api/client.ts`.

- [ ] axios instance baseURL=`ENV.API_BASE_URL`, axios-retry(지수백오프, idempotent).
- [ ] request 인터셉터: `AuthStorage.getAuthHeader()` 머지.
- [ ] response 인터셉터: 401 → `AuthStorage.clear()` + `window.location` 로그인 이동(또는 이벤트). 403 → `ForbiddenError` throw. 그 외 → `ServerError`.
- [ ] commit.

### Task 1.5: 인증 컨텍스트 + 로그인 + 가드 + 403 페이지

**Files:** Create `src/services/kakao.ts`, `src/features/auth/AuthContext.tsx`, `src/features/auth/LoginPage.tsx`, `src/features/auth/ForbiddenPage.tsx`, `src/components/ProtectedRoute.tsx`, `src/api/auth.ts`.

- [ ] `api/auth.ts`: `loginWithKakao(accessToken)` → `POST /auth/login/oauth?provider=KAKAO&access_token=...` → `AuthResponse`.
- [ ] `kakao.ts`: SDK 동적 로드 + `Kakao.init(ENV.KAKAO_JS_KEY)` + `loginKakao():Promise<string>`(access_token). 키 없으면 dev 모드용 `'dev-kakao-token'` 반환.
- [ ] `AuthContext`: `isAuthed`, `login()`(kakao→exchange→store), `logout()`.
- [ ] `LoginPage`: "카카오로 로그인" 버튼. `ProtectedRoute`: 미인증 → `/login`.
- [ ] `ForbiddenPage`: 403 시 "대시보드 접근 권한이 없습니다(allowlist 미등록)".
- [ ] commit.

### Task 1.6: 레이아웃 + 라우팅 골격

**Files:** Create `src/components/Layout.tsx`, `src/components/AreaTabs.tsx`, `src/routes/AppRoutes.tsx`.

- [ ] `AppRoutes`: `/login`, `/forbidden` 공개; 보호 라우트 `/`(→`/overview`), `/overview`, `/growth`, `/schedule`, `/alarm`, `/usage` (각 자리 placeholder).
- [ ] `Layout`: 헤더(타이틀+로그아웃) + `AreaTabs`(오버뷰/성장/일정/알람/기능사용) + `<Outlet/>`.
- [ ] dev 서버에서 탭 네비게이션 동작 확인.
- [ ] commit.

---

## Phase 2 — develop: 카탈로그 + 쿼리 + MSW 목

### Task 2.1: dimensionLabels + metricCatalog

**Files:** Create `src/constants/dimensionLabels.ts`, `src/constants/metricCatalog.ts`.

- [ ] `dimensionLabels`: `{ _ALL_:'전체', KAKAO:'카카오', APPLE:'애플', IOS:'iOS', ANDROID:'Android', PUBLIC_TRANSPORT:'대중교통', CAR:'자동차', STOP:'중지', SNOOZE:'스누즈', VIEW_ROUTE:'경로보기', START_PREPARE:'준비시작', ODSAY:'ODsay', TMAP:'TMAP', TMAP_TRANSIT:'TMAP대중교통', UNKNOWN:'알수없음' }`. fallback = id 그대로.
- [ ] `metricCatalog`: 계약의 22 key 를 `MetricDef`(§spec 5.1)로 등재. area/unit/isSnapshot/dimensions/chart/note. 헬퍼 `getMetric(key)`, `metricsByArea(area)`.
- [ ] commit.

### Task 2.2: format utils (TDD)

**Files:** Create `src/utils/format.ts`, Test `src/utils/format.test.ts`.

- [ ] `formatValue(value, unit)`: count→`110`, ratio→`12.0%`, seconds→`3.2초`, perMember→`1.4건/인`.
- [ ] `formatDelta(delta)`: `{abs, pct}` → `+10 (+10.0%)`, pct null → `+10 (–)`.
- [ ] `presetRange(preset, asOf)`: 7d/30d/90d → {from,to}. `yesterday()`.
- [ ] 테스트 작성→FAIL→구현→PASS. commit.

### Task 2.3: analytics API + query 훅

**Files:** Create `src/api/analytics.ts`, `src/queries/queryKeys.ts`, `src/queries/useOverview.ts`, `src/queries/useMetrics.ts`.

- [ ] `analytics.ts`: `getOverview({keys,asOf})`, `getMetrics({keys,dimensions?,from,to})` (client.get + params).
- [ ] `queryKeys`: `analytics.overview(keys,asOf)`, `analytics.metrics(keys,dims,from,to)`.
- [ ] `useOverview`, `useMetrics` (useQuery).
- [ ] commit.

### Task 2.4: MSW 목 핸들러

**Files:** Create `src/mocks/handlers.ts`, `src/mocks/browser.ts`, `src/mocks/data.ts`, `public/mockServiceWorker.js`(npx msw init), `src/main.tsx`(enable).

- [ ] `npx msw init public/ --save`.
- [ ] `data.ts`: 계약 dimension 별 결정적 시계열 생성기(seeded, 날짜 범위에 대해 값 생성).
- [ ] `handlers.ts`: `POST /auth/login/oauth` → `{accessToken: <fake-jwt>}`. `GET /analytics/overview` → keys 별 card(value+dod/wow/mom). `GET /analytics/metrics` → keys×dimensions 별 series.
- [ ] `browser.ts`: `setupWorker(...handlers)`.
- [ ] `main.tsx`: `if (ENV.USE_MOCK) await worker.start()` 후 렌더.
- [ ] dev 서버에서 네트워크 탭에 목 응답 확인. commit.

---

## Phase 3 — develop: 날짜 프리셋 + 오버뷰 카드

### Task 3.1: useDateRange 훅

**Files:** Create `src/hooks/useDateRange.ts`, `src/components/DateRangeControl.tsx`.

- [ ] `useDateRange`: preset state(기본 30d) + custom {from,to}, `asOf`=어제. URL query 동기화(선택).
- [ ] `DateRangeControl`: 프리셋 버튼 7d/30d/90d + custom date input 2개.
- [ ] commit.

### Task 3.2: OverviewCard 컴포넌트

**Files:** Create `src/components/OverviewCard.tsx`, `OverviewCard.styled.ts`.

- [ ] props: `card: OverviewCard`. 카탈로그로 label/unit. value 포맷, DoD/WoW/MoM Δ(색상: +초록/-빨강), pct null 처리, note 툴팁.
- [ ] commit.

### Task 3.3: Overview 페이지

**Files:** Create `src/features/overview/OverviewPage.tsx`.

- [ ] 대표 지표 keys(예: `signup.count, growth.net, member.active, withdrawal.count, schedule.created, schedule.active, alarm.snoozeRatio, ai.usageTotal`) → `useOverview(keys, asOf)` → 카드 그리드.
- [ ] 로딩/에러/빈 상태.
- [ ] dev 서버에서 카드 렌더 확인(목 데이터).
- [ ] commit.

---

## Phase 4 — develop: 영역별 시계열 차트 + override

### Task 4.1: MetricChart 컴포넌트

**Files:** Create `src/components/MetricChart.tsx`.

- [ ] props: `metricKey`, `series: MetricSeries[]`, `from/to`. recharts LineChart(기본) / BarChart(카탈로그 chart='bar' 또는 카테고리 dimension). dimension 별 라인, 레이블 변환, 결측 gap, 비율 *100 축.
- [ ] commit.

### Task 4.2: 영역 페이지 (generic)

**Files:** Create `src/features/area/AreaPage.tsx`, `src/features/{growth,schedule,alarm,usage}` 라우트 연결.

- [ ] `AreaPage({area})`: `metricsByArea(area)` → 각 metric `useMetrics(key, dims, from, to)` → `MetricChart` 섹션 나열. 상단 `DateRangeControl`.
- [ ] 라우트 `/growth /schedule /alarm /usage` 를 `AreaPage` 로 연결.
- [ ] dev 서버에서 각 영역 차트 렌더 확인.
- [ ] commit.

### Task 4.3: override 케이스

**Files:** Modify `MetricChart.tsx` 또는 Create `src/components/charts/AppointmentHourHistogram.tsx`, `src/components/charts/ReasonBreakdown.tsx`.

- [ ] `schedule.byAppointmentHour`: 0~23 bar 히스토그램.
- [ ] `withdrawal.byReason`: reason_id 매핑 테이블(없으면 id 노출) + note.
- [ ] 스냅샷 지표: "현재값 스냅샷·추세 참고" note 강조.
- [ ] commit.

### Task 4.4: 최종 검증 + 머지

- [ ] `npm run build`, `npm run typecheck`, `npm run lint`, `npm test` 전부 PASS.
- [ ] dev 서버 전체 클릭 스루(로그인→오버뷰→4영역), 콘솔 에러 0.
- [ ] `git push origin develop`.
- [ ] `git checkout main && git merge develop && git push origin main` (기능 완료 반영).

---

## Self-Review

- **Spec coverage**: §2 스택→P0/P1, §3 main/develop→Phase 구분, §4 폴더→0.5, §5 카탈로그/범용컴포넌트→P2/P3/P4, §6 데이터흐름→P2, §7 인증→1.3~1.5, §8 에러/결측→3.2/4.x note, §9 테스트→1.3/2.2 + 4.4, §10 위험(MSW/카카오키)→2.4/1.5. 누락 없음.
- **Placeholder**: 라우트 자리 placeholder 는 1.6 에서 의도적(이후 페이지가 대체), 코드 스텝은 구체값.
- **Type consistency**: `OverviewCard/MetricSeries/Delta` 타입(1.2)을 카드(3.2)·차트(4.1)·쿼리(2.3)가 동일 사용. `getMetric/metricsByArea`(2.1) 일관.
