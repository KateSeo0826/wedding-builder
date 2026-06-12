'use client'
import { create } from 'zustand'
import { DoljanchiData, DoljanchiTemplateId } from '@/types/doljanchi'
import { v4 as uuidv4 } from 'uuid'

const DEFAULT: DoljanchiData = {
  id: 'draft',
  type: 'doljanchi',
  templateId: 'pink-bloom',
  babyName: '김윤우',
  birthDate: '2024-09-28',
  eventDate: '2025-09-28',
  eventTime: '12:00',
  venueName: '샬롬드하우스',
  venueAddress: '서울시 강남구 삼성동 123',
  fatherName: '김도연',
  motherName: '이지미',
  message: '우리 아이의 첫 번째 생일을 함께 축하해 주세요.',
  photos: [],
  uuid: uuidv4(),
  createdAt: new Date().toISOString(),
}

interface DoljanchiStore {
  data: DoljanchiData
  savedId: string | null
  editToken: string | null
  update: (patch: Partial<DoljanchiData>) => void
  setTemplate: (id: DoljanchiTemplateId) => void
  setSaved: (id: string, token: string) => void
  reset: () => void
}

export const useDoljanchiStore = create<DoljanchiStore>((set) => ({
  data: { ...DEFAULT, uuid: uuidv4(), createdAt: new Date().toISOString() },
  savedId: null,
  editToken: null,
  update: (patch) => set((s) => ({ data: { ...s.data, ...patch } })),
  setTemplate: (id) => set((s) => ({ data: { ...s.data, templateId: id } })),
  setSaved: (id, token) => set({ savedId: id, editToken: token }),
  reset: () => set({ data: { ...DEFAULT, uuid: uuidv4(), createdAt: new Date().toISOString() }, savedId: null, editToken: null }),
}))
