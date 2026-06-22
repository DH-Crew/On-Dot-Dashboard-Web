# On-Dot-Dashboard-Web

On-Dot 내부 분석 대시보드 프론트엔드 (React + TypeScript + Vite).

백엔드 `/analytics/**` 계약과 지표 카탈로그를 기반으로 성장/일정/알람/기능사용 지표를
카드 요약(전일·전주·전월 Δ)과 영역별 시계열 차트로 보여준다.

## 개발

```bash
npm install
cp .env.example .env   # 필요 시 값 채우기
npm run dev            # http://localhost:5180
```

| 스크립트 | 설명 |
|---|---|
| `npm run dev` | 개발 서버 |
| `npm run build` | 타입체크 + 프로덕션 빌드 |
| `npm run typecheck` | `tsc` 타입 체크 |
| `npm run lint` | ESLint |
| `npm test` | Vitest |

## 환경변수 (`.env`)

| 키 | 설명 |
|---|---|
| `VITE_API_BASE_URL` | On-Dot_BE 베이스 URL (비우면 동일 오리진) |
| `VITE_USE_MOCK` | `true` 면 MSW 목 사용 (백엔드 미구현 대응) |
| `VITE_KAKAO_JS_KEY` | 카카오 JS SDK 키 (비우면 dev 로그인 모드) |

## 문서

- 설계안: `docs/superpowers/specs/2026-06-23-ondot-dashboard-web-frontend-design.md`
- 구현 계획: `docs/superpowers/plans/2026-06-23-ondot-dashboard-web.md`

## 브랜치

- `main`: 기본 세팅(스캐폴드)
- `develop`: 기능 구현
