import { DoljanchiTemplateId } from '@/types/doljanchi'

export interface DoljanchiTemplate {
  id: DoljanchiTemplateId
  name: string
  description: string
  bg: string
  textColor: string
  accentColor: string
  thumbnail: string
}

export const DOLJANCHI_TEMPLATES: DoljanchiTemplate[] = [
  { id: 'pink-bloom',  name: '해피 버스데이', description: '화이트 오벌',   bg: '#FFFFFF', textColor: '#111111', accentColor: '#1C2D6E', thumbnail: '✦' },
  { id: 'first-year',  name: '퍼스트 버스데이', description: '핑크 그라디언트', bg: '#F2A0D2', textColor: '#FFFFFF', accentColor: '#D4A0EE', thumbnail: '🎀' },
  { id: 'happy-day',   name: '해피 데이',  description: '하늘빛 물결',  bg: '#FFFFFF', textColor: '#333333', accentColor: '#2b3d52', thumbnail: '✦' },
  { id: 'party-time',  name: '파티 타임',  description: '비비드 핑크',   bg: '#FF85B3', textColor: '#FFFFFF', accentColor: '#FF1493', thumbnail: '🎉' },
  { id: 'garden',      name: '가든',       description: '세이지 그린',   bg: '#C8D8C4', textColor: '#2D4A35', accentColor: '#5A8A6A', thumbnail: '🌿' },
  { id: 'classic',     name: '클래식',     description: '크림 엘레강스',  bg: '#F5EDE0', textColor: '#5C4033', accentColor: '#A0785A', thumbnail: '🎀' },
]
