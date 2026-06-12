'use client'

import { useState } from 'react'
import { useDoljanchiStore } from '@/lib/doljanchi-store'
import { Copy, Check } from 'lucide-react'

function getOrigin() {
  if (typeof window === 'undefined') return ''
  return window.location.origin
}

function LinkRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard?.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className="mb-3">
      <div className="text-xs text-zinc-400 mb-1">{label}</div>
      <div className="flex items-center gap-2">
        <input readOnly value={value} className="flex-1 px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-700 truncate" />
        <button onClick={copy} className="flex-shrink-0 p-2 rounded-lg border border-zinc-200 hover:bg-zinc-50 transition-colors">
          {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-zinc-400" />}
        </button>
      </div>
    </div>
  )
}

export default function DoljanchiNav() {
  const { data, savedId, editToken, setSaved } = useDoljanchiStore()
  const [saving, setSaving] = useState(false)
  const [modal, setModal] = useState(false)

  const save = async (showModal: boolean) => {
    setSaving(true)
    try {
      const { photos: _p, ...dataWithoutPhotos } = data
      void _p
      if (savedId && editToken) {
        await fetch(`/api/doljanchi/${savedId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: dataWithoutPhotos, edit_token: editToken }),
        })
        if (showModal) setModal(true)
      } else {
        const res = await fetch('/api/doljanchi', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: dataWithoutPhotos }),
        })
        const json = await res.json()
        if (json.id && json.edit_token) {
          setSaved(json.id, json.edit_token)
          setModal(true)
        }
      }
    } finally {
      setSaving(false)
    }
  }

  const origin = getOrigin()
  const publicUrl = savedId ? `${origin}/doljanchi/i/${savedId}` : ''
  const editUrl = savedId && editToken ? `${origin}/doljanchi/edit/${savedId}?token=${editToken}` : ''

  return (
    <>
      <nav className="h-14 flex items-center justify-between px-5 border-b border-zinc-100 bg-white flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold text-zinc-900" style={{ fontFamily: "'DM Serif Display', serif", fontStyle: 'italic' }}>돌잔치</span>
          <span className="text-xs text-zinc-400 font-light">Builder</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => save(false)} disabled={saving}
            className="px-4 py-2 text-sm font-medium text-zinc-600 border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors disabled:opacity-50">
            {saving ? '저장 중...' : '저장'}
          </button>
          <button onClick={() => save(true)} disabled={saving}
            className="px-4 py-2 text-sm font-medium bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-colors disabled:opacity-50">
            공유하기
          </button>
        </div>
      </nav>

      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="text-center mb-5">
              <div className="text-2xl mb-2">🎉</div>
              <div className="text-base font-semibold text-zinc-900 mb-1">초대장이 저장됐어요!</div>
              <div className="text-xs text-zinc-500">편집 링크를 꼭 저장해 두세요.</div>
            </div>
            {publicUrl && <LinkRow label="공개 링크" value={publicUrl} />}
            {editUrl && <LinkRow label="편집 링크 (보관용)" value={editUrl} />}
            <p className="text-[10px] text-amber-600 bg-amber-50 rounded-lg px-3 py-2 mt-3">
              사진은 공유되지 않습니다. 편집 링크를 잃으면 수정이 불가능합니다.
            </p>
            <button onClick={() => setModal(false)}
              className="mt-4 w-full py-3 bg-zinc-900 text-white text-sm font-medium rounded-xl hover:bg-zinc-800 transition-colors">
              닫기
            </button>
          </div>
        </div>
      )}
    </>
  )
}
