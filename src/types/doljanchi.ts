export type DoljanchiTemplateId =
  | 'pink-bloom'
  | 'first-year'
  | 'happy-day'
  | 'party-time'
  | 'garden'
  | 'classic'

export interface DoljanchiData {
  id: string
  type: 'doljanchi'
  templateId: DoljanchiTemplateId
  babyName: string
  birthDate: string
  eventDate: string
  eventTime: string
  venueName: string
  venueAddress: string
  fatherName: string
  motherName: string
  message: string
  photos: string[]
  uuid: string
  createdAt: string
}
