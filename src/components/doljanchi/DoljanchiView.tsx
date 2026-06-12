'use client'

import { DoljanchiData } from '@/types/doljanchi'
import { DOLJANCHI_TEMPLATES } from '@/lib/doljanchi-templates'

interface Props {
  data: DoljanchiData
  isPreview?: boolean
}

function fmt(dateStr: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

function fmtFull(dateStr: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })
}

function fmtTime(t: string) {
  if (!t) return ''
  const [h, m] = t.split(':').map(Number)
  return `${h < 12 ? '오전' : '오후'} ${h % 12 || 12}시${m ? ' ' + m + '분' : ''}`
}

export default function DoljanchiView({ data, isPreview }: Props) {
  const photo = data.photos[0]
  const s = isPreview
  const tpl = DOLJANCHI_TEMPLATES.find(t => t.id === data.templateId) ?? DOLJANCHI_TEMPLATES[0]
  void tpl

  // ── Template 1: Happy First Birthday ──────────────────────────
  if (data.templateId === 'pink-bloom') {
    const stars: { top?: string; left?: string; right?: string; bottom?: string; size: number; delay: string }[] = [
      { top: '6%',  left: '5%',   size: s ? 9 : 14,  delay: '0s'   },
      { top: '9%',  right: '7%',  size: s ? 11 : 17, delay: '0.7s' },
      { top: '22%', left: '3%',   size: s ? 7 : 11,  delay: '1.4s' },
      { top: '28%', right: '4%',  size: s ? 8 : 12,  delay: '0.3s' },
      { top: '50%', left: '4%',   size: s ? 6 : 9,   delay: '1.8s' },
      { top: '52%', right: '5%',  size: s ? 7 : 10,  delay: '1.1s' },
      { bottom: '22%', left: '8%',  size: s ? 8 : 13, delay: '0.5s' },
      { bottom: '20%', right: '9%', size: s ? 6 : 10, delay: '2.2s' },
    ]
    const evtDate = data.eventDate ? new Date(data.eventDate) : null
    const mm = evtDate ? String(evtDate.getMonth() + 1).padStart(2, '0') : '--'
    const dd = evtDate ? String(evtDate.getDate()).padStart(2, '0') : '--'
    const photoW = s ? 148 : 216
    const photoH = s ? 188 : 274

    return (
      <div style={{
        minHeight: s ? undefined : '100svh',
        height: s ? '100%' : undefined,
        background: '#FFFFFF',
        fontFamily: "'Noto Serif KR', serif",
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: s ? '22px 18px 20px' : '44px 28px 36px',
        boxSizing: 'border-box',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Scattered ✦ stars with twinkle animation */}
        {stars.map((st, i) => (
          <span key={i} className="doljanchi-star" style={{
            position: 'absolute', top: st.top, left: st.left, right: st.right, bottom: st.bottom,
            color: '#1C2D6E', fontSize: st.size, lineHeight: 1, animationDelay: st.delay,
          }}>✦</span>
        ))}

        {/* Title */}
        <div style={{
          fontSize: s ? 13 : 20,
          fontFamily: "'DM Serif Display', serif",
          fontStyle: 'italic',
          color: '#1a1a1a',
          letterSpacing: '0.02em',
          marginBottom: s ? 16 : 28,
          textAlign: 'center',
          position: 'relative', zIndex: 1,
        }}>
          Happy First Birthday
        </div>

        {/* Oval portrait photo + navy date badge */}
        <div style={{ position: 'relative', marginBottom: s ? 16 : 26, flexShrink: 0 }}>
          <div style={{
            width: photoW, height: photoH,
            borderRadius: '50%',
            overflow: 'hidden',
            background: '#e0e0e0',
            boxShadow: '0 6px 24px rgba(0,0,0,0.10)',
          }}>
            {photo
              ? <img src={photo} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} alt="" />
              : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: s ? 36 : 54, opacity: 0.2 }}>👶</div>
            }
          </div>
          {/* Navy date badge */}
          <div style={{
            position: 'absolute', bottom: s ? -8 : -12, right: s ? -10 : -16,
            width: s ? 46 : 68, height: s ? 46 : 68,
            borderRadius: '50%', background: '#1C2D6E',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(28,45,110,0.35)', zIndex: 2,
          }}>
            <span style={{ fontSize: s ? 10 : 14, color: '#fff', fontWeight: 700, lineHeight: 1, fontFamily: "'Noto Sans KR', sans-serif" }}>{mm}</span>
            <div style={{ width: s ? 18 : 26, height: 0.5, background: 'rgba(255,255,255,0.45)', margin: `${s ? 2 : 3}px 0` }} />
            <span style={{ fontSize: s ? 10 : 14, color: '#fff', fontWeight: 700, lineHeight: 1, fontFamily: "'Noto Sans KR', sans-serif" }}>{dd}</span>
          </div>
        </div>

        {/* Baby name */}
        <div style={{
          fontSize: s ? 22 : 34, fontWeight: 700, color: '#111111',
          letterSpacing: '0.02em', marginBottom: s ? 8 : 12,
          textAlign: 'center', position: 'relative', zIndex: 1,
        }}>{data.babyName}</div>

        <div style={{ fontSize: s ? 10 : 14, color: '#444', marginBottom: s ? 3 : 5, textAlign: 'center' }}>{fmtFull(data.eventDate)}</div>
        <div style={{ fontSize: s ? 10 : 13, color: '#666', marginBottom: s ? 3 : 5, textAlign: 'center' }}>{fmtTime(data.eventTime)}</div>
        <div style={{ fontSize: s ? 10 : 13, color: '#777', marginBottom: s ? 8 : 12, textAlign: 'center' }}>{data.venueName}</div>

        {(data.fatherName || data.motherName) && (
          <div style={{ display: 'flex', gap: s ? 18 : 28, fontSize: s ? 9 : 12, color: '#888', position: 'relative', zIndex: 1 }}>
            {data.fatherName && <span><span style={{ opacity: 0.55, marginRight: 3 }}>아빠</span>{data.fatherName}</span>}
            {data.motherName && <span><span style={{ opacity: 0.55, marginRight: 3 }}>엄마</span>{data.motherName}</span>}
          </div>
        )}
      </div>
    )
  }

  // ── Template 2: First Birthday (pink gradient, arch photo, orbital rings) ──
  if (data.templateId === 'first-year') {
    const photoW = s ? 148 : 208
    const photoH = s ? 186 : 260
    const archR = photoW / 2

    return (
      <div style={{
        minHeight: s ? undefined : '100svh',
        height: s ? '100%' : undefined,
        background: 'linear-gradient(145deg, #FFB3C6 0%, #F2A0D2 45%, #D4A0EE 100%)',
        fontFamily: "'Noto Sans KR', sans-serif",
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: s ? '20px 18px 20px' : '40px 28px 36px',
        boxSizing: 'border-box',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* FIRST BIRTHDAY header */}
        <div style={{ textAlign: 'center', marginBottom: s ? 14 : 22, position: 'relative', zIndex: 1 }}>
          <div style={{
            fontSize: s ? 11 : 16, fontWeight: 600,
            color: 'rgba(255,255,255,0.92)',
            letterSpacing: '0.22em', textTransform: 'uppercase' as const,
            lineHeight: 1.65,
          }}>
            FIRST BIRTHDAY<br />FIRST BIRTHDAY
          </div>
        </div>

        {/* Arch photo + orbital rings */}
        <div style={{ position: 'relative', marginBottom: s ? 14 : 22, flexShrink: 0 }}>
          {/* Ring 1 — slow rotation */}
          <div className="doljanchi-ring1" style={{
            position: 'absolute', top: '50%', left: '50%',
            width: photoW * 1.5, height: photoW * 0.36,
            border: `${s ? 1 : 1.5}px solid rgba(255,255,255,0.65)`,
            borderRadius: '50%',
            pointerEvents: 'none',
          }} />
          {/* Ring 2 — slower, different angle */}
          <div className="doljanchi-ring2" style={{
            position: 'absolute', top: '50%', left: '50%',
            width: photoW * 1.3, height: photoW * 0.44,
            border: `${s ? 1 : 1.5}px solid rgba(255,255,255,0.4)`,
            borderRadius: '50%',
            pointerEvents: 'none',
          }} />

          {/* Stars near rings with twinkle */}
          <span className="doljanchi-star" style={{ position: 'absolute', top: '18%', right: s ? -14 : -20, fontSize: s ? 8 : 11, color: 'rgba(255,255,255,0.9)', animationDelay: '0.5s', zIndex: 3 }}>✦</span>
          <span className="doljanchi-star" style={{ position: 'absolute', bottom: '30%', left: s ? -12 : -18, fontSize: s ? 7 : 10, color: 'rgba(255,255,255,0.75)', animationDelay: '1.5s', zIndex: 3 }}>✦</span>
          <span className="doljanchi-star" style={{ position: 'absolute', top: '60%', right: s ? -9 : -13, fontSize: s ? 6 : 9, color: 'rgba(255,255,255,0.65)', animationDelay: '1s', zIndex: 3 }}>★</span>
          <span className="doljanchi-star" style={{ position: 'absolute', top: '5%', left: s ? -8 : -12, fontSize: s ? 6 : 8, color: 'rgba(255,255,255,0.6)', animationDelay: '2s', zIndex: 3 }}>✦</span>

          {/* Arch photo frame */}
          <div style={{
            width: photoW, height: photoH,
            borderRadius: `${archR}px ${archR}px 0 0`,
            overflow: 'hidden',
            background: 'rgba(255,255,255,0.2)',
            border: `${s ? 2 : 3}px solid rgba(255,255,255,0.7)`,
            boxSizing: 'border-box',
            position: 'relative', zIndex: 1,
          }}>
            {photo
              ? <img src={photo} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} alt="" />
              : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: s ? 32 : 48, opacity: 0.4 }}>👶</div>
            }
          </div>
        </div>

        {/* Baby name */}
        <div style={{
          fontSize: s ? 26 : 40,
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic',
          fontWeight: 400,
          color: '#fff',
          letterSpacing: '0.04em',
          lineHeight: 1.15,
          textAlign: 'center',
          textShadow: '0 2px 10px rgba(180,60,140,0.3)',
          marginBottom: s ? 5 : 8,
          position: 'relative', zIndex: 1,
        }}>{data.babyName}</div>

        {/* Date pill */}
        <div style={{
          display: 'inline-block',
          background: 'rgba(255,255,255,0.22)',
          border: '1px solid rgba(255,255,255,0.5)',
          borderRadius: 20,
          padding: s ? '3px 12px' : '4px 18px',
          fontSize: s ? 9 : 12, color: '#fff',
          letterSpacing: '0.06em',
          marginBottom: s ? 10 : 14,
          position: 'relative', zIndex: 1,
        }}>{fmt(data.eventDate)}</div>

        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: s ? 10 : 13, color: 'rgba(255,255,255,0.85)', marginBottom: 3 }}>{fmtFull(data.eventDate)}</div>
          <div style={{ fontSize: s ? 10 : 12, color: 'rgba(255,255,255,0.75)', marginBottom: 3 }}>{fmtTime(data.eventTime)}</div>
          <div style={{ fontSize: s ? 10 : 12, color: 'rgba(255,255,255,0.7)', marginBottom: s ? 8 : 12 }}>{data.venueName}</div>
          {(data.fatherName || data.motherName) && (
            <div style={{ display: 'flex', gap: s ? 16 : 24, fontSize: s ? 9 : 11, color: 'rgba(255,255,255,0.65)', justifyContent: 'center' }}>
              {data.fatherName && <span><span style={{ opacity: 0.7, marginRight: 2 }}>아빠</span>{data.fatherName}</span>}
              {data.motherName && <span><span style={{ opacity: 0.7, marginRight: 2 }}>엄마</span>{data.motherName}</span>}
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── Template 3: Happy Day ──────────────────────────────────
  if (data.templateId === 'happy-day') {
    const stars = [
      { top: '8%', left: '8%', size: s ? 10 : 16 },
      { top: '12%', right: '10%', size: s ? 8 : 13 },
      { top: '40%', left: '5%', size: s ? 6 : 10 },
      { top: '45%', right: '6%', size: s ? 8 : 13 },
      { bottom: '20%', left: '12%', size: s ? 7 : 11 },
      { bottom: '18%', right: '14%', size: s ? 6 : 10 },
    ]
    return (
      <div style={{
        minHeight: s ? undefined : '100svh',
        height: s ? '100%' : undefined,
        background: '#FFFFFF',
        fontFamily: "'Noto Serif KR', serif",
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: s ? '28px 20px 24px' : '56px 32px 40px',
        boxSizing: 'border-box',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Stars */}
        {stars.map((st, i) => (
          <div key={i} style={{ position: 'absolute', top: (st as { top?: string }).top, left: (st as { left?: string }).left, right: (st as { right?: string }).right, bottom: (st as { bottom?: string }).bottom, color: '#7B68EE', opacity: 0.5, lineHeight: 1, fontSize: st.size }}>✦</div>
        ))}
        {/* Title */}
        <div style={{ fontSize: s ? 11 : 16, color: '#7B68EE', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: s ? 16 : 24, fontFamily: "'DM Serif Display', serif", fontStyle: 'italic' }}>
          Happy First Birthday
        </div>
        {/* Photo with double ring */}
        <div style={{ position: 'relative', marginBottom: s ? 16 : 28 }}>
          <div style={{
            width: s ? 150 : 220, height: s ? 150 : 220,
            borderRadius: '50%',
            border: `${s ? 2 : 3}px solid #7B68EE`,
            padding: s ? 4 : 6,
            boxSizing: 'border-box',
          }}>
            <div style={{
              width: '100%', height: '100%',
              borderRadius: '50%',
              border: `${s ? 2 : 3}px solid #B5B0F0`,
              overflow: 'hidden',
              background: '#EDE9FF',
            }}>
              {photo
                ? <img src={photo} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} alt="" />
                : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: s ? 32 : 48, opacity: 0.35 }}>👶</div>
              }
            </div>
          </div>
        </div>
        {/* Text */}
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: s ? 24 : 38, fontWeight: 700, color: '#2A2A2A', letterSpacing: '-0.02em', marginBottom: s ? 8 : 12 }}>{data.babyName}</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#7B68EE', borderRadius: 20, padding: s ? '4px 12px' : '6px 16px', marginBottom: s ? 10 : 16 }}>
            <span style={{ fontSize: s ? 9 : 12, color: '#fff', letterSpacing: '0.06em' }}>{fmt(data.eventDate)}</span>
          </div>
          <div style={{ fontSize: s ? 10 : 14, color: '#555', marginBottom: 4 }}>{fmtFull(data.eventDate)} · {fmtTime(data.eventTime)}</div>
          <div style={{ fontSize: s ? 10 : 13, color: '#666', marginBottom: s ? 4 : 6 }}>{data.venueName}</div>
          {(data.fatherName || data.motherName) && (
            <div style={{ fontSize: s ? 9 : 12, color: '#888' }}>
              {data.fatherName}{data.fatherName && data.motherName ? ' · ' : ''}{data.motherName}
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── Template 4: Party Time ──────────────────────────────────
  if (data.templateId === 'party-time') {
    return (
      <div style={{
        minHeight: s ? undefined : '100svh',
        height: s ? '100%' : undefined,
        background: '#FF85B3',
        fontFamily: "'Noto Sans KR', sans-serif",
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: s ? '28px 20px 24px' : '56px 32px 40px',
        boxSizing: 'border-box',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Repeating text background */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexWrap: 'wrap', alignContent: 'flex-start',
          padding: '8px', gap: '4px 8px',
          opacity: 0.15, pointerEvents: 'none', overflow: 'hidden',
        }}>
          {Array.from({ length: 40 }).map((_, i) => (
            <span key={i} style={{ fontSize: s ? 8 : 11, color: '#fff', fontWeight: 900, letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>
              FIRST BIRTHDAY
            </span>
          ))}
        </div>
        {/* Top label */}
        <div style={{ fontSize: s ? 10 : 14, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.18em', marginBottom: s ? 14 : 22, textTransform: 'uppercase', fontWeight: 600, position: 'relative' }}>
          First Birthday
        </div>
        {/* Photo circle with white border */}
        <div style={{
          width: s ? 160 : 240, height: s ? 160 : 240,
          borderRadius: '50%',
          border: '6px solid #fff',
          boxShadow: '0 0 0 3px rgba(255,255,255,0.4), 0 12px 40px rgba(255,20,147,0.3)',
          overflow: 'hidden', background: '#FF6B9D',
          marginBottom: s ? 16 : 26,
          flexShrink: 0, position: 'relative',
        }}>
          {photo
            ? <img src={photo} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} alt="" />
            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: s ? 32 : 48, opacity: 0.5 }}>👶</div>
          }
        </div>
        {/* Text */}
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: s ? 24 : 38, fontWeight: 900, color: '#fff', letterSpacing: '-0.01em', marginBottom: s ? 8 : 12, textShadow: '0 2px 8px rgba(255,20,147,0.3)' }}>
            {data.babyName}
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', background: '#1A1A1A', borderRadius: 20, padding: s ? '4px 14px' : '6px 20px', marginBottom: s ? 10 : 16 }}>
            <span style={{ fontSize: s ? 10 : 14, color: '#fff', fontWeight: 700 }}>{fmt(data.eventDate)}</span>
          </div>
          <div style={{ fontSize: s ? 10 : 13, color: 'rgba(255,255,255,0.85)', marginBottom: 4 }}>{fmtFull(data.eventDate)} · {fmtTime(data.eventTime)}</div>
          <div style={{ fontSize: s ? 10 : 13, color: 'rgba(255,255,255,0.75)', marginBottom: s ? 4 : 6 }}>{data.venueName}</div>
          {(data.fatherName || data.motherName) && (
            <div style={{ fontSize: s ? 9 : 12, color: 'rgba(255,255,255,0.6)' }}>
              {data.fatherName}{data.fatherName && data.motherName ? ' · ' : ''}{data.motherName}
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── Template 5: Garden ──────────────────────────────────
  if (data.templateId === 'garden') {
    return (
      <div style={{
        minHeight: s ? undefined : '100svh',
        height: s ? '100%' : undefined,
        background: 'linear-gradient(160deg, #C8D8C4 0%, #B8CCB4 100%)',
        fontFamily: "'Noto Serif KR', serif",
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: s ? '24px 20px 20px' : '48px 32px 36px',
        boxSizing: 'border-box',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Header text */}
        <div style={{ textAlign: 'center', marginBottom: s ? 16 : 26, position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: s ? 9 : 12, color: '#2D4A35', opacity: 0.65, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 4 }}>Invitation</div>
          <div style={{ fontSize: s ? 11 : 15, color: '#2D4A35', opacity: 0.8, letterSpacing: '0.04em' }}>베이비의 돌잔치에 초대합니다</div>
        </div>
        {/* Photo square */}
        <div style={{
          width: s ? 180 : 270, height: s ? 180 : 270,
          borderRadius: s ? 16 : 24,
          overflow: 'hidden', background: '#A8C5A0',
          border: '3px solid rgba(255,255,255,0.6)',
          boxShadow: '0 8px 32px rgba(45,74,53,0.18)',
          marginBottom: s ? 16 : 26,
          flexShrink: 0,
        }}>
          {photo
            ? <img src={photo} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} alt="" />
            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: s ? 36 : 54, opacity: 0.3 }}>👶</div>
          }
        </div>
        {/* Text */}
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: s ? 22 : 36, fontWeight: 700, color: '#2D4A35', marginBottom: s ? 8 : 12 }}>{data.babyName}</div>
          <div style={{ width: 30, height: 2, background: '#5A8A6A', margin: `0 auto ${s ? 8 : 12}px` }} />
          <div style={{ fontSize: s ? 10 : 14, color: '#3A6040', marginBottom: 4 }}>{fmtFull(data.eventDate)}</div>
          <div style={{ fontSize: s ? 10 : 13, color: '#3A6040', opacity: 0.8, marginBottom: 4 }}>{fmtTime(data.eventTime)}</div>
          <div style={{ fontSize: s ? 10 : 13, color: '#3A6040', opacity: 0.8, marginBottom: s ? 4 : 6 }}>{data.venueName}</div>
          {(data.fatherName || data.motherName) && (
            <div style={{ fontSize: s ? 9 : 12, color: '#3A6040', opacity: 0.55 }}>
              {data.fatherName}{data.fatherName && data.motherName ? ' · ' : ''}{data.motherName}
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── Template 6: Classic ──────────────────────────────────
  return (
    <div style={{
      minHeight: s ? undefined : '100svh',
      height: s ? '100%' : undefined,
      background: '#F5EDE0',
      fontFamily: "'DM Serif Display', 'Noto Serif KR', serif",
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: s ? '24px 20px 20px' : '48px 32px 36px',
      boxSizing: 'border-box',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Decorative corner lines */}
      <div style={{ position: 'absolute', top: 12, left: 12, width: 28, height: 28, borderTop: '1.5px solid #A0785A', borderLeft: '1.5px solid #A0785A', opacity: 0.5 }} />
      <div style={{ position: 'absolute', top: 12, right: 12, width: 28, height: 28, borderTop: '1.5px solid #A0785A', borderRight: '1.5px solid #A0785A', opacity: 0.5 }} />
      <div style={{ position: 'absolute', bottom: 12, left: 12, width: 28, height: 28, borderBottom: '1.5px solid #A0785A', borderLeft: '1.5px solid #A0785A', opacity: 0.5 }} />
      <div style={{ position: 'absolute', bottom: 12, right: 12, width: 28, height: 28, borderBottom: '1.5px solid #A0785A', borderRight: '1.5px solid #A0785A', opacity: 0.5 }} />
      {/* INVITATION */}
      <div style={{ fontSize: s ? 8 : 11, letterSpacing: '0.22em', color: '#A0785A', textTransform: 'uppercase', marginBottom: s ? 8 : 12, opacity: 0.8 }}>Invitation</div>
      {/* Big date */}
      <div style={{ textAlign: 'center', marginBottom: s ? 12 : 20 }}>
        <div style={{ fontSize: s ? 28 : 44, color: '#5C4033', lineHeight: 1, letterSpacing: '-0.01em' }}>
          {fmt(data.eventDate)}
        </div>
        <div style={{ fontSize: s ? 11 : 16, color: '#5C4033', opacity: 0.5, letterSpacing: '0.08em' }}>
          {new Date(data.eventDate).getFullYear()}
        </div>
      </div>
      {/* Divider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: s ? 12 : 18, width: '60%' }}>
        <div style={{ flex: 1, height: 1, background: '#A0785A', opacity: 0.4 }} />
        <div style={{ color: '#A0785A', fontSize: s ? 8 : 11, opacity: 0.7 }}>✦</div>
        <div style={{ flex: 1, height: 1, background: '#A0785A', opacity: 0.4 }} />
      </div>
      {/* Photo rectangle */}
      <div style={{
        width: s ? 130 : 200, height: s ? 160 : 245,
        borderRadius: s ? 10 : 14,
        overflow: 'hidden', background: '#D4C5B0',
        border: '2px solid rgba(160,120,90,0.3)',
        boxShadow: '0 6px 24px rgba(92,64,51,0.15)',
        marginBottom: s ? 12 : 18,
        flexShrink: 0,
      }}>
        {photo
          ? <img src={photo} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} alt="" />
          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: s ? 28 : 42, opacity: 0.3 }}>👶</div>
        }
      </div>
      {/* Baby name */}
      <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: s ? 9 : 12, color: '#A0785A', letterSpacing: '0.1em', marginBottom: 4, opacity: 0.7 }}>첫 돌 축하</div>
        <div style={{ fontSize: s ? 20 : 32, color: '#5C4033', letterSpacing: '0.02em', marginBottom: s ? 8 : 12 }}>{data.babyName}</div>
        <div style={{ fontSize: s ? 9 : 13, color: '#7A5C4A', opacity: 0.8, marginBottom: 3 }}>{fmtTime(data.eventTime)}</div>
        <div style={{ fontSize: s ? 9 : 12, color: '#7A5C4A', opacity: 0.7, marginBottom: s ? 4 : 6 }}>{data.venueName}</div>
        {(data.fatherName || data.motherName) && (
          <div style={{ fontSize: s ? 8 : 11, color: '#7A5C4A', opacity: 0.5 }}>
            {data.fatherName}{data.fatherName && data.motherName ? ' · ' : ''}{data.motherName}
          </div>
        )}
      </div>
    </div>
  )
}
