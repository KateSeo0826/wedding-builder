# Supabase 저장 + Vercel 배포 — 설계 문서

**날짜:** 2026-06-10  
**범위:** Phase 1 — DB 저장 + 공개/편집 링크 + Vercel 배포 (사진 저장소 제외)

---

## 결정 사항

- 로그인 없음 — 누구나 청첩장 생성 가능
- 저장 후 **공개 링크** + **편집 토큰 링크** 발급
- 수정(UPDATE)은 서버 API Route에서 `edit_token` 대조 후 처리
- 사진은 Phase 1에서 공유되지 않음 (blob URL은 타 기기에서 동작 안 함)
- 접근법: API Route + Supabase service role (서버 쪽), anon key (클라이언트 읽기)

---

## 데이터 모델

### Supabase 테이블: `invitations`

```sql
CREATE TABLE invitations (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  edit_token uuid NOT NULL DEFAULT gen_random_uuid(),
  data       jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- 누구나 읽기
CREATE POLICY "public read" ON invitations
  FOR SELECT USING (true);

-- 누구나 생성
CREATE POLICY "public insert" ON invitations
  FOR INSERT WITH CHECK (true);
```

> UPDATE는 RLS로 처리하지 않음. service role key를 사용하는 API Route에서 `edit_token` 대조 후 수행.

### Zustand store 추가 필드

```ts
savedId: string | null    // 저장된 청첩장 UUID
editToken: string | null  // 수정 권한 토큰
```

---

## URL 구조

| URL | 설명 |
|-----|------|
| `/i/[id]` | 공개 링크 — 누구나 열람 |
| `/edit/[id]?token=[edit_token]` | 편집 링크 — 토큰 있어야 저장 가능 |

---

## API Routes

### `POST /api/invitations`

- 요청: `{ data: InvitationData }`
- 동작: Supabase에 INSERT (service role), photos 필드 제거 후 저장
- 응답: `{ id: string, edit_token: string }`

### `PATCH /api/invitations/[id]`

- 요청: `{ data: InvitationData, edit_token: string }`
- 동작: `id`로 조회 → `edit_token` 대조 → 일치하면 UPDATE
- 응답: `200 OK` or `403 Forbidden`

---

## 저장/편집 흐름

### 신규 저장

1. "공유하기" 또는 "저장" 클릭 (저장 전 상태)
2. `photos` 필드 제거 후 `POST /api/invitations`
3. 응답 `{ id, edit_token }` → store에 저장
4. 링크 모달 표시:
   - 공개 링크: `https://[도메인]/i/[id]`
   - 편집 링크: `https://[도메인]/edit/[id]?token=[edit_token]`
   - 경고: "사진은 공유되지 않습니다. 편집 링크를 꼭 저장해 두세요."

### 편집 후 저장

1. `/edit/[id]?token=[edit_token]` 접속
2. 서버에서 Supabase 조회 → 클라이언트에 전달 → store에 로드
3. 편집 후 "저장" 클릭 → `PATCH /api/invitations/[id]` (body에 `edit_token`)
4. 토큰 일치 → 저장 완료

### 버튼 상태별 동작

| 상태 | "저장" | "공유하기" |
|------|--------|-----------|
| 미저장 | 신규 저장 + 모달 | 신규 저장 + 모달 |
| 저장됨 | 조용히 업데이트 | 업데이트 + 모달 재표시 |

---

## 공개 페이지 (`/i/[id]`)

- 서버 컴포넌트로 전환
- `params.uuid`로 Supabase에서 `data` 조회
- 조회 실패 → 404 반환
- `InvitationView`에 data 전달

---

## 편집 페이지 (`/edit/[id]`)

- URL에서 `id`(path param)와 `token`(query param) 읽기
- `id`가 있으면 Supabase에서 데이터 조회 → 클라이언트 컴포넌트에 전달
- 클라이언트 컴포넌트에서 store에 로드 (`savedId`, `editToken` 포함)
- `id`가 없으면 기존처럼 새 청첩장 편집

---

## 파일 구조

### 새로 만드는 파일

| 파일 | 역할 |
|------|------|
| `src/lib/supabase.ts` | 클라이언트/서버용 Supabase 인스턴스 분리 |
| `src/app/api/invitations/route.ts` | POST — 신규 저장 |
| `src/app/api/invitations/[id]/route.ts` | PATCH — 수정 저장 |
| `.env.local.example` | 필요 환경변수 문서화 |

### 수정하는 파일

| 파일 | 변경 내용 |
|------|----------|
| `src/lib/store.ts` | `savedId: null`, `editToken: null` 기본값 추가 |
| `src/types/invitation.ts` | 변경 없음 (jsonb로 그대로 저장) |
| `src/app/i/[uuid]/page.tsx` | 서버 컴포넌트, Supabase 조회 |
| `src/app/edit/[id]/page.tsx` | id/token URL 파라미터 처리, 데이터 로드 |
| `src/components/builder/BuilderNav.tsx` | 저장/공유 버튼 + 링크 모달 |

---

## 환경변수

```bash
# .env.local (로컬) 및 Vercel 대시보드에 등록
NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...           # 클라이언트 읽기용
SUPABASE_SERVICE_ROLE_KEY=eyJ...               # API Route 쓰기용 (절대 클라이언트 노출 금지)
```

---

## Vercel 배포

1. Vercel 대시보드 → "Add New Project" → GitHub 저장소 연결
2. 환경변수 3개 등록
3. Deploy — Next.js 자동 감지, 별도 설정 파일 불필요
4. 이후 `main` 브랜치 push 시 자동 배포

---

## 알려진 제약 (Phase 1)

- **사진 공유 불가**: `URL.createObjectURL()` blob URL은 생성한 브라우저 세션에서만 유효. 저장 시 `photos` 필드 제거. Phase 2에서 Supabase Storage로 해결 예정.
- **편집 링크 분실 시 복구 불가**: 로그인이 없으므로 토큰을 잃으면 수정 방법 없음.
