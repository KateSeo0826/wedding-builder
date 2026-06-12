import { create } from 'zustand'
import { InvitationData, TemplateId } from '@/types/invitation'
import { v4 as uuidv4 } from 'uuid'

const DEFAULT: InvitationData = {
  id: 'draft',
  templateId: 'poster-light',
  groom: { name: '박수용', fatherName: '박○○', motherName: '최○○', phone: '010-1234-1234' },
  bride: { name: '서동미', fatherName: '서○○', motherName: '박○○', phone: '010-4567-8901' },
  date: '2026-05-03',
  time: '12:30',
  venueName: '남산예술원 웨딩홀',
  venueAddress: '서울 용산구 소월로 375',
  venuePhone: '02-833-1234',
  transport: '6호선 한강진역 1번 출구 셔틀버스 (10~15분 간격)',
  groomAccount: { bank: '신한은행', number: '102-88-123456', holder: '박수용' },
  brideAccount:  { bank: '우리은행', number: '1002-582-123456', holder: '서동미' },
  inviteMessage: '서로가 마주보며 다져온 사랑을\n이제 함께 한 곳을 바라보며\n걸어가고자 합니다.\n\n저희 두 사람이 사랑으로 하나 되는 날,\n오셔서 축복해 주시면\n더없는 기쁨과 행복이 되겠습니다.',
  photos: [],
  letteringText: "We're getting Married!",
  letteringColor: '#ffffff',
  accentColor: '#c85070',
  letteringPosition: null,
  letteringTopPosition: null,
  letteringNamesPosition: null,
  letteringDatePosition: null,
  uuid: uuidv4(),
  createdAt: new Date().toISOString(),
  published: false,
}

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
