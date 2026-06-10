# 레터링 드래그 위치 조정 — 설계 문서

**날짜:** 2026-06-10  
**범위:** 히어로 섹션 레터링 블록의 드래그 이동 기능

---

## 결정 사항

- 드래그는 편집 패널에서 **레터링 섹션이 열려 있을 때만** 활성화
- 리셋 버튼 없음 (다시 드래그로 재조정)
- 히어로 섹션 **경계 내로 이동 제한** (clamp)

---

## 데이터 모델

`src/types/invitation.ts`의 `InvitationData`에 추가:

```ts
letteringPosition: { x: number; y: number } | null
```

- `x`, `y`: 히어로 영역 내 백분율 (0~100)
- `null`: 기본 위치 (하단 중앙 — 현재 동작 유지)

`src/lib/store.ts`의 `DEFAULT`에 추가:

```ts
letteringPosition: null,
```

---

## `InvitationView` 변경

**새 props:**

```ts
isDragMode?: boolean
onPositionChange?: (x: number, y: number) => void
```

**히어로 레터링 블록 동작:**

| 상태 | 레이아웃 |
|------|---------|
| `letteringPosition === null` | 현재 그대로 — flex 컨테이너 하단 중앙 |
| `letteringPosition` 있음 | `position: absolute`, `left: x%`, `top: y%`, `transform: translate(-50%, -50%)` |
| `isDragMode === true` | 점선 테두리 + `cursor: move` 표시 |

**드래그 구현:**

1. 히어로 `<section>`에 `ref` 부착
2. 레터링 블록 `onMouseDown`:
   - `e.preventDefault()` (스크롤 충돌 방지)
   - 현재 포인터 위치와 블록 중심의 오프셋 기록
3. `window` 레벨 `mousemove`:
   - 히어로 rect 기준으로 새 x%, y% 계산
   - 블록 절반 크기 고려해 히어로 영역 내로 clamp
   - `onPositionChange(x, y)` 호출
4. `window` 레벨 `mouseup`: 이벤트 정리

> **터치:** 이번 범위에서는 마우스만 지원. 편집기는 데스크톱 중심.

---

## `PreviewPanel` 변경

```tsx
const { data, update, activeSection } = useStore()

<InvitationView
  data={data}
  isPreview
  isDragMode={activeSection === 'lettering'}
  onPositionChange={(x, y) => update({ letteringPosition: { x, y } })}
/>
```

---

## 공개 뷰 (`/i/[uuid]`)

변경 없음. `isDragMode`를 전달하지 않으면 `false`로 동작하고, 저장된 `letteringPosition`만 반영해 절대 위치로 표시.

---

## 영향 파일

| 파일 | 변경 내용 |
|------|----------|
| `src/types/invitation.ts` | `letteringPosition` 필드 추가 |
| `src/lib/store.ts` | `DEFAULT`에 `letteringPosition: null` 추가 |
| `src/components/invitation/InvitationView.tsx` | 드래그 로직 + 조건부 절대 위치 렌더링 |
| `src/components/builder/PreviewPanel.tsx` | `isDragMode`, `onPositionChange` 전달 |
