'use client'

import { InvitationData } from '@/types/invitation'
import { TEMPLATES } from '@/lib/templates'
import { useRef } from 'react'

interface Props {
  data: InvitationData
  isPreview?: boolean
  isDragMode?: boolean
  onPositionChange?: (x: number, y: number) => void
}

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })
}

function formatTime(timeStr: string) {
  if (!timeStr) return ''
  const [h, m] = timeStr.split(':').map(Number)
  const ampm = h < 12 ? '오전' : '오후'
  const hour = h % 12 || 12
  return `${ampm} ${hour}시 ${m ? m + '분' : ''}`
}

export default function InvitationView({ data, isPreview, isDragMode, onPositionChange }: Props) {
  const heroRef = useRef<HTMLElement>(null)
  const letteringRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const dragOffset = useRef({ x: 0, y: 0 })

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isDragMode || !heroRef.current || !letteringRef.current || !onPositionChange) return
    e.preventDefault()

    const lr = letteringRef.current.getBoundingClientRect()

    // 포인터와 레터링 중심 사이의 오프셋 기록
    dragOffset.current = {
      x: e.clientX - (lr.left + lr.width / 2),
      y: e.clientY - (lr.top + lr.height / 2),
    }
    isDragging.current = true

    const onMove = (ev: MouseEvent) => {
      if (!isDragging.current || !heroRef.current || !letteringRef.current) return
      const hr = heroRef.current.getBoundingClientRect()
      const lr = letteringRef.current.getBoundingClientRect()
      const halfW = lr.width / 2
      const halfH = lr.height / 2

      // 히어로 기준 새 중심 좌표 (포인터 - 오프셋 - 히어로 원점)
      const rawX = ev.clientX - dragOffset.current.x - hr.left
      const rawY = ev.clientY - dragOffset.current.y - hr.top

      // 히어로 영역 내로 clamp (블록 절반 크기만큼 여백)
      const cx = Math.max(halfW, Math.min(hr.width - halfW, rawX))
      const cy = Math.max(halfH, Math.min(hr.height - halfH, rawY))

      onPositionChange(
        Math.round((cx / hr.width) * 100),
        Math.round((cy / hr.height) * 100),
      )
    }

    const onUp = () => {
      isDragging.current = false
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('mouseleave', onUp)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('mouseleave', onUp)
  }

  const tpl = TEMPLATES.find((t) => t.id === data.templateId) ?? TEMPLATES[0]
  const accent = data.accentColor || tpl.accentColor

  const heroPhoto = (data.photos ?? [])[0]
  const galleryPhotos = (data.photos ?? []).slice(1, 5).filter(Boolean)

  const isDark = tpl.id === 'poster-dark' || tpl.id === 'film'

  return (
    <div
      style={{
        fontFamily: `'${tpl.font}', 'Noto Serif KR', serif`,
        background: tpl.bg,
        color: tpl.textColor,
        minHeight: '100%',
        fontSize: isPreview ? 14 : 16,
      }}
    >
      {/* Hero */}
      <section
        ref={heroRef}
        style={{
          position: 'relative',
          height: isPreview ? 320 : '100svh',
          overflow: 'hidden',
        }}
      >
        {heroPhoto ? (
          <img
            src={heroPhoto}
            alt="hero"
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center top',
            }}
          />
        ) : (
          <div
            style={{
              position: 'absolute', inset: 0,
              background: `linear-gradient(160deg, ${tpl.bg} 0%, ${accent}33 100%)`,
            }}
          />
        )}
        {/* Overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: heroPhoto
            ? 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)'
            : 'none',
        }} />
        {/* Lettering */}
        <div
          ref={letteringRef}
          style={{
            position: 'absolute',
            ...(data.letteringPosition
              ? {
                  left: `${data.letteringPosition.x}%`,
                  top: `${data.letteringPosition.y}%`,
                  transform: 'translate(-50%, -50%)',
                }
              : {
                  bottom: 40,
                  left: '50%',
                  transform: 'translateX(-50%)',
                }
            ),
            textAlign: 'center',
            zIndex: 1,
            cursor: isDragMode ? 'move' : 'default',
            outline: isDragMode ? '2px dashed rgba(255,255,255,0.6)' : 'none',
            outlineOffset: 6,
            borderRadius: 4,
            padding: isDragMode ? '6px 10px' : 0,
            userSelect: 'none',
          }}
          onMouseDown={handleMouseDown}
        >
          {data.letteringText && (
            <div style={{
              fontFamily: 'DM Serif Display, serif',
              fontStyle: 'italic',
              fontSize: isPreview ? 13 : 18,
              color: data.letteringColor || (heroPhoto ? '#fff' : accent),
              letterSpacing: '0.04em',
              marginBottom: 12,
              opacity: 0.9,
            }}>
              {data.letteringText}
            </div>
          )}
          <div style={{
            fontFamily: 'DM Serif Display, serif',
            fontSize: isPreview ? 26 : 42,
            color: data.letteringColor || (heroPhoto ? '#fff' : tpl.textColor),
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
          }}>
            {data.groom.name}
            <span style={{ fontSize: '0.5em', opacity: 0.7, margin: '0 8px' }}>♥</span>
            {data.bride.name}
          </div>
          <div style={{
            marginTop: 10,
            fontSize: isPreview ? 10 : 13,
            color: data.letteringColor || (heroPhoto ? 'rgba(255,255,255,0.85)' : tpl.textColor),
            letterSpacing: '0.12em',
            opacity: 0.8,
          }}>
            {formatDate(data.date)} · {formatTime(data.time)}
          </div>
        </div>
      </section>

      {/* 청첩 문구 */}
      {data.inviteMessage && (
        <section style={{ padding: isPreview ? '32px 24px' : '60px 32px', textAlign: 'center' }}>
          <div style={{
            width: 40, height: 1,
            background: accent, margin: '0 auto 24px',
          }} />
          <p style={{
            fontSize: isPreview ? 11 : 14,
            lineHeight: 2,
            color: tpl.textColor,
            opacity: 0.8,
            whiteSpace: 'pre-line',
          }}>
            {data.inviteMessage}
          </p>
          <div style={{
            width: 40, height: 1,
            background: accent, margin: '24px auto 0',
          }} />
        </section>
      )}

      {/* 혼주 정보 */}
      <section style={{
        padding: isPreview ? '0 24px 28px' : '0 32px 48px',
        textAlign: 'center',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: isPreview ? 24 : 40,
          fontSize: isPreview ? 11 : 14,
        }}>
          <div>
            <div style={{ opacity: 0.5, fontSize: '0.85em', marginBottom: 4 }}>신랑</div>
            <div>{data.groom.fatherName} · {data.groom.motherName}</div>
            <div style={{ fontSize: '1.1em', fontWeight: 500, marginTop: 4 }}>{data.groom.name}</div>
          </div>
          <div style={{ opacity: 0.2, display: 'flex', alignItems: 'center' }}>|</div>
          <div>
            <div style={{ opacity: 0.5, fontSize: '0.85em', marginBottom: 4 }}>신부</div>
            <div>{data.bride.fatherName} · {data.bride.motherName}</div>
            <div style={{ fontSize: '1.1em', fontWeight: 500, marginTop: 4 }}>{data.bride.name}</div>
          </div>
        </div>
      </section>

      {/* 갤러리 */}
      {galleryPhotos.length > 0 && (
        <section style={{ padding: isPreview ? '0 12px 28px' : '0 16px 48px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: galleryPhotos.length === 1 ? '1fr' : '1fr 1fr',
            gap: isPreview ? 6 : 8,
          }}>
            {galleryPhotos.map((src, i) => (
              <div key={i} style={{
                aspectRatio: '4/5',
                borderRadius: 12,
                overflow: 'hidden',
              }}>
                <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 날짜 · 장소 */}
      <section style={{
        margin: isPreview ? '0 16px 28px' : '0 20px 48px',
        padding: isPreview ? '20px 20px' : '32px 28px',
        background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
        borderRadius: 16,
        textAlign: 'center',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
      }}>
        <div style={{ fontSize: isPreview ? 9 : 11, opacity: 0.5, letterSpacing: '0.15em', marginBottom: 12, textTransform: 'uppercase' }}>
          Date &amp; Venue
        </div>
        <div style={{
          fontFamily: 'DM Serif Display, serif',
          fontSize: isPreview ? 14 : 20,
          marginBottom: 8,
        }}>
          {formatDate(data.date)}
        </div>
        <div style={{ fontSize: isPreview ? 11 : 14, opacity: 0.7, marginBottom: 16 }}>
          {formatTime(data.time)}
        </div>
        <div style={{
          width: 32, height: 1,
          background: accent, margin: '0 auto 16px',
        }} />
        <div style={{ fontSize: isPreview ? 12 : 16, fontWeight: 500 }}>{data.venueName}</div>
        <div style={{ fontSize: isPreview ? 10 : 13, opacity: 0.6, marginTop: 4 }}>{data.venueAddress}</div>
        {data.transport && (
          <div style={{
            marginTop: 16,
            padding: isPreview ? '10px 12px' : '14px 16px',
            background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
            borderRadius: 10,
            fontSize: isPreview ? 9 : 12,
            opacity: 0.7,
            textAlign: 'left',
            whiteSpace: 'pre-line',
            lineHeight: 1.7,
          }}>
            {data.transport}
          </div>
        )}
      </section>

      {/* 계좌 안내 */}
      {(data.groomAccount.number || data.brideAccount.number) && (
        <section style={{
          margin: isPreview ? '0 16px 28px' : '0 20px 48px',
          padding: isPreview ? '20px' : '28px',
          background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
          borderRadius: 16,
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
        }}>
          <div style={{ fontSize: isPreview ? 9 : 11, opacity: 0.5, letterSpacing: '0.15em', marginBottom: 16, textTransform: 'uppercase', textAlign: 'center' }}>
            마음 전하기
          </div>
          {[
            { label: '신랑측', ...data.groomAccount },
            { label: '신부측', ...data.brideAccount },
          ].filter(a => a.number).map((a, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: isPreview ? '8px 0' : '12px 0',
              borderBottom: i === 0 ? `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}` : 'none',
              fontSize: isPreview ? 11 : 14,
            }}>
              <div>
                <div style={{ opacity: 0.5, fontSize: '0.8em', marginBottom: 2 }}>{a.label}</div>
                <div style={{ fontWeight: 500 }}>{a.bank}</div>
                <div style={{ opacity: 0.7, fontSize: '0.9em' }}>{a.number}</div>
              </div>
              <button
                onClick={() => navigator.clipboard?.writeText(a.number)}
                style={{
                  padding: isPreview ? '4px 10px' : '6px 14px',
                  border: `1px solid ${accent}`,
                  borderRadius: 8,
                  background: 'transparent',
                  color: accent,
                  fontSize: isPreview ? 9 : 12,
                  cursor: 'pointer',
                }}
              >
                복사
              </button>
            </div>
          ))}
        </section>
      )}

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        padding: isPreview ? '16px 0 24px' : '24px 0 40px',
        fontSize: isPreview ? 9 : 11,
        opacity: 0.3,
        letterSpacing: '0.1em',
      }}>
        {data.groom.name} &amp; {data.bride.name}
      </div>
    </div>
  )
}
