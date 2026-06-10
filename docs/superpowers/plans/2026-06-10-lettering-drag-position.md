# Lettering Drag Position Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 히어로 섹션의 레터링 블록을 편집 미리보기에서 마우스로 드래그해 위치를 자유롭게 조정할 수 있게 한다.

**Architecture:** `letteringPosition: { x, y } | null`을 데이터 모델에 추가하고, `InvitationView`에 드래그 props와 이벤트 핸들러를 추가한다. `null`이면 기존 하단 중앙 동작을 유지하고, 값이 있으면 절대 위치로 렌더링한다. `PreviewPanel`에서 레터링 섹션이 열릴 때만 드래그 모드를 활성화한다.

**Tech Stack:** React 19, TypeScript, Zustand, Next.js 16

---

## File Map

| 파일 | 변경 내용 |
|------|----------|
| `src/types/invitation.ts` | `letteringPosition` 필드 추가 |
| `src/lib/store.ts` | `DEFAULT`에 `letteringPosition: null` 추가 |
| `src/components/invitation/InvitationView.tsx` | props 추가, 히어로 절대 위치 렌더링, 드래그 로직 |
| `src/components/builder/PreviewPanel.tsx` | `isDragMode`, `onPositionChange` 전달 |

---

## Task 1: 데이터 모델 확장

**Files:**
- Modify: `src/types/invitation.ts`
- Modify: `src/lib/store.ts`

- [ ] **Step 1: `invitation.ts`에 `letteringPosition` 필드 추가**

`src/types/invitation.ts`의 `accentColor` 줄 아래에 추가:

```ts
  // 디자인 옵션
  letteringText: string
  letteringColor: string
  accentColor: string
  letteringPosition: { x: number; y: number } | null   // 히어로 내 % 좌표, null = 기본(하단 중앙)
```

- [ ] **Step 2: `store.ts` DEFAULT에 기본값 추가**

`src/lib/store.ts`의 `accentColor: '#c85070',` 줄 아래에 추가:

```ts
  accentColor: '#c85070',
  letteringPosition: null,
```

- [ ] **Step 3: 타입 검증**

```bash
npx tsc --noEmit
```

에러 없이 통과해야 함.

- [ ] **Step 4: 커밋**

```bash
git add src/types/invitation.ts src/lib/store.ts
git commit -m "feat: add letteringPosition field to InvitationData"
```

---

## Task 2: InvitationView — 히어로 절대 위치 렌더링 + 드래그 비주얼

**Files:**
- Modify: `src/components/invitation/InvitationView.tsx`

- [ ] **Step 1: props 인터페이스 및 import 수정**

파일 상단의 `import`와 `Props` 인터페이스를 아래와 같이 수정:

```tsx
'use client'

import { InvitationData } from '@/types/invitation'
import { TEMPLATES } from '@/lib/templates'
import { useRef } from 'react'

interface Props {
  data: InvitationData
  isPreview?: boolean
  isDragMode?: boolean
  onPositionChange?: (x: number, y: number) => void
}
```

- [ ] **Step 2: 컴포넌트 내부 — ref와 핸들러 플레이스홀더 추가**

`export default function InvitationView({ data, isPreview, isDragMode, onPositionChange }: Props) {` 바로 아래, 기존 변수들 위에 삽입:

```tsx
  const heroRef = useRef<HTMLElement>(null)
  const letteringRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const dragOffset = useRef({ x: 0, y: 0 })

  const handleMouseDown = (_e: React.MouseEvent) => {}
```

- [ ] **Step 3: 히어로 `<section>` 레이아웃 변경**

기존 히어로 `<section>` 여는 태그를 아래로 교체 (display:flex 관련 속성 제거, ref 추가):

```tsx
      {/* Hero */}
      <section
        ref={heroRef}
        style={{
          position: 'relative',
          height: isPreview ? 320 : '100svh',
          overflow: 'hidden',
        }}
      >
```

- [ ] **Step 4: 레터링 wrapper div 절대 위치로 변경**

기존 레터링 wrapper:
```tsx
        {/* Lettering */}
        <div style={{ position: 'relative', textAlign: 'center', zIndex: 1 }}>
```

아래로 교체:
```tsx
        {/* Lettering */}
        <div
          ref={letteringRef}
          style={{
            position: 'absolute',
            ...(data.letteringPosition
              ? {
                  left: `${data.letteringPosition.x}%`,
                  top: `${data.letteringPosition.y}%`,
                  transform: 'translate(-50%, -50%)',
                }
              : {
                  bottom: 40,
                  left: '50%',
                  transform: 'translateX(-50%)',
                }
            ),
            textAlign: 'center',
            zIndex: 1,
            cursor: isDragMode ? 'move' : 'default',
            outline: isDragMode ? '2px dashed rgba(255,255,255,0.6)' : 'none',
            outlineOffset: 6,
            borderRadius: 4,
            padding: isDragMode ? '6px 10px' : 0,
            userSelect: 'none',
          }}
          onMouseDown={handleMouseDown}
        >
```

- [ ] **Step 5: 타입 검증 및 개발 서버 확인**

```bash
npx tsc --noEmit
npm run dev
```

브라우저에서 `/edit/draft` 열고 레터링 블록이 기존과 동일하게 하단 중앙에 표시되는지 확인.

- [ ] **Step 6: 커밋**

```bash
git add src/components/invitation/InvitationView.tsx
git commit -m "feat: switch hero lettering to absolute positioning, add drag mode visuals"
```

---

## Task 3: 드래그 인터랙션 구현

**Files:**
- Modify: `src/components/invitation/InvitationView.tsx`

- [ ] **Step 1: `handleMouseDown` 전체 구현**

Task 2에서 추가한 `handleMouseDown` 플레이스홀더를 아래로 교체:

```tsx
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isDragMode || !heroRef.current || !letteringRef.current || !onPositionChange) return
    e.preventDefault()

    const hr = heroRef.current.getBoundingClientRect()
    const lr = letteringRef.current.getBoundingClientRect()

    // 포인터와 레터링 중심 사이의 오프셋 기록
    dragOffset.current = {
      x: e.clientX - (lr.left + lr.width / 2),
      y: e.clientY - (lr.top + lr.height / 2),
    }
    isDragging.current = true

    const onMove = (ev: MouseEvent) => {
      if (!isDragging.current || !heroRef.current || !letteringRef.current) return
      const hr = heroRef.current.getBoundingClientRect()
      const lr = letteringRef.current.getBoundingClientRect()
      const halfW = lr.width / 2
      const halfH = lr.height / 2

      // 히어로 기준 새 중심 좌표 (포인터 - 오프셋 - 히어로 원점)
      const rawX = ev.clientX - dragOffset.current.x - hr.left
      const rawY = ev.clientY - dragOffset.current.y - hr.top

      // 히어로 영역 내로 clamp (블록 절반 크기만큼 여백)
      const cx = Math.max(halfW, Math.min(hr.width - halfW, rawX))
      const cy = Math.max(halfH, Math.min(hr.height - halfH, rawY))

      onPositionChange(
        Math.round((cx / hr.width) * 100),
        Math.round((cy / hr.height) * 100),
      )
    }

    const onUp = () => {
      isDragging.current = false
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }
```

- [ ] **Step 2: 타입 검증**

```bash
npx tsc --noEmit
```

에러 없이 통과해야 함.

- [ ] **Step 3: 커밋**

```bash
git add src/components/invitation/InvitationView.tsx
git commit -m "feat: implement lettering drag interaction with hero boundary clamping"
```

---

## Task 4: PreviewPanel 연결

**Files:**
- Modify: `src/components/builder/PreviewPanel.tsx`

- [ ] **Step 1: PreviewPanel에서 store와 props 연결**

`src/components/builder/PreviewPanel.tsx` 전체를 아래로 교체:

```tsx
'use client'

import { useStore } from '@/lib/store'
import InvitationView from '@/components/invitation/InvitationView'

export default function PreviewPanel() {
  const { data, update, activeSection } = useStore()

  return (
    <div className="flex flex-col items-center gap-4">
      {/* 폰 프레임 */}
      <div
        className="relative bg-white shadow-2xl overflow-hidden"
        style={{
          width: 390,
          height: 720,
          borderRadius: 40,
          boxShadow: '0 32px 80px rgba(0,0,0,0.22), 0 0 0 1px rgba(0,0,0,0.08)',
        }}
      >
        {/* 상태바 notch */}
        <div className="absolute top-0 left-0 right-0 h-10 flex items-center justify-center z-50 pointer-events-none">
          <div className="w-28 h-6 bg-black rounded-full" />
        </div>
        {/* 청첩장 내용 (스크롤 가능) */}
        <div className="absolute inset-0 overflow-y-auto pt-10 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
          <InvitationView
            data={data}
            isPreview
            isDragMode={activeSection === 'lettering'}
            onPositionChange={(x, y) => update({ letteringPosition: { x, y } })}
          />
        </div>
      </div>
      <p className="text-xs text-zinc-400 font-light tracking-wide">실시간 미리보기</p>
    </div>
  )
}
```

- [ ] **Step 2: 최종 빌드 검증**

```bash
npm run build
```

에러 없이 빌드 완료해야 함.

- [ ] **Step 3: 수동 동작 확인**

```bash
npm run dev
```

브라우저에서 `/edit/draft` 열고:
1. 편집 패널에서 **레터링** 탭 클릭 → 미리보기 레터링 블록에 점선 테두리 + `move` 커서 표시 확인
2. 레터링 블록을 드래그 → 히어로 내에서 이동하고 히어로 경계 밖으로 나가지 않음 확인
3. 다른 탭(예: **사진**) 클릭 → 점선 테두리 사라지고 커서 원래대로 확인
4. 드래그한 위치에서 페이지 새로고침 → 위치가 초기화되는 것 확인 (Zustand는 메모리 상태이므로 정상)

- [ ] **Step 4: 커밋**

```bash
git add src/components/builder/PreviewPanel.tsx
git commit -m "feat: wire up lettering drag mode in PreviewPanel"
```
