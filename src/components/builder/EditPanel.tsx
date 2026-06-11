'use client'

import { useStore } from '@/lib/store'
import { TEMPLATES } from '@/lib/templates'
import { TemplateId } from '@/types/invitation'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

const SECTIONS = [
  { key: 'template', label: '템플릿' },
  { key: 'photos',   label: '사진' },
  { key: 'lettering', label: '레터링' },
  { key: 'couple',   label: '신랑 · 신부' },
  { key: 'date',     label: '날짜 · 장소' },
  { key: 'message',  label: '청첩 문구' },
  { key: 'account',  label: '계좌 안내' },
]

function Accordion({ title, children, open, toggle }: { title: string; children: React.ReactNode; open: boolean; toggle: () => void }) {
  return (
    <div className="border-b border-zinc-100">
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between px-5 py-4 text-sm font-medium text-zinc-800 hover:bg-zinc-50 transition-colors"
      >
        {title}
        {open ? <ChevronUp size={16} className="text-zinc-400" /> : <ChevronDown size={16} className="text-zinc-400" />}
      </button>
      {open && <div className="px-5 pb-5">{children}</div>}
    </div>
  )
}

function Input({ label, value, onChange, placeholder, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string
}) {
  return (
    <div className="mb-3">
      <label className="block text-xs text-zinc-500 mb-1.5 font-medium tracking-wide">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg bg-zinc-50 focus:outline-none focus:border-zinc-400 focus:bg-white transition-colors placeholder-zinc-300"
      />
    </div>
  )
}

function Textarea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="mb-3">
      <label className="block text-xs text-zinc-500 mb-1.5 font-medium tracking-wide">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg bg-zinc-50 focus:outline-none focus:border-zinc-400 focus:bg-white transition-colors resize-none leading-relaxed"
      />
    </div>
  )
}

export default function EditPanel() {
  const { data, update, setTemplate, activeSection, setSection } = useStore()
  const [open, setOpen] = useState<string>('template')

  const toggle = (key: string) => setOpen(open === key ? '' : key)

  return (
    <div className="flex flex-col h-full">
      {/* 섹션 탭 */}
      <div className="flex overflow-x-auto border-b border-zinc-100 bg-zinc-50 px-2 py-2 gap-1 flex-shrink-0" style={{ scrollbarWidth: 'none' }}>
        {SECTIONS.map((s) => (
          <button
            key={s.key}
            onClick={() => { setSection(s.key); setOpen(s.key) }}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeSection === s.key
                ? 'bg-zinc-900 text-white'
                : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-200'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* 템플릿 선택 */}
      <Accordion title="템플릿 선택" open={open === 'template'} toggle={() => toggle('template')}>
        <div className="grid grid-cols-2 gap-2">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTemplate(t.id as TemplateId)}
              className={`flex flex-col items-start p-3 rounded-xl border-2 text-left transition-all ${
                data.templateId === t.id
                  ? 'border-zinc-900 bg-zinc-50'
                  : 'border-zinc-100 hover:border-zinc-300'
              }`}
            >
              <div
                className="w-full aspect-[3/4] rounded-lg mb-2 flex items-center justify-center text-2xl"
                style={{ background: t.bg, color: t.textColor }}
              >
                <span>{t.thumbnail}</span>
              </div>
              <div className="text-xs font-semibold text-zinc-800">{t.name}</div>
              <div className="text-[10px] text-zinc-400 mt-0.5 leading-tight">{t.description}</div>
            </button>
          ))}
        </div>
      </Accordion>

      {/* 사진 업로드 */}
      <Accordion title="사진 업로드" open={open === 'photos'} toggle={() => toggle('photos')}>
        <div className="space-y-2">
          <label className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-zinc-200 rounded-xl cursor-pointer hover:border-zinc-400 transition-all overflow-hidden">
            {data.photos[0] ? (
              <>
                <img src={data.photos[0]} className="absolute inset-0 w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <span className="text-white text-xs font-medium">사진 변경</span>
                </div>
              </>
            ) : (
              <>
                <span className="text-2xl mb-2">📷</span>
                <span className="text-xs text-zinc-500">히어로 사진 업로드</span>
                <span className="text-[10px] text-zinc-400 mt-1">JPG, PNG · 최대 10MB</span>
              </>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => {
              const file = e.target.files?.[0]
              if (!file) return
              const url = URL.createObjectURL(file)
              const photos = [...data.photos]
              photos[0] = url
              update({ photos })
            }} />
          </label>
          <p className="text-xs text-zinc-400">갤러리 사진 (최대 4장)</p>
          <div className="grid grid-cols-4 gap-1.5">
            {[1,2,3,4].map((i) => (
              <label key={i} className="aspect-square rounded-lg border border-dashed border-zinc-200 flex items-center justify-center cursor-pointer hover:border-zinc-400 transition-all overflow-hidden">
                {data.photos[i] ? (
                  <img src={data.photos[i]} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-zinc-300 text-lg">+</span>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  const url = URL.createObjectURL(file)
                  const photos = [...data.photos]
                  photos[i] = url
                  update({ photos })
                }} />
              </label>
            ))}
          </div>
        </div>
      </Accordion>

      {/* 레터링 */}
      <Accordion title="레터링" open={open === 'lettering'} toggle={() => toggle('lettering')}>
        <Input label="레터링 문구" value={data.letteringText} onChange={(v) => update({ letteringText: v })} placeholder="We're getting Married!" />
        <div className="mb-3">
          <label className="block text-xs text-zinc-500 mb-1.5 font-medium tracking-wide">레터링 색상</label>
          <div className="flex items-center gap-2">
            <input type="color" value={data.letteringColor} onChange={(e) => update({ letteringColor: e.target.value })}
              className="w-10 h-10 rounded-lg border border-zinc-200 cursor-pointer p-0.5" />
            <span className="text-sm text-zinc-600 font-mono">{data.letteringColor}</span>
          </div>
        </div>
        <div className="mb-3">
          <label className="block text-xs text-zinc-500 mb-1.5 font-medium tracking-wide">포인트 컬러</label>
          <div className="flex items-center gap-2">
            <input type="color" value={data.accentColor} onChange={(e) => update({ accentColor: e.target.value })}
              className="w-10 h-10 rounded-lg border border-zinc-200 cursor-pointer p-0.5" />
            <span className="text-sm text-zinc-600 font-mono">{data.accentColor}</span>
          </div>
        </div>
      </Accordion>

      {/* 신랑/신부 */}
      <Accordion title="신랑 · 신부" open={open === 'couple'} toggle={() => toggle('couple')}>
        <p className="text-xs text-zinc-400 mb-3 font-medium">신랑 정보</p>
        <Input label="신랑 이름" value={data.groom.name} onChange={(v) => update({ groom: { ...data.groom, name: v } })} />
        <Input label="아버지" value={data.groom.fatherName} onChange={(v) => update({ groom: { ...data.groom, fatherName: v } })} />
        <Input label="어머니" value={data.groom.motherName} onChange={(v) => update({ groom: { ...data.groom, motherName: v } })} />
        <Input label="연락처" value={data.groom.phone} onChange={(v) => update({ groom: { ...data.groom, phone: v } })} type="tel" />
        <div className="border-t border-zinc-100 my-4" />
        <p className="text-xs text-zinc-400 mb-3 font-medium">신부 정보</p>
        <Input label="신부 이름" value={data.bride.name} onChange={(v) => update({ bride: { ...data.bride, name: v } })} />
        <Input label="아버지" value={data.bride.fatherName} onChange={(v) => update({ bride: { ...data.bride, fatherName: v } })} />
        <Input label="어머니" value={data.bride.motherName} onChange={(v) => update({ bride: { ...data.bride, motherName: v } })} />
        <Input label="연락처" value={data.bride.phone} onChange={(v) => update({ bride: { ...data.bride, phone: v } })} type="tel" />
      </Accordion>

      {/* 날짜/장소 */}
      <Accordion title="날짜 · 장소" open={open === 'date'} toggle={() => toggle('date')}>
        <Input label="날짜" value={data.date} onChange={(v) => update({ date: v })} type="date" />
        <Input label="시간" value={data.time} onChange={(v) => update({ time: v })} type="time" />
        <div className="border-t border-zinc-100 my-3" />
        <Input label="예식장 이름" value={data.venueName} onChange={(v) => update({ venueName: v })} />
        <Input label="주소" value={data.venueAddress} onChange={(v) => update({ venueAddress: v })} />
        <Input label="예식장 연락처" value={data.venuePhone} onChange={(v) => update({ venuePhone: v })} />
        <Textarea label="교통 안내" value={data.transport} onChange={(v) => update({ transport: v })} />
      </Accordion>

      {/* 청첩 문구 */}
      <Accordion title="청첩 문구" open={open === 'message'} toggle={() => toggle('message')}>
        <Textarea label="문구" value={data.inviteMessage} onChange={(v) => update({ inviteMessage: v })} />
      </Accordion>

      {/* 계좌 */}
      <Accordion title="계좌 안내" open={open === 'account'} toggle={() => toggle('account')}>
        <p className="text-xs text-zinc-400 mb-3 font-medium">신랑측</p>
        <Input label="은행" value={data.groomAccount.bank} onChange={(v) => update({ groomAccount: { ...data.groomAccount, bank: v } })} />
        <Input label="계좌번호" value={data.groomAccount.number} onChange={(v) => update({ groomAccount: { ...data.groomAccount, number: v } })} />
        <div className="border-t border-zinc-100 my-3" />
        <p className="text-xs text-zinc-400 mb-3 font-medium">신부측</p>
        <Input label="은행" value={data.brideAccount.bank} onChange={(v) => update({ brideAccount: { ...data.brideAccount, bank: v } })} />
        <Input label="계좌번호" value={data.brideAccount.number} onChange={(v) => update({ brideAccount: { ...data.brideAccount, number: v } })} />
      </Accordion>
    </div>
  )
}
