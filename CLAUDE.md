# CLAUDE.md - 개발 가이드

## 명령어
- 개발 서버: `npm run dev` (Turbopack 사용)
- 빌드: `npm run build`
- 린트: `npm run lint` 
- 프로덕션 서버: `npm run start`

## 코드 스타일 가이드
- **TypeScript**: 모든 코드에 TypeScript 사용, interface 선호
- **명명 규칙**: 
  - 디렉토리: 소문자 대시 구분 (예: `auth-wizard`)
  - 컴포넌트: PascalCase, 함수: camelCase
  - 타입: PascalCase, 상수: UPPER_SNAKE_CASE
  - 훅: "use" 접두사 (예: useAuth)
- **구조**: FSD(Feature-Sliced Design) 아키텍처 사용
  - entities/ - 도메인 모델, 엔티티별 API
  - features/ - 비즈니스 로직, 기능별 컴포넌트
  - widgets/ - 재사용 가능한 복잡한 UI 컴포넌트
  - shared/ - 공통 유틸리티, 타입, 기본 기능
- **프로그래밍 방식**: 함수형/선언적 프로그래밍, 클래스 대신 함수 사용
- **React 컴포넌트**: 서버 컴포넌트 활용, 'use client' 최소화
- **데이터 페칭**: TanStack Query, Zod 유효성 검사
- **스타일링**: Tailwind CSS, Shadcn UI, Radix UI
- **폼 처리**: react-hook-form, zod 스키마
- **에러 처리**: try/catch 블록
- **언어**: 한국어로 응답