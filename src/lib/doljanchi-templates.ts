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
  { id: 'pink-bloom',  name: '핑크 블룸',  description: '플라워 핑크',   bg: '#FDE8E8', textColor: '#7A3A3A', accentColor: '#E87070', thumbnail: '🌸' },
  { id: 'first-year',  name: '퍼스트 이어', description: '스카이 블루',   bg: '#D4E8F5', textColor: '#1A4A6B', accentColor: '#5499C7', thumbnail: '⭐' },
  { id: 'happy-day',   name: '해피 데이',  description: '화이트 미니멀',  bg: '#FFFFFF', textColor: '#2A2A2A', accentColor: '#7B68EE', thumbnail: '✨' },
  { id: 'party-time',  name: '파티 타임',  description: '비비드 핑크',   bg: '#FF85B3', textColor: '#FFFFFF', accentColor: '#FF1493', thumbnail: '🎉' },
  { id: 'garden',      name: '가든',       description: '세이지 그린',   bg: '#C8D8C4', textColor: '#2D4A35', accentColor: '#5A8A6A', thumbnail: '🌿' },
  { id: 'classic',     name: '클래식',     description: '크림 엘레강스',  bg: '#F5EDE0', textColor: '#5C4033', accentColor: '#A0785A', thumbnail: '🎀' },
]
