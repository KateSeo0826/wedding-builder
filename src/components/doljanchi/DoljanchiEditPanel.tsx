'use client'

import { useDoljanchiStore } from '@/lib/doljanchi-store'
import { DOLJANCHI_TEMPLATES } from '@/lib/doljanchi-templates'
import { DoljanchiTemplateId } from '@/types/doljanchi'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

function Accordion({ title, children, open, toggle }: { title: string; children: React.ReactNode; open: boolean; toggle: () => void }) {
  return (
    <div className="border-b border-zinc-100">
      <button onClick={toggle} className="w-full flex items-center justify-between px-5 py-4 text-sm font-medium text-zinc-800 hover:bg-zinc-50 transition-colors">
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
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg bg-zinc-50 focus:outline-none focus:border-zinc-400 focus:bg-white transition-colors placeholder-zinc-300" />
    </div>
  )
}

export default function DoljanchiEditPanel() {
  const { data, update, setTemplate } = useDoljanchiStore()
  const [open, setOpen] = useState<string>('template')
  const toggle = (key: string) => setOpen(open === key ? '' : key)

  return (
    <div className="flex flex-col h-full">
      <Accordion title="템플릿 선택" open={open === 'template'} toggle={() => toggle('template')}>
        <div className="grid grid-cols-2 gap-2">
          {DOLJANCHI_TEMPLATES.map((t) => (
            <button key={t.id} onClick={() => setTemplate(t.id as DoljanchiTemplateId)}
              className={`flex flex-col items-start p-3 rounded-xl border-2 text-left transition-all ${
                data.templateId === t.id ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-100 hover:border-zinc-300'
              }`}>
              <div className="w-full aspect-[3/4] rounded-lg mb-2 flex items-center justify-center text-2xl"
                style={{ background: t.bg, color: t.accentColor }}>
                <span>{t.thumbnail}</span>
              </div>
              <div className="text-xs font-semibold text-zinc-800">{t.name}</div>
              <div className="text-[10px] text-zinc-400 mt-0.5 leading-tight">{t.description}</div>
            </button>
          ))}
        </div>
      </Accordion>

      <Accordion title="사진 업로드" open={open === 'photos'} toggle={() => toggle('photos')}>
        <label className="relative flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-zinc-200 rounded-xl cursor-pointer hover:border-zinc-400 transition-all overflow-hidden">
          {data.photos[0] ? (
            <>
              <img src={data.photos[0]} className="absolute inset-0 w-full h-full object-cover" alt="" />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <span className="text-white text-xs font-medium">사진 변경</span>
              </div>
            </>
          ) : (
            <>
              <span className="text-3xl mb-2">👶</span>
              <span className="text-xs text-zinc-500">아기 사진 업로드</span>
              <span className="text-[10px] text-zinc-400 mt-1">JPG, PNG · 최대 10MB</span>
            </>
          )}
          <input type="file" accept="image/*" className="hidden" onChange={(e) => {
            const file = e.target.files?.[0]
            if (!file) return
            const url = URL.createObjectURL(file)
            update({ photos: [url] })
          }} />
        </label>
      </Accordion>

      <Accordion title="아기 정보" open={open === 'baby'} toggle={() => toggle('baby')}>
        <Input label="아기 이름" value={data.babyName} onChange={(v) => update({ babyName: v })} placeholder="김윤우" />
        <Input label="생년월일" value={data.birthDate} onChange={(v) => update({ birthDate: v })} type="date" />
      </Accordion>

      <Accordion title="행사 정보" open={open === 'event'} toggle={() => toggle('event')}>
        <Input label="돌잔치 날짜" value={data.eventDate} onChange={(v) => update({ eventDate: v })} type="date" />
        <Input label="시간" value={data.eventTime} onChange={(v) => update({ eventTime: v })} type="time" />
        <Input label="장소 이름" value={data.venueName} onChange={(v) => update({ venueName: v })} placeholder="샬롬드하우스" />
        <Input label="주소" value={data.venueAddress} onChange={(v) => update({ venueAddress: v })} />
      </Accordion>

      <Accordion title="부모 정보" open={open === 'parents'} toggle={() => toggle('parents')}>
        <Input label="아빠 이름" value={data.fatherName} onChange={(v) => update({ fatherName: v })} />
        <Input label="엄마 이름" value={data.motherName} onChange={(v) => update({ motherName: v })} />
      </Accordion>
    </div>
  )
}
