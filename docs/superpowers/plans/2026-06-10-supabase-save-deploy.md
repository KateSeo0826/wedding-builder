# Supabase 저장 + Vercel 배포 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Supabase에 청첩장을 저장하고, 공개 링크와 편집 링크를 발급해 누구나 무료로 공유할 수 있게 한다.

**Architecture:** Next.js API Route가 Supabase service role로 쓰기를 담당하고 edit_token을 서버에서 검증한다. 공개 페이지는 서버 컴포넌트에서 Supabase anon key로 읽는다. 편집 페이지는 URL의 id/token을 서버에서 읽어 클라이언트 컴포넌트에 전달한다.

**Tech Stack:** Next.js 16 App Router, Supabase (PostgreSQL + RLS), Zustand, TypeScript, Vercel

---

## 사전 준비 (수동 — 코드 없음)

> 이 단계는 자동화할 수 없습니다. Supabase 대시보드에서 직접 수행하세요.

- [ ] **Step 1: Supabase 프로젝트 생성**

  https://supabase.com → "New project" 생성

- [ ] **Step 2: SQL 실행**

  Supabase 대시보드 → SQL Editor → 아래 SQL 실행:

  ```sql
  CREATE TABLE invitations (
    id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    edit_token uuid NOT NULL DEFAULT gen_random_uuid(),
    data       jsonb NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
  );

  ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "public read" ON invitations
    FOR SELECT USING (true);

  CREATE POLICY "public insert" ON invitations
    FOR INSERT WITH CHECK (true);
  ```

- [ ] **Step 3: 환경변수 수집**

  Supabase 대시보드 → Project Settings → API:
  - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
  - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

- [ ] **Step 4: `.env.local` 생성**

  프로젝트 루트에 `.env.local` 파일 생성 (git에 커밋하지 말 것):

  ```bash
  NEXT_PUBLIC_SUPABASE_URL=https://[your-project-id].supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
  SUPABASE_SERVICE_ROLE_KEY=eyJ...
  ```

---

## File Map

| 파일 | 액션 | 역할 |
|------|------|------|
| `src/lib/supabase.ts` | 생성 | 클라이언트/서버 Supabase 인스턴스 |
| `.env.local.example` | 생성 | 환경변수 문서 |
| `src/lib/store.ts` | 수정 | savedId, editToken, setSaved 추가 |
| `src/app/api/invitations/route.ts` | 생성 | POST — 신규 저장 |
| `src/app/api/invitations/[id]/route.ts` | 생성 | PATCH — 수정 저장 |
| `src/components/builder/BuilderNav.tsx` | 수정 | 저장/공유 버튼 + 링크 모달 |
| `src/app/i/[uuid]/page.tsx` | 수정 | 서버 컴포넌트, Supabase 읽기 |
| `src/components/builder/EditLoader.tsx` | 생성 | 클라이언트 — store 초기화 |
| `src/app/edit/[id]/page.tsx` | 수정 | 서버 컴포넌트, EditLoader에 data 전달 |

---

## Task 1: Supabase 클라이언트 설정

**Files:**
- Create: `src/lib/supabase.ts`
- Create: `.env.local.example`

- [ ] **Step 1: `src/lib/supabase.ts` 생성**

```ts
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// 클라이언트 컴포넌트 + 서버 컴포넌트 읽기용 (anon key)
export const supabase = createClient(url, anonKey)

// API Route 전용 — service role (절대 클라이언트에 노출 금지)
export function createServerClient() {
  return createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  })
}
```

- [ ] **Step 2: `.env.local.example` 생성**

```bash
NEXT_PUBLIC_SUPABASE_URL=https://[your-project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

- [ ] **Step 3: 타입 검증**

```bash
npx tsc --noEmit
```

에러 없이 통과해야 함.

- [ ] **Step 4: 커밋**

```bash
git add src/lib/supabase.ts .env.local.example
git commit -m "feat: add supabase client setup"
```

---

## Task 2: Store — savedId / editToken 추가

**Files:**
- Modify: `src/lib/store.ts`

- [ ] **Step 1: `Store` 인터페이스에 필드와 액션 추가**

기존 `Store` 인터페이스 (`interface Store { ... }`)를 아래로 교체:

```ts
interface Store {
  data: InvitationData
  activeSection: string
  savedId: string | null
  editToken: string | null
  update: (patch: Partial<InvitationData>) => void
  setTemplate: (id: TemplateId) => void
  setSection: (s: string) => void
  setSaved: (id: string, token: string) => void
  reset: () => void
}
```

- [ ] **Step 2: `useStore` 초기값과 액션에 추가**

`useStore` create 블록을 아래로 교체:

```ts
export const useStore = create<Store>((set) => ({
  data: DEFAULT,
  activeSection: 'template',
  savedId: null,
  editToken: null,
  update: (patch) => set((s) => ({ data: { ...s.data, ...patch } })),
  setTemplate: (id) => set((s) => ({ data: { ...s.data, templateId: id } })),
  setSection: (section) => set({ activeSection: section }),
  setSaved: (id, token) => set({ savedId: id, editToken: token }),
  reset: () => set({ data: DEFAULT, savedId: null, editToken: null }),
}))
```

- [ ] **Step 3: 타입 검증**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: 커밋**

```bash
git add src/lib/store.ts
git commit -m "feat: add savedId/editToken to store"
```

---

## Task 3: POST API Route — 신규 저장

**Files:**
- Create: `src/app/api/invitations/route.ts`

- [ ] **Step 1: 파일 생성**

```ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { InvitationData } from '@/types/invitation'

export async function POST(req: NextRequest) {
  const body = await req.json() as { data: InvitationData }

  // blob URL인 사진은 다른 기기에서 동작하지 않으므로 제거
  const { photos: _photos, ...dataWithoutPhotos } = body.data

  const db = createServerClient()
  const { data, error } = await db
    .from('invitations')
    .insert({ data: dataWithoutPhotos })
    .select('id, edit_token')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ id: data.id, edit_token: data.edit_token })
}
```

- [ ] **Step 2: 타입 검증 및 빌드 확인**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: 동작 확인 (개발 서버)**

```bash
npm run dev
```

별도 터미널에서:

```bash
curl -X POST http://localhost:3000/api/invitations \
  -H "Content-Type: application/json" \
  -d '{"data":{"id":"test","templateId":"poster-light","groom":{"name":"박수용","fatherName":"","motherName":"","phone":""},"bride":{"name":"서동미","fatherName":"","motherName":"","phone":""},"date":"2026-05-03","time":"12:30","venueName":"","venueAddress":"","venuePhone":"","transport":"","groomAccount":{"bank":"","number":"","holder":""},"brideAccount":{"bank":"","number":"","holder":""},"inviteMessage":"","photos":[],"letteringText":"We are getting Married!","letteringColor":"#ffffff","accentColor":"#c85070","letteringPosition":null,"uuid":"test-uuid","createdAt":"2026-06-10T00:00:00.000Z","published":false}}'
```

Expected: `{"id":"<uuid>","edit_token":"<uuid>"}` 형태 응답

- [ ] **Step 4: 커밋**

```bash
git add src/app/api/invitations/route.ts
git commit -m "feat: add POST /api/invitations route"
```

---

## Task 4: PATCH API Route — 수정 저장

**Files:**
- Create: `src/app/api/invitations/[id]/route.ts`

- [ ] **Step 1: 파일 생성**

```ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { InvitationData } from '@/types/invitation'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json() as { data: InvitationData; edit_token: string }
  const { photos: _photos, ...dataWithoutPhotos } = body.data

  const db = createServerClient()

  // edit_token 검증
  const { data: existing, error: fetchError } = await db
    .from('invitations')
    .select('edit_token')
    .eq('id', id)
    .single()

  if (fetchError || !existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  if (existing.edit_token !== body.edit_token) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { error } = await db
    .from('invitations')
    .update({ data: dataWithoutPhotos, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
```

- [ ] **Step 2: 타입 검증**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: 커밋**

```bash
git add src/app/api/invitations/[id]/route.ts
git commit -m "feat: add PATCH /api/invitations/[id] route"
```

---

## Task 5: BuilderNav — 저장/공유 버튼 + 링크 모달

**Files:**
- Modify: `src/components/builder/BuilderNav.tsx`

- [ ] **Step 1: `BuilderNav.tsx` 전체를 아래로 교체**

```tsx
'use client'

import { useStore } from '@/lib/store'
import { Eye, Share2, Save } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function BuilderNav() {
  const { data, savedId, editToken, setSaved } = useStore()
  const [saving, setSaving] = useState(false)
  const [modal, setModal] = useState<{ id: string; token: string } | null>(null)

  const origin = typeof window !== 'undefined' ? window.location.origin : ''

  async function saveToServer(): Promise<{ id: string; token: string } | null> {
    setSaving(true)
    try {
      if (savedId && editToken) {
        const res = await fetch(`/api/invitations/${savedId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data, edit_token: editToken }),
        })
        if (!res.ok) throw new Error('저장 실패')
        return { id: savedId, token: editToken }
      } else {
        const res = await fetch('/api/invitations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data }),
        })
        if (!res.ok) throw new Error('저장 실패')
        const json = await res.json()
        setSaved(json.id, json.edit_token)
        return { id: json.id, token: json.edit_token }
      }
    } catch {
      alert('저장 중 오류가 발생했습니다.')
      return null
    } finally {
      setSaving(false)
    }
  }

  async function handleSave() {
    await saveToServer()
  }

  async function handleShare() {
    const result = await saveToServer()
    if (result) setModal(result)
  }

  return (
    <>
      <header className="h-14 bg-white border-b border-zinc-200 flex items-center justify-between px-5 flex-shrink-0 z-10">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-serif italic text-zinc-800 text-lg tracking-tight">
            Wedding Builder
          </Link>
          <span className="text-zinc-300">|</span>
          <span className="text-sm text-zinc-500 font-light">
            {data.groom.name} &amp; {data.bride.name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/i/${data.uuid}`}
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
          >
            <Eye size={15} />
            미리보기
          </Link>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <Save size={15} />
            {saving ? '저장 중...' : '저장'}
          </button>
          <button
            onClick={handleShare}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-1.5 text-sm bg-zinc-900 text-white rounded-lg hover:bg-zinc-700 transition-colors disabled:opacity-50"
          >
            <Share2 size={15} />
            공유하기
          </button>
        </div>
      </header>

      {modal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setModal(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-zinc-900 mb-1">청첩장이 저장됐습니다 🎉</h2>
            <p className="text-sm text-zinc-500 mb-5">아래 링크를 복사해서 공유하세요.</p>

            <div className="space-y-3">
              <LinkRow label="공개 링크" url={`${origin}/i/${modal.id}`} />
              <LinkRow label="편집 링크" url={`${origin}/edit/${modal.id}?token=${modal.token}`} />
            </div>

            <p className="mt-4 text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
              ⚠️ 사진은 공유되지 않습니다. 편집 링크를 꼭 따로 저장해 두세요.
            </p>

            <button
              onClick={() => setModal(null)}
              className="mt-5 w-full py-2.5 text-sm font-medium bg-zinc-900 text-white rounded-xl hover:bg-zinc-700 transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </>
  )
}

function LinkRow({ label, url }: { label: string; url: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div>
      <p className="text-xs text-zinc-500 mb-1 font-medium">{label}</p>
      <div className="flex items-center gap-2">
        <input
          readOnly
          value={url}
          className="flex-1 px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-700 font-mono"
        />
        <button
          onClick={() => {
            navigator.clipboard.writeText(url)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
          }}
          className="px-3 py-2 text-xs bg-zinc-900 text-white rounded-lg hover:bg-zinc-700 transition-colors whitespace-nowrap"
        >
          {copied ? '복사됨' : '복사'}
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: 타입 검증**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: 커밋**

```bash
git add src/components/builder/BuilderNav.tsx
git commit -m "feat: wire up save/share buttons and link modal in BuilderNav"
```

---

## Task 6: 공개 페이지 (`/i/[uuid]`) — 서버 컴포넌트

**Files:**
- Modify: `src/app/i/[uuid]/page.tsx`

- [ ] **Step 1: `src/app/i/[uuid]/page.tsx` 전체를 아래로 교체**

```tsx
import { supabase } from '@/lib/supabase'
import InvitationView from '@/components/invitation/InvitationView'
import { notFound } from 'next/navigation'
import { InvitationData } from '@/types/invitation'

export default async function PublicInvitationPage({
  params,
}: {
  params: Promise<{ uuid: string }>
}) {
  const { uuid } = await params

  const { data, error } = await supabase
    .from('invitations')
    .select('data')
    .eq('id', uuid)
    .single()

  if (error || !data) notFound()

  const invitationData = data.data as InvitationData

  return (
    <div className="min-h-screen bg-zinc-900 flex items-start justify-center py-0">
      <div className="w-full max-w-[430px] min-h-screen">
        <InvitationView data={invitationData} />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: 타입 검증**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: 커밋**

```bash
git add src/app/i/[uuid]/page.tsx
git commit -m "feat: convert public invitation page to server component with Supabase fetch"
```

---

## Task 7: 편집 페이지 — EditLoader + URL 파라미터

**Files:**
- Create: `src/components/builder/EditLoader.tsx`
- Modify: `src/app/edit/[id]/page.tsx`

- [ ] **Step 1: `src/components/builder/EditLoader.tsx` 생성**

```tsx
'use client'

import { useEffect } from 'react'
import { useStore } from '@/lib/store'
import { InvitationData } from '@/types/invitation'
import PreviewPanel from '@/components/builder/PreviewPanel'
import EditPanel from '@/components/builder/EditPanel'
import BuilderNav from '@/components/builder/BuilderNav'

interface Props {
  initialData: InvitationData | null
  savedId: string | null
  editToken: string | null
}

export default function EditLoader({ initialData, savedId, editToken }: Props) {
  const { update, setSaved } = useStore()

  useEffect(() => {
    if (initialData) {
      update(initialData)
      if (savedId && editToken) setSaved(savedId, editToken)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-zinc-100">
      <BuilderNav />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex items-center justify-center bg-zinc-200 overflow-hidden">
          <PreviewPanel />
        </div>
        <div className="w-[380px] flex-shrink-0 bg-white border-l border-zinc-200 overflow-y-auto">
          <EditPanel />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: `src/app/edit/[id]/page.tsx` 전체를 아래로 교체**

```tsx
import { supabase } from '@/lib/supabase'
import EditLoader from '@/components/builder/EditLoader'
import { InvitationData } from '@/types/invitation'

export default async function EditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ token?: string }>
}) {
  const { id } = await params
  const { token } = await searchParams

  let initialData: InvitationData | null = null
  let savedId: string | null = null
  let editToken: string | null = null

  // id가 'draft'가 아닐 때만 Supabase에서 불러옴
  if (id !== 'draft') {
    const { data } = await supabase
      .from('invitations')
      .select('data')
      .eq('id', id)
      .single()

    if (data) {
      initialData = data.data as InvitationData
      savedId = id
      editToken = token ?? null
    }
  }

  return (
    <EditLoader initialData={initialData} savedId={savedId} editToken={editToken} />
  )
}
```

- [ ] **Step 3: 타입 검증 및 빌드**

```bash
npx tsc --noEmit
npm run build
```

빌드 에러 없이 완료해야 함.

- [ ] **Step 4: 커밋**

```bash
git add src/components/builder/EditLoader.tsx src/app/edit/[id]/page.tsx
git commit -m "feat: add EditLoader and load invitation from Supabase on edit page"
```

---

## Task 8: 최종 검증 + Push + Vercel 배포

**Files:** 없음 (배포 단계)

- [ ] **Step 1: 전체 빌드 최종 확인**

```bash
npm run build
```

Expected 출력 (에러 없음):
```
Route (app)
┌ ○ /
├ ○ /_not-found
├ ƒ /edit/[id]
├ ƒ /i/[uuid]
└ ƒ /api/invitations
   /api/invitations/[id]
```

- [ ] **Step 2: GitHub Push**

```bash
git push origin main
```

- [ ] **Step 3: Vercel 연결 (수동)**

  1. https://vercel.com → "Add New Project"
  2. GitHub 저장소 `KateSeo0826/wedding-builder` 선택
  3. Framework: Next.js 자동 감지 → 변경 불필요
  4. "Deploy" 클릭

- [ ] **Step 4: Vercel 환경변수 등록 (수동)**

  Vercel 대시보드 → Settings → Environment Variables:

  | Name | Value |
  |------|-------|
  | `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL |
  | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public key |
  | `SUPABASE_SERVICE_ROLE_KEY` | service_role key |

  등록 후 **Redeploy** 필수 (환경변수는 재배포 시 반영됨)

- [ ] **Step 5: 동작 확인**

  배포된 URL에서:
  1. `/edit/draft` 접속 → 편집 화면 열림
  2. "공유하기" 클릭 → 모달에 공개/편집 링크 표시
  3. 공개 링크 열기 → 청첩장 내용 표시 (사진 제외)
  4. 편집 링크 열기 → 기존 내용 로드 후 수정 가능
  5. 수정 후 "저장" → 공개 링크 다시 열면 수정 내용 반영
