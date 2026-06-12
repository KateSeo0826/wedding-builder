import { TemplateId } from '@/types/invitation'

export interface TemplateConfig {
  id: TemplateId
  name: string
  description: string
  bg: string          // tailwind bg class or hex
  textColor: string
  accentColor: string
  font: string        // google font name
  thumbnail: string   // emoji placeholder
  heroStyle: 'fullbleed' | 'split' | 'centered' | 'film'
}

export const TEMPLATES: TemplateConfig[] = [
  {
    id: 'poster-light',
    name: '포스터 라이트',
    description: '크림 배경 · 스크립트 레터링',
    bg: '#fffaf0',
    textColor: '#1a1410',
    accentColor: '#c85070',
    font: 'DM Serif Display',
    thumbnail: '🌸',
    heroStyle: 'fullbleed',
  },
  {
    id: 'poster-dark',
    name: '포스터 다크',
    description: '다크 틸 · 시네마틱',
    bg: '#0a1a1a',
    textColor: '#fffaf0',
    accentColor: '#ff4d8b',
    font: 'Cormorant Garamond',
    thumbnail: '🌙',
    heroStyle: 'fullbleed',
  },
  {
    id: 'film',
    name: '필름',
    description: '필름 그레인 · 빈티지',
    bg: '#1a1208',
    textColor: '#f5e6c8',
    accentColor: '#e8b94a',
    font: 'Playfair Display',
    thumbnail: '🎞️',
    heroStyle: 'film',
  },
  {
    id: 'editorial',
    name: '에디토리얼',
    description: '매거진 · 모던 세리프',
    bg: '#fdfaf7',
    textColor: '#1a1410',
    accentColor: '#c85070',
    font: 'DM Serif Display',
    thumbnail: '📖',
    heroStyle: 'split',
  },
  {
    id: 'minimal',
    name: '미니멀',
    description: '화이트 · 극도의 절제',
    bg: '#ffffff',
    textColor: '#111111',
    accentColor: '#888888',
    font: 'Inter',
    thumbnail: '◻️',
    heroStyle: 'centered',
  },
  {
    id: 'floral',
    name: '플로럴',
    description: '꽃 · 로맨틱',
    bg: '#fdf6f8',
    textColor: '#2a1520',
    accentColor: '#d4607a',
    font: 'Playfair Display',
    thumbnail: '🌷',
    heroStyle: 'fullbleed',
  },
  {
    id: 'classic',
    name: '클래식',
    description: '전통적인 우아함',
    bg: '#f8f4ee',
    textColor: '#2a2018',
    accentColor: '#8a6840',
    font: 'EB Garamond',
    thumbnail: '🎩',
    heroStyle: 'centered',
  },
  {
    id: 'modern',
    name: '모던',
    description: '산세리프 · 도시적',
    bg: '#f5f5f5',
    textColor: '#0a0a0a',
    accentColor: '#0a0a0a',
    font: 'Inter',
    thumbnail: '🏙️',
    heroStyle: 'split',
  },
  {
    id: 'romantic',
    name: '로맨틱',
    description: '웜톤 · 감성적',
    bg: '#fef0e8',
    textColor: '#2a1810',
    accentColor: '#e8704a',
    font: 'Cormorant Garamond',
    thumbnail: '💕',
    heroStyle: 'fullbleed',
  },
  {
    id: 'gallery',
    name: '갤러리',
    description: '사진 중심 · 콜라주',
    bg: '#0a0a0a',
    textColor: '#ffffff',
    accentColor: '#e8b94a',
    font: 'DM Serif Display',
    thumbnail: '🖼️',
    heroStyle: 'film',
  },
]

export const getTemplate = (id: TemplateId) =>
  TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0]
