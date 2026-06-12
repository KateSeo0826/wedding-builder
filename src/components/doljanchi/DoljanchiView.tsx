'use client'

import { useRef, useEffect } from 'react'
import { DoljanchiData } from '@/types/doljanchi'
import { DOLJANCHI_TEMPLATES } from '@/lib/doljanchi-templates'

function HappyDayCanvas({ isPreview }: { isPreview?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx2d = canvas.getContext('2d')
    if (!ctx2d) return
    const ctx = ctx2d

    const W = canvas.clientWidth > 0 ? canvas.clientWidth : (isPreview ? 290 : 360)
    const H = canvas.clientHeight > 0 ? canvas.clientHeight : (isPreview ? 480 : 700)
    canvas.width = W
    canvas.height = H

    const starsData = [
      { rx: W * 0.17, ry: H * 0.047, size: isPreview ? 5 : 8 },
      { rx: W * 0.86, ry: H * 0.203, size: isPreview ? 4 : 7 },
      { rx: W * 0.11, ry: H * 0.469, size: isPreview ? 3 : 6 },
    ]

    let linesY = -150

    function drawStar(cx: number, cy: number, r: number) {
      const spikes = 4
      const inner = r * 0.25
      let rot = -Math.PI / 2
      const step = Math.PI / spikes
      ctx.beginPath()
      ctx.moveTo(cx, cy - r)
      for (let i = 0; i < spikes; i++) {
        ctx.lineTo(cx + Math.cos(rot) * r, cy + Math.sin(rot) * r)
        rot += step
        ctx.lineTo(cx + Math.cos(rot) * inner, cy + Math.sin(rot) * inner)
        rot += step
      }
      ctx.lineTo(cx, cy - r)
      ctx.closePath()
      ctx.fillStyle = '#2b3d52'
      ctx.fill()
    }

    function animate() {
      ctx.clearRect(0, 0, W, H)
      ctx.strokeStyle = 'rgba(181, 203, 224, 0.45)'
      ctx.lineWidth = 1.2

      ctx.beginPath()
      ctx.moveTo(-20, linesY)
      ctx.bezierCurveTo(W * 0.33, linesY + 80, W * 0.67, linesY - 60, W + 20, linesY + 120)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(-20, linesY + 140)
      ctx.bezierCurveTo(W * 0.28, linesY + 260, W * 0.72, linesY + 60, W + 20, linesY + 220)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(-20, linesY + 320)
      ctx.bezierCurveTo(W * 0.25, linesY + 400, W * 0.75, linesY + 240, W + 20, linesY + 360)
      ctx.stroke()

      starsData.forEach(star => {
        const sy = linesY + star.ry
        const pulse = Math.sin(Date.now() * 0.005 + star.ry) * 1.5
        const r = Math.max(2, star.size + pulse)
        if (sy > -20 && sy < H + 20) drawStar(star.rx, sy, r)
      })

      linesY += 0.4
      if (linesY > H + 100) linesY = -450

      animRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(animRef.current)
  }, [isPreview])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute', top: 0, left: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 1,
      }}
    />
  )
}

interface Props {
  data: DoljanchiData
  isPreview?: boolean
}

function parseLocalDate(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function fmt(dateStr: string) {
  if (!dateStr) return ''
  const d = parseLocalDate(dateStr)
  return `${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

function fmtFull(dateStr: string) {
  if (!dateStr) return ''
  const d = parseLocalDate(dateStr)
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
    const evtDate = data.eventDate ? parseLocalDate(data.eventDate) : null
    const mm = evtDate ? String(evtDate.getMonth() + 1).padStart(2, '0') : '--'
    const dd = evtDate ? String(evtDate.getDate()).padStart(2, '0') : '--'
    const photoW = s ? 168 : 248
    const photoH = s ? 214 : 316

    // SVG orbital ring parameters (centered on photo)
    const cx = photoW / 2
    const cy = photoH / 2
    const rx1 = Math.round(photoW * 0.87), ry1 = Math.round(photoH * 0.105)
    const rx2 = Math.round(photoW * 0.71), ry2 = Math.round(photoH * 0.075)
    // Circumference approximation
    const c1 = Math.round(2 * Math.PI * Math.sqrt((rx1 ** 2 + ry1 ** 2) / 2)) + 6
    const c2 = Math.round(2 * Math.PI * Math.sqrt((rx2 ** 2 + ry2 ** 2) / 2)) + 6
    // SVG path for ellipse starting from top-center, going clockwise
    const ep = (prx: number, pry: number) =>
      `M${cx},${cy - pry} A${prx},${pry},0,1,1,${cx - 0.001},${cy - pry}`

    // Stars scattered top-to-bottom with staggered delays (top appears first)
    const cardStars: { top?: string; left?: string; right?: string; bottom?: string; sz: number; d: string }[] = [
      { top: '3%',  left: '6%',   sz: s ? 9 : 14,  d: '0.05s' },
      { top: '6%',  right: '7%',  sz: s ? 11 : 17, d: '0.15s' },
      { top: '18%', left: '4%',   sz: s ? 7 : 11,  d: '0.4s'  },
      { top: '24%', right: '5%',  sz: s ? 8 : 13,  d: '0.6s'  },
      { top: '48%', left: '3%',   sz: s ? 6 : 9,   d: '1.1s'  },
      { top: '54%', right: '4%',  sz: s ? 7 : 10,  d: '1.3s'  },
      { bottom: '26%', left: '7%',  sz: s ? 8 : 12, d: '1.9s' },
      { bottom: '22%', right: '8%', sz: s ? 6 : 9,  d: '2.1s' },
      { bottom: '9%',  left: '11%', sz: s ? 7 : 10, d: '2.6s' },
      { bottom: '7%',  right: '10%',sz: s ? 6 : 9,  d: '2.8s' },
    ]

    return (
      <div style={{
        height: s ? '100%' : '100svh',
        background: '#FFFFFF',
        fontFamily: "'Noto Serif KR', serif",
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'space-between',
        padding: s ? '24px 18px 20px' : '52px 28px 44px',
        boxSizing: 'border-box',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Stars (absolute — not flex children) */}
        {cardStars.map((st, i) => (
          <span key={i} className="doljanchi-star" style={{
            position: 'absolute', top: st.top, left: st.left, right: st.right, bottom: st.bottom,
            color: '#1C2D6E', fontSize: st.sz, lineHeight: 1, animationDelay: st.d,
          }}>✦</span>
        ))}

        {/* Flex child 1: Title */}
        <div style={{
          fontSize: s ? 14 : 22,
          fontFamily: "'DM Serif Display', serif",
          fontStyle: 'italic',
          color: '#1a1a1a',
          letterSpacing: '0.02em',
          textAlign: 'center',
          position: 'relative', zIndex: 1,
        }}>
          Happy First Birthday
        </div>

        {/* Flex child 2: Oval photo + SVG rings + date badge */}
        <div style={{ position: 'relative', flexShrink: 0, zIndex: 1 }}>
          <svg
            width={photoW} height={photoH}
            viewBox={`0 0 ${photoW} ${photoH}`}
            style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%,-50%)',
              overflow: 'visible', pointerEvents: 'none', zIndex: 0,
            }}
          >
            <path d={ep(rx1, ry1)} fill="none"
              stroke="rgba(28,45,110,0.38)" strokeWidth={s ? 1 : 1.5}
              style={{ strokeDasharray: c1, strokeDashoffset: c1, animation: `svg-ring-draw 3s ease-out 0.2s forwards` }} />
            <path d={ep(rx2, ry2)} fill="none"
              stroke="rgba(28,45,110,0.22)" strokeWidth={s ? 0.5 : 1}
              style={{ strokeDasharray: c2, strokeDashoffset: c2, animation: `svg-ring-draw 2.8s ease-out 0.5s forwards` }} />
            <text x={cx} y={cy - ry1 - 4} fontSize={s ? 8 : 12} fill="rgba(28,45,110,0.75)" textAnchor="middle" className="doljanchi-star" style={{ animationDelay: '0.3s' }}>✦</text>
            <text x={cx + rx1 + 4} y={cy} fontSize={s ? 7 : 10} fill="rgba(28,45,110,0.6)" textAnchor="middle" dominantBaseline="middle" className="doljanchi-star" style={{ animationDelay: '1.0s' }}>✦</text>
            <text x={cx} y={cy + ry1 + 8} fontSize={s ? 7 : 11} fill="rgba(28,45,110,0.65)" textAnchor="middle" className="doljanchi-star" style={{ animationDelay: '1.7s' }}>✦</text>
            <text x={cx - rx1 - 4} y={cy} fontSize={s ? 6 : 9} fill="rgba(28,45,110,0.5)" textAnchor="middle" dominantBaseline="middle" className="doljanchi-star" style={{ animationDelay: '2.4s' }}>✦</text>
            <text x={cx + rx1 * 0.72} y={cy - ry1 * 0.68} fontSize={s ? 6 : 8} fill="rgba(28,45,110,0.45)" textAnchor="middle" className="doljanchi-star" style={{ animationDelay: '0.7s' }}>✦</text>
            <text x={cx - rx1 * 0.68} y={cy + ry1 * 0.72} fontSize={s ? 6 : 8} fill="rgba(28,45,110,0.4)" textAnchor="middle" className="doljanchi-star" style={{ animationDelay: '2.1s' }}>✦</text>
          </svg>
          <div style={{
            width: photoW, height: photoH,
            borderRadius: '50%',
            overflow: 'hidden',
            background: '#e0e0e0',
            boxShadow: '0 6px 28px rgba(0,0,0,0.12)',
            position: 'relative', zIndex: 1,
          }}>
            {photo
              ? <img src={photo} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} alt="" />
              : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: s ? 36 : 54, opacity: 0.2 }}>👶</div>
            }
          </div>
          <div style={{
            position: 'absolute', bottom: s ? -8 : -12, right: s ? -10 : -16,
            width: s ? 50 : 72, height: s ? 50 : 72,
            borderRadius: '50%', background: '#1C2D6E',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(28,45,110,0.35)', zIndex: 2,
          }}>
            <span style={{ fontSize: s ? 11 : 15, color: '#fff', fontWeight: 700, lineHeight: 1, fontFamily: "'Noto Sans KR', sans-serif" }}>{mm}</span>
            <div style={{ width: s ? 20 : 28, height: 0.5, background: 'rgba(255,255,255,0.45)', margin: `${s ? 2 : 3}px 0` }} />
            <span style={{ fontSize: s ? 11 : 15, color: '#fff', fontWeight: 700, lineHeight: 1, fontFamily: "'Noto Sans KR', sans-serif" }}>{dd}</span>
          </div>
        </div>

        {/* Flex child 3: Baby name + date/time/venue */}
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: s ? 26 : 40, fontWeight: 700, color: '#111111', letterSpacing: '0.02em', marginBottom: s ? 6 : 10 }}>
            {data.babyName}
          </div>
          <div style={{ fontSize: s ? 11 : 15, color: '#444', marginBottom: s ? 2 : 4 }}>{fmtFull(data.eventDate)}</div>
          <div style={{ fontSize: s ? 11 : 14, color: '#666', marginBottom: s ? 2 : 4 }}>{fmtTime(data.eventTime)}</div>
          {data.venueName && <div style={{ fontSize: s ? 10 : 14, color: '#777' }}>{data.venueName}</div>}
        </div>

        {/* Flex child 4: Parents footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: `0 ${s ? 8 : 16}px`, fontSize: s ? 10 : 14, color: '#888', position: 'relative', zIndex: 1 }}>
          <span>
            {data.fatherName ? <><span style={{ opacity: 0.55, marginRight: 4 }}>아빠</span>{data.fatherName}</> : null}
          </span>
          <span>
            {data.motherName ? <><span style={{ opacity: 0.55, marginRight: 4 }}>엄마</span>{data.motherName}</> : null}
          </span>
        </div>
      </div>
    )
  }

  // ── Template 2: First Birthday (pink gradient, arch photo, orbital rings) ──
  if (data.templateId === 'first-year') {
    const photoW = s ? 158 : 225
    const photoH = s ? 202 : 288
    const archR = photoW / 2

    // SVG orbital ring params (centered on arch photo)
    const cx = photoW / 2
    const cy = photoH * 0.5
    const rx1 = Math.round(photoW * 0.82), ry1 = Math.round(photoH * 0.13)
    const rx2 = Math.round(photoW * 0.68), ry2 = Math.round(photoH * 0.20)
    const c1 = Math.round(2 * Math.PI * Math.sqrt((rx1 ** 2 + ry1 ** 2) / 2)) + 6
    const c2 = Math.round(2 * Math.PI * Math.sqrt((rx2 ** 2 + ry2 ** 2) / 2)) + 6
    const ep = (prx: number, pry: number) =>
      `M${cx},${cy - pry} A${prx},${pry},0,1,1,${cx - 0.001},${cy - pry}`

    return (
      <div style={{
        height: s ? '100%' : '100svh',
        background: 'linear-gradient(145deg, #FFB0C8 0%, #F09AD2 45%, #CC96EE 100%)',
        fontFamily: "'Noto Sans KR', sans-serif",
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'space-between',
        padding: s ? '24px 18px 20px' : '52px 28px 44px',
        boxSizing: 'border-box',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Flex child 1: FIRST BIRTHDAY header */}
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{
            fontSize: s ? 12 : 18, fontWeight: 700,
            color: 'rgba(255,255,255,0.95)',
            letterSpacing: '0.22em', textTransform: 'uppercase' as const,
            lineHeight: 1.6,
          }}>
            FIRST BIRTHDAY<br />FIRST BIRTHDAY
          </div>
        </div>

        {/* Flex child 2: Arch photo + SVG rings */}
        <div style={{ position: 'relative', flexShrink: 0, zIndex: 1 }}>
          <svg
            width={photoW} height={photoH}
            viewBox={`0 0 ${photoW} ${photoH}`}
            style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%,-50%)',
              overflow: 'visible', pointerEvents: 'none', zIndex: 0,
            }}
          >
            <path d={ep(rx1, ry1)} fill="none"
              stroke="rgba(255,255,255,0.7)" strokeWidth={s ? 1 : 1.5}
              style={{ strokeDasharray: c1, strokeDashoffset: c1, animation: `svg-ring-draw 3s ease-out 0.2s forwards` }} />
            <path d={ep(rx2, ry2)} fill="none"
              stroke="rgba(255,255,255,0.4)" strokeWidth={s ? 1 : 1.5}
              style={{ strokeDasharray: c2, strokeDashoffset: c2, animation: `svg-ring-draw 2.8s ease-out 0.5s forwards` }} />
            <text x={cx} y={cy - ry1 - 4} fontSize={s ? 9 : 13} fill="rgba(255,255,255,0.9)" textAnchor="middle" className="doljanchi-star" style={{ animationDelay: '0.3s' }}>✦</text>
            <text x={cx + rx1 + 4} y={cy} fontSize={s ? 8 : 11} fill="rgba(255,255,255,0.75)" textAnchor="middle" dominantBaseline="middle" className="doljanchi-star" style={{ animationDelay: '1.0s' }}>✦</text>
            <text x={cx} y={cy + ry1 + 8} fontSize={s ? 7 : 10} fill="rgba(255,255,255,0.65)" textAnchor="middle" className="doljanchi-star" style={{ animationDelay: '1.7s' }}>✦</text>
            <text x={cx - rx1 - 4} y={cy} fontSize={s ? 7 : 10} fill="rgba(255,255,255,0.6)" textAnchor="middle" dominantBaseline="middle" className="doljanchi-star" style={{ animationDelay: '2.4s' }}>✦</text>
            <text x={cx + rx2 * 0.73} y={cy - ry2 * 0.68} fontSize={s ? 6 : 9} fill="rgba(255,255,255,0.55)" textAnchor="middle" className="doljanchi-star" style={{ animationDelay: '0.8s' }}>★</text>
            <text x={cx - rx2 * 0.68} y={cy + ry2 * 0.73} fontSize={s ? 6 : 9} fill="rgba(255,255,255,0.5)" textAnchor="middle" className="doljanchi-star" style={{ animationDelay: '2.2s' }}>★</text>
          </svg>
          <div style={{
            width: photoW, height: photoH,
            borderRadius: `${archR}px ${archR}px 0 0`,
            overflow: 'hidden',
            background: 'rgba(255,255,255,0.2)',
            border: `${s ? 2 : 3}px solid rgba(255,255,255,0.75)`,
            boxSizing: 'border-box',
            position: 'relative', zIndex: 1,
          }}>
            {photo
              ? <img src={photo} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} alt="" />
              : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: s ? 32 : 48, opacity: 0.4 }}>👶</div>
            }
          </div>
        </div>

        {/* Flex child 3: Baby name + date pill + date/time/venue */}
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{
            fontSize: s ? 30 : 46,
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic',
            fontWeight: 400,
            color: '#fff',
            letterSpacing: '0.04em',
            lineHeight: 1.15,
            textShadow: '0 2px 12px rgba(180,60,140,0.35)',
            marginBottom: s ? 5 : 8,
          }}>{data.babyName}</div>
          <div style={{
            display: 'inline-block',
            background: 'rgba(255,255,255,0.25)',
            border: '1px solid rgba(255,255,255,0.55)',
            borderRadius: 20,
            padding: s ? '3px 14px' : '5px 20px',
            fontSize: s ? 10 : 14, color: '#fff',
            letterSpacing: '0.06em',
            marginBottom: s ? 5 : 8,
          }}>{fmt(data.eventDate)}</div>
          <div style={{ fontSize: s ? 11 : 15, color: 'rgba(255,255,255,0.88)', marginBottom: s ? 2 : 4 }}>{fmtFull(data.eventDate)}</div>
          <div style={{ fontSize: s ? 11 : 14, color: 'rgba(255,255,255,0.78)', marginBottom: s ? 2 : 4 }}>{fmtTime(data.eventTime)}</div>
          {data.venueName && <div style={{ fontSize: s ? 11 : 14, color: 'rgba(255,255,255,0.72)' }}>{data.venueName}</div>}
        </div>

        {/* Flex child 4: Parents footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: `0 ${s ? 8 : 16}px`, fontSize: s ? 10 : 13, color: 'rgba(255,255,255,0.68)', position: 'relative', zIndex: 1 }}>
          <span>
            {data.fatherName ? <><span style={{ opacity: 0.75, marginRight: 3 }}>아빠</span>{data.fatherName}</> : null}
          </span>
          <span>
            {data.motherName ? <><span style={{ opacity: 0.75, marginRight: 3 }}>엄마</span>{data.motherName}</> : null}
          </span>
        </div>
      </div>
    )
  }

  // ── Template 3: Happy Day (sky blue card, wavy canvas lines, oval photo) ────
  if (data.templateId === 'happy-day') {
    const evtDate = data.eventDate ? parseLocalDate(data.eventDate) : null
    const mm = evtDate ? String(evtDate.getMonth() + 1).padStart(2, '0') : '--'
    const dd = evtDate ? String(evtDate.getDate()).padStart(2, '0') : '--'
    const photoW = s ? 130 : 190
    const photoH = s ? 185 : 270

    return (
      <div style={{
        height: s ? '100%' : '100svh',
        background: '#ffffff',
        border: '1px solid #b5cbe0',
        fontFamily: "'Nanum Myeongjo', serif",
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'space-between',
        padding: s ? '20px 14px 16px' : '30px 20px',
        boxSizing: 'border-box',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Inner border (absolute — not a flex child) */}
        <div style={{
          position: 'absolute',
          top: s ? 7 : 10, left: s ? 7 : 10, right: s ? 7 : 10, bottom: s ? 7 : 10,
          border: '1px solid #cbdde9',
          pointerEvents: 'none', zIndex: 2,
        }} />

        {/* Canvas: wavy lines + 4-point stars (absolute — not a flex child) */}
        <HappyDayCanvas isPreview={s} />

        {/* Flex child 1: Title */}
        <div style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: s ? 16 : 28,
          fontWeight: 500,
          color: '#333333',
          letterSpacing: '-0.5px',
          textAlign: 'center',
          position: 'relative', zIndex: 3,
        }}>Happy First Birthday</div>

        {/* Flex child 2: Oval photo + date badge */}
        <div style={{ position: 'relative', flexShrink: 0, zIndex: 3 }}>
          <div style={{
            width: photoW, height: photoH,
            borderRadius: '50% / 40%',
            overflow: 'hidden',
            background: '#f0f0f0',
          }}>
            {photo
              ? <img src={photo} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} alt="" />
              : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: s ? 28 : 44, opacity: 0.2 }}>👶</div>
            }
          </div>
          {/* Navy date badge */}
          <div style={{
            position: 'absolute', bottom: s ? 10 : 15, right: s ? -7 : -10,
            width: s ? 36 : 54, height: s ? 36 : 54,
            background: '#2b3d52',
            borderRadius: '50%',
            color: '#ffffff',
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            fontFamily: "'Playfair Display', serif",
            fontSize: s ? 10 : 14,
            fontWeight: 700,
            boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
            zIndex: 4, lineHeight: 1.2,
          }}>
            <span>{mm}</span>
            <div style={{ width: s ? 14 : 24, height: 1, background: 'rgba(255,255,255,0.5)', margin: '2px 0' }} />
            <span>{dd}</span>
          </div>
        </div>

        {/* Flex child 3: Baby name + date */}
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 3 }}>
          <div style={{
            fontSize: s ? 22 : 32,
            fontWeight: 800,
            color: '#1a1a1a',
            marginBottom: s ? 5 : 10,
            letterSpacing: '2px',
          }}>{data.babyName || '아기이름'}</div>
          <div style={{ fontSize: s ? 9 : 13, color: '#555555', fontWeight: 700 }}>
            {fmtFull(data.eventDate)}{data.eventTime ? ` ${fmtTime(data.eventTime)}` : ''}
          </div>
          {data.venueName && (
            <div style={{ fontSize: s ? 9 : 12, color: '#666', marginTop: 3 }}>{data.venueName}</div>
          )}
        </div>

        {/* Flex child 4: Parents footer */}
        <div style={{
          width: '100%',
          display: 'flex',
          justifyContent: data.fatherName && data.motherName ? 'space-between' : 'center',
          padding: `0 ${s ? 10 : 15}px`,
          fontSize: s ? 9 : 11,
          color: '#666666',
          position: 'relative', zIndex: 3,
        }}>
          {data.fatherName
            ? <span>아빠 <strong style={{ color: '#333333', marginLeft: 3 }}>{data.fatherName}</strong></span>
            : <span />
          }
          {data.motherName
            ? <span>엄마 <strong style={{ color: '#333333', marginLeft: 3 }}>{data.motherName}</strong></span>
            : <span />
          }
        </div>
      </div>
    )
  }

  // ── Template 4: Party Time ──────────────────────────────────
  if (data.templateId === 'party-time') {
    return (
      <div style={{
        height: s ? '100%' : '100svh',
        background: '#FF85B3',
        fontFamily: "'Noto Sans KR', sans-serif",
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'space-between',
        padding: s ? '24px 20px 20px' : '52px 32px 44px',
        boxSizing: 'border-box',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Repeating text background (absolute) */}
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

        {/* Flex child 1: Top label */}
        <div style={{ fontSize: s ? 10 : 14, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.18em', textTransform: 'uppercase' as const, fontWeight: 600, position: 'relative' }}>
          First Birthday
        </div>

        {/* Flex child 2: Circle photo */}
        <div style={{
          width: s ? 160 : 240, height: s ? 160 : 240,
          borderRadius: '50%',
          border: '6px solid #fff',
          boxShadow: '0 0 0 3px rgba(255,255,255,0.4), 0 12px 40px rgba(255,20,147,0.3)',
          overflow: 'hidden', background: '#FF6B9D',
          flexShrink: 0, position: 'relative',
        }}>
          {photo
            ? <img src={photo} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} alt="" />
            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: s ? 32 : 48, opacity: 0.5 }}>👶</div>
          }
        </div>

        {/* Flex child 3: Name + date + info */}
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: s ? 24 : 38, fontWeight: 900, color: '#fff', letterSpacing: '-0.01em', marginBottom: s ? 6 : 10, textShadow: '0 2px 8px rgba(255,20,147,0.3)' }}>
            {data.babyName}
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', background: '#1A1A1A', borderRadius: 20, padding: s ? '4px 14px' : '6px 20px', marginBottom: s ? 6 : 10 }}>
            <span style={{ fontSize: s ? 10 : 14, color: '#fff', fontWeight: 700 }}>{fmt(data.eventDate)}</span>
          </div>
          <div style={{ fontSize: s ? 10 : 13, color: 'rgba(255,255,255,0.85)', marginBottom: s ? 2 : 4 }}>{fmtFull(data.eventDate)} · {fmtTime(data.eventTime)}</div>
          {data.venueName && <div style={{ fontSize: s ? 10 : 13, color: 'rgba(255,255,255,0.75)' }}>{data.venueName}</div>}
        </div>

        {/* Flex child 4: Parents footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: `0 ${s ? 8 : 16}px`, fontSize: s ? 9 : 12, color: 'rgba(255,255,255,0.6)', position: 'relative', zIndex: 1 }}>
          <span>{data.fatherName || ''}</span>
          <span>{data.motherName || ''}</span>
        </div>
      </div>
    )
  }

  // ── Template 5: Garden ──────────────────────────────────
  if (data.templateId === 'garden') {
    return (
      <div style={{
        height: s ? '100%' : '100svh',
        background: 'linear-gradient(160deg, #C8D8C4 0%, #B8CCB4 100%)',
        fontFamily: "'Noto Serif KR', serif",
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'space-between',
        padding: s ? '24px 20px 20px' : '52px 32px 44px',
        boxSizing: 'border-box',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Flex child 1: Header */}
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: s ? 9 : 12, color: '#2D4A35', opacity: 0.65, letterSpacing: '0.14em', textTransform: 'uppercase' as const, marginBottom: 4 }}>Invitation</div>
          <div style={{ fontSize: s ? 11 : 15, color: '#2D4A35', opacity: 0.8, letterSpacing: '0.04em' }}>베이비의 돌잔치에 초대합니다</div>
        </div>

        {/* Flex child 2: Photo */}
        <div style={{
          width: s ? 180 : 270, height: s ? 180 : 270,
          borderRadius: s ? 16 : 24,
          overflow: 'hidden', background: '#A8C5A0',
          border: '3px solid rgba(255,255,255,0.6)',
          boxShadow: '0 8px 32px rgba(45,74,53,0.18)',
          flexShrink: 0,
        }}>
          {photo
            ? <img src={photo} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} alt="" />
            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: s ? 36 : 54, opacity: 0.3 }}>👶</div>
          }
        </div>

        {/* Flex child 3: Name + divider + date/time/venue */}
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: s ? 22 : 36, fontWeight: 700, color: '#2D4A35', marginBottom: s ? 6 : 10 }}>{data.babyName}</div>
          <div style={{ width: 30, height: 2, background: '#5A8A6A', margin: `0 auto ${s ? 6 : 10}px` }} />
          <div style={{ fontSize: s ? 10 : 14, color: '#3A6040', marginBottom: s ? 2 : 4 }}>{fmtFull(data.eventDate)}</div>
          <div style={{ fontSize: s ? 10 : 13, color: '#3A6040', opacity: 0.8, marginBottom: s ? 2 : 4 }}>{fmtTime(data.eventTime)}</div>
          {data.venueName && <div style={{ fontSize: s ? 10 : 13, color: '#3A6040', opacity: 0.8 }}>{data.venueName}</div>}
        </div>

        {/* Flex child 4: Parents footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: `0 ${s ? 8 : 16}px`, fontSize: s ? 9 : 12, color: '#3A6040', opacity: 0.55, position: 'relative', zIndex: 1 }}>
          <span>{data.fatherName || ''}</span>
          <span>{data.motherName || ''}</span>
        </div>
      </div>
    )
  }

  // ── Template 6: Classic ──────────────────────────────────
  return (
    <div style={{
      height: s ? '100%' : '100svh',
      background: '#F5EDE0',
      fontFamily: "'DM Serif Display', 'Noto Serif KR', serif",
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'space-between',
      padding: s ? '24px 20px 20px' : '52px 32px 44px',
      boxSizing: 'border-box',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Decorative corner lines (absolute) */}
      <div style={{ position: 'absolute', top: 12, left: 12, width: 28, height: 28, borderTop: '1.5px solid #A0785A', borderLeft: '1.5px solid #A0785A', opacity: 0.5 }} />
      <div style={{ position: 'absolute', top: 12, right: 12, width: 28, height: 28, borderTop: '1.5px solid #A0785A', borderRight: '1.5px solid #A0785A', opacity: 0.5 }} />
      <div style={{ position: 'absolute', bottom: 12, left: 12, width: 28, height: 28, borderBottom: '1.5px solid #A0785A', borderLeft: '1.5px solid #A0785A', opacity: 0.5 }} />
      <div style={{ position: 'absolute', bottom: 12, right: 12, width: 28, height: 28, borderBottom: '1.5px solid #A0785A', borderRight: '1.5px solid #A0785A', opacity: 0.5 }} />

      {/* Flex child 1: Invitation label + big date + divider */}
      <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: s ? 8 : 11, letterSpacing: '0.22em', color: '#A0785A', textTransform: 'uppercase' as const, marginBottom: s ? 6 : 10, opacity: 0.8 }}>Invitation</div>
        <div style={{ fontSize: s ? 28 : 44, color: '#5C4033', lineHeight: 1, letterSpacing: '-0.01em' }}>{fmt(data.eventDate)}</div>
        <div style={{ fontSize: s ? 11 : 16, color: '#5C4033', opacity: 0.5, letterSpacing: '0.08em', marginBottom: s ? 6 : 10 }}>
          {data.eventDate ? parseLocalDate(data.eventDate).getFullYear() : ''}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '60%', margin: '0 auto' }}>
          <div style={{ flex: 1, height: 1, background: '#A0785A', opacity: 0.4 }} />
          <div style={{ color: '#A0785A', fontSize: s ? 8 : 11, opacity: 0.7 }}>✦</div>
          <div style={{ flex: 1, height: 1, background: '#A0785A', opacity: 0.4 }} />
        </div>
      </div>

      {/* Flex child 2: Photo */}
      <div style={{
        width: s ? 130 : 200, height: s ? 160 : 245,
        borderRadius: s ? 10 : 14,
        overflow: 'hidden', background: '#D4C5B0',
        border: '2px solid rgba(160,120,90,0.3)',
        boxShadow: '0 6px 24px rgba(92,64,51,0.15)',
        flexShrink: 0,
      }}>
        {photo
          ? <img src={photo} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} alt="" />
          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: s ? 28 : 42, opacity: 0.3 }}>👶</div>
        }
      </div>

      {/* Flex child 3: Name + time/venue */}
      <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: s ? 9 : 12, color: '#A0785A', letterSpacing: '0.1em', marginBottom: s ? 3 : 6, opacity: 0.7 }}>첫 돌 축하</div>
        <div style={{ fontSize: s ? 20 : 32, color: '#5C4033', letterSpacing: '0.02em', marginBottom: s ? 5 : 8 }}>{data.babyName}</div>
        <div style={{ fontSize: s ? 9 : 13, color: '#7A5C4A', opacity: 0.8, marginBottom: s ? 2 : 4 }}>{fmtFull(data.eventDate)}</div>
        <div style={{ fontSize: s ? 9 : 13, color: '#7A5C4A', opacity: 0.8, marginBottom: s ? 2 : 3 }}>{fmtTime(data.eventTime)}</div>
        {data.venueName && <div style={{ fontSize: s ? 9 : 12, color: '#7A5C4A', opacity: 0.7 }}>{data.venueName}</div>}
      </div>

      {/* Flex child 4: Parents footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: `0 ${s ? 8 : 16}px`, fontSize: s ? 8 : 11, color: '#7A5C4A', opacity: 0.5, position: 'relative', zIndex: 1 }}>
        <span>{data.fatherName || ''}</span>
        <span>{data.motherName || ''}</span>
      </div>
    </div>
  )
}
