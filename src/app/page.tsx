import Link from 'next/link'

const PREVIEWS = [
  {
    bg: 'linear-gradient(160deg, #f5f0eb 0%, #e8ddd6 100%)',
    textColor: '#7c6b5c',
    accent: '#c85070',
    tilt: '-rotate-3',
  },
  {
    bg: 'linear-gradient(160deg, #1a1a1a 0%, #2d2d2d 100%)',
    textColor: '#e8d5c0',
    accent: '#c9a96e',
    tilt: '',
  },
  {
    bg: 'linear-gradient(160deg, #f0f4f0 0%, #dde8dd 100%)',
    textColor: '#2d4a35',
    accent: '#5a8a6a',
    tilt: 'rotate-3',
  },
]

const STEPS = [
  { num: '01', title: '템플릿 선택', desc: '10가지 감성 디자인 중 원하는 스타일을 골라보세요' },
  { num: '02', title: '내용 입력', desc: '신랑·신부 이름, 날짜, 장소, 문구를 채워넣으세요' },
  { num: '03', title: '링크 공유', desc: '저장하면 바로 공유 가능한 모바일 청첩장이 완성됩니다' },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-50 text-zinc-900 overflow-x-hidden">

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center pb-20">
        {/* Soft background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-rose-100 opacity-50 blur-3xl" />
          <div className="absolute top-1/2 -left-48 w-[400px] h-[400px] rounded-full bg-amber-50 opacity-60 blur-3xl" />
          <div className="absolute -bottom-24 right-1/4 w-[350px] h-[350px] rounded-full bg-pink-50 opacity-50 blur-3xl" />
        </div>

        <div className="relative w-full max-w-2xl mx-auto flex flex-col items-center gap-10">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/80 backdrop-blur border border-rose-100 rounded-full text-xs text-rose-400 font-medium shadow-sm">
            <span className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-pulse" />
            무료 · 로그인 불필요
          </div>

          {/* Title */}
          <div className="space-y-4">
            <h1
              className="text-7xl sm:text-8xl text-zinc-900 tracking-tight leading-none"
              style={{ fontFamily: "'DM Serif Display', 'Cormorant Garamond', serif", fontStyle: 'italic' }}
            >
              Wedding<br />Builder
            </h1>
            <p className="text-zinc-500 text-xl font-light leading-relaxed max-w-sm mx-auto"
               style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
              5분 만에 완성하는<br />감성 모바일 청첩장
            </p>
          </div>

          {/* Phone mockups */}
          <div className="flex items-center justify-center gap-3 py-4">
            {PREVIEWS.map((p, i) => (
              <div
                key={i}
                className={`relative rounded-[24px] overflow-hidden shadow-xl ${p.tilt} ${i === 1 ? 'scale-110 shadow-2xl z-10' : 'scale-95 opacity-75'}`}
                style={{ width: 88, height: 152, background: p.bg, flexShrink: 0 }}
              >
                {/* notch */}
                <div className="absolute top-0 left-0 right-0 h-7 flex items-center justify-center z-10">
                  <div className="w-12 h-3 rounded-full bg-black/80" />
                </div>
                {/* content */}
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-5 px-2 gap-0.5">
                  <div style={{ color: p.textColor, fontSize: 6, fontStyle: 'italic', fontFamily: 'DM Serif Display, serif', opacity: 0.75 }}>
                    We&apos;re getting Married!
                  </div>
                  <div style={{ color: p.textColor, fontSize: 10, fontWeight: 600, fontFamily: 'DM Serif Display, serif', lineHeight: 1.2 }}>
                    수용 ♥ 동미
                  </div>
                  <div style={{ color: p.textColor, fontSize: 5, opacity: 0.6, marginTop: 2, letterSpacing: '0.1em' }}>
                    2026년 5월 3일
                  </div>
                  <div style={{ width: 20, height: 1, background: p.accent, marginTop: 4, opacity: 0.7 }} />
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="w-full max-w-xs space-y-3">
            <Link
              href="/edit/draft"
              className="group inline-flex items-center justify-center w-full py-4 px-8 bg-zinc-900 text-white rounded-2xl text-base font-semibold tracking-tight hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-900/20 active:scale-[0.98]"
              style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
            >
              청첩장 만들기
              <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">→</span>
            </Link>
            <p className="text-zinc-400 text-xs">신용카드 · 회원가입 필요 없음</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <h2
            className="text-3xl text-center text-zinc-800 mb-12"
            style={{ fontFamily: "'DM Serif Display', serif", fontStyle: 'italic' }}
          >
            이런 분들께 추천해요
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: '🌿', title: '감성을 원하는 커플', desc: '모던·빈티지·내추럴 등 다양한 무드의 템플릿' },
              { icon: '⚡', title: '빠르게 준비하는 분', desc: '5분 안에 내용 입력 → 링크 생성 완료' },
              { icon: '💸', title: '비용을 줄이고 싶은 분', desc: '완전 무료, 추가 요금 없음' },
            ].map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-6 border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl mb-3">{f.icon}</div>
                <div className="text-sm font-semibold text-zinc-800 mb-1.5">{f.title}</div>
                <div className="text-xs text-zinc-500 leading-relaxed">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 bg-zinc-900 text-white">
        <div className="max-w-2xl mx-auto">
          <h2
            className="text-3xl text-center mb-12 text-white/90"
            style={{ fontFamily: "'DM Serif Display', serif", fontStyle: 'italic' }}
          >
            만드는 방법
          </h2>
          <div className="space-y-6">
            {STEPS.map((s, i) => (
              <div key={s.num} className="flex items-start gap-6">
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-sm font-light text-white/50"
                  style={{ fontFamily: "'DM Serif Display', serif" }}
                >
                  {s.num}
                </div>
                <div className="pt-2">
                  <div className="text-base font-semibold mb-1">{s.title}</div>
                  <div className="text-sm text-white/50 leading-relaxed">{s.desc}</div>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="absolute left-[2.75rem] mt-12 w-px h-6 bg-white/10" style={{ position: 'relative', margin: 0 }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 px-6 text-center bg-stone-50">
        <div className="max-w-sm mx-auto space-y-6">
          <h2
            className="text-4xl text-zinc-900 leading-tight"
            style={{ fontFamily: "'DM Serif Display', serif", fontStyle: 'italic' }}
          >
            지금 바로<br />시작해보세요
          </h2>
          <p className="text-zinc-400 text-sm">만들어진 청첩장은 링크로 누구에게나 공유 가능합니다</p>
          <Link
            href="/edit/draft"
            className="inline-flex items-center justify-center w-full py-4 bg-zinc-900 text-white rounded-2xl text-base font-semibold hover:bg-zinc-800 transition-colors"
          >
            무료로 시작하기 →
          </Link>
        </div>
      </section>

    </main>
  )
}
