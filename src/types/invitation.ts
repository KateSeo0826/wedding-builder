export type TemplateId =
  | 'poster-light'
  | 'poster-dark'
  | 'film'
  | 'editorial'
  | 'minimal'
  | 'floral'
  | 'classic'
  | 'modern'
  | 'romantic'
  | 'gallery'

export interface InvitationData {
  id: string
  templateId: TemplateId

  // 신랑/신부 정보
  groom: { name: string; fatherName: string; motherName: string; phone: string }
  bride: { name: string; fatherName: string; motherName: string; phone: string }

  // 예식 정보
  date: string        // ISO string
  time: string        // "12:30"
  venueName: string
  venueAddress: string
  venuePhone: string
  transport: string

  // 계좌
  groomAccount: { bank: string; number: string; holder: string }
  brideAccount:  { bank: string; number: string; holder: string }

  // 청첩 문구
  inviteMessage: string

  // 사진 (업로드된 URL 배열)
  photos: string[]    // [0]=hero, [1..]=gallery

  // 디자인 옵션
  letteringText: string
  letteringColor: string
  accentColor: string
  letteringPosition: { x: number; y: number } | null
  letteringTopPosition: { x: number; y: number } | null
  letteringNamesPosition: { x: number; y: number } | null
  letteringDatePosition: { x: number; y: number } | null

  // 공유
  uuid: string
  createdAt: string
  published: boolean
}

export type PartialInvitation = Partial<InvitationData> & { id: string }
