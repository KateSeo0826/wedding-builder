'use client'

import { useStore } from '@/lib/store'
import { Eye, Share2, Save, ArrowLeft } from 'lucide-react'
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
          <Link href="/" className="flex items-center gap-1 px-2 py-1.5 text-sm text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors">
            <ArrowLeft size={15} />
            홈
          </Link>
          <span className="text-zinc-300">|</span>
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
