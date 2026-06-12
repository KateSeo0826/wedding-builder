import Link from "next/link";

const PREVIEWS = [
  {
    bg: "linear-gradient(160deg, #f5f0eb 0%, #e8ddd6 100%)",
    textColor: "#7c6b5c",
    accent: "#c85070",
    tilt: "-rotate-3",
  },
  {
    bg: "linear-gradient(160deg, #1a1a1a 0%, #2d2d2d 100%)",
    textColor: "#e8d5c0",
    accent: "#c9a96e",
    tilt: "",
  },
  {
    bg: "linear-gradient(160deg, #f0f4f0 0%, #dde8dd 100%)",
    textColor: "#2d4a35",
    accent: "#5a8a6a",
    tilt: "rotate-3",
  },
];

const STEPS = [
  {
    num: "01",
    title: "템플릿 선택",
    desc: "10가지 감성 디자인 중 원하는 스타일을 골라보세요",
  },
  {
    num: "02",
    title: "내용 입력",
    desc: "신랑·신부 이름, 날짜, 장소, 문구를 채워넣으세요",
  },
  {
    num: "03",
    title: "링크 공유",
    desc: "저장하면 바로 공유 가능한 모바일 청첩장이 완성됩니다",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#faf9f6] text-zinc-900 overflow-x-hidden font-sans">
      {/* 1. 상단 알림 배너 */}
      <div className="w-full bg-[#1a1a1a] text-white text-xs py-2.5 px-4 text-center overflow-hidden whitespace-nowrap tracking-wider font-light">
        <span className="inline-block animate-marquee">
          🎉 모바일 청첩장 구매 고객 비즈하우스 20% 할인 쿠폰 증정 이벤트 진행
          중! &nbsp;&nbsp;&nbsp;&nbsp; 🎉 모바일 청첩장 구매 고객 비즈하우스 20%
          할인 쿠폰 증정 이벤트 진행 중!
        </span>
      </div>

      {/* 2. 네비게이션 바 (GNB) */}
      <header className="w-full border-b border-zinc-100 bg-white/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* 로고명 */}
            <Link
              href="/"
              className="text-xl font-semibold tracking-tight text-zinc-900"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Salon de Letter
            </Link>
            {/* 메뉴 링크 */}
            <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-500 font-medium">
              <Link
                href="/wedding"
                className="hover:text-zinc-900 transition-colors"
              >
                모바일 청첩장
              </Link>
              <Link
                href="/thanks"
                className="hover:text-zinc-900 transition-colors"
              >
                모바일 감사장
              </Link>
              <Link
                href="/qr"
                className="hover:text-zinc-900 transition-colors"
              >
                QR코드 보기
              </Link>
              <Link
                href="/store"
                className="hover:text-zinc-900 transition-colors"
              >
                네이버스토어
              </Link>
              <Link
                href="/cs"
                className="hover:text-zinc-900 transition-colors"
              >
                고객센터
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <button className="text-zinc-400 hover:text-zinc-600 hidden sm:inline-block">
              ⭐️ 즐겨찾기추가
            </button>
            <Link
              href="/history"
              className="px-4 py-2 border border-zinc-200 rounded-full hover:bg-zinc-50 transition-colors"
            >
              제작 내역
            </Link>
          </div>
        </div>
      </header>

      {/* 3. 시네마틱 히어로 섹션 */}
      <section className="relative w-full min-h-[85vh] flex flex-col items-center justify-center px-6 py-20 text-center bg-zinc-900 text-white overflow-hidden">
        {/* 이미지 무드의 어두운 배경 오버레이 (참고 이미지 스타일) */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity scale-105 pointer-events-none"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1544078751-58fed2b32c83?q=80&w=1800')`, // 숲속/체어 무드의 샘플 이미지 플레이스홀더
          }}
        />
        {/* 그라데이션 오버레이로 텍스트 가독성 확보 */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950/50" />

        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
          <span className="text-xs uppercase tracking-[0.3em] text-zinc-400 font-medium mb-6 block">
            MOBILE INVITATION
          </span>

          <h1
            className="text-5xl sm:text-7xl lg:text-8xl tracking-tight leading-[1.05] font-light mb-8"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Love <br className="sm:hidden" />
            <span className="italic font-normal text-stone-300">
              becomes
            </span>{" "}
            <br />a letter
          </h1>

          <p className="text-zinc-300 text-sm sm:text-base font-light tracking-wide max-w-md mx-auto mb-12 border-t border-b border-white/10 py-3">
            두 사람의 사랑을 가장 다정하게 담은 모바일 청첩장
          </p>

          {/* 인라인 메인 액션 버튼 2종 */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-sm justify-center">
            <Link
              href="/edit/draft"
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-zinc-900 font-medium text-sm rounded-full shadow-lg hover:bg-zinc-100 transition-all transform active:scale-98 text-center"
            >
              무료 시안 만들기
            </Link>
            <Link
              href="/samples"
              className="w-full sm:w-auto px-8 py-3.5 bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium text-sm rounded-full hover:bg-white/20 transition-all text-center"
            >
              샘플 보기
            </Link>
          </div>

          {/* 스크롤 다운 아이콘 */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-60">
            <span className="text-[10px] tracking-[0.2em] font-light text-zinc-400">
              SCROLL DOWN
            </span>
            <span className="w-px h-6 bg-zinc-500 animate-bounce" />
          </div>
        </div>
      </section>

      {/* 4. 신뢰도 지표 및 평점 통계 섹션 */}
      <section className="bg-white border-b border-zinc-100 py-12 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center">
          <div className="space-y-1">
            <p
              className="text-3xl font-light text-zinc-900"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              61,000+
            </p>
            <p className="text-xs text-zinc-500 font-medium">
              살롱드레터를 먼저 경험한 수많은 커플들
            </p>
          </div>
          <div className="space-y-1 md:border-x md:border-zinc-100 px-4">
            <p
              className="text-3xl text-amber-500 tracking-tight"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              ★★★★★
            </p>
            <p className="text-sm font-semibold text-zinc-800">4.98 / 5.0</p>
          </div>
          <div className="space-y-1">
            <p
              className="text-3xl font-light text-zinc-900"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              12,600+
            </p>
            <p className="text-xs text-zinc-500 font-medium">
              개의 실제 구매 리뷰 데이터
            </p>
          </div>
        </div>
      </section>

      {/* 5. POINTS TO LOVE (핵심 특장점 3줄 레이아웃) */}
      <section className="py-24 px-6 bg-stone-50/50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16 space-y-2">
            <span className="text-xs text-zinc-400 font-bold tracking-widest uppercase">
              POINTS TO LOVE
            </span>
            <h2 className="text-2xl sm:text-3xl font-normal text-zinc-800 tracking-tight">
              처음 제작하는 분도 안심하고 시작할 수 있는 이유
            </h2>
          </div>

          <div className="space-y-12">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start border-l-2 border-zinc-300 pl-6">
              <span className="text-xl font-serif text-zinc-400 shrink-0">
                01
              </span>
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 mb-1">
                  15분 만에 첫 시안 완성
                </h3>
                <p className="text-sm text-zinc-500 leading-relaxed font-light">
                  샘플 문구와 실시간 미리보기를 보며 차근차근 채워 넣으면 처음
                  제작하는 분도 어렵지 않게 완성할 수 있습니다.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start border-l-2 border-zinc-300 pl-6">
              <span className="text-xl font-serif text-zinc-400 shrink-0">
                02
              </span>
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 mb-1">
                  횟수 제한 없는 무제한 수정
                </h3>
                <p className="text-sm text-zinc-500 leading-relaxed font-light">
                  사진, 문구, 메뉴 순서, 계좌 번호 정보 등 구매 전후 상관없이
                  원하시는 만큼 언제든지 자유롭게 수정이 가능합니다.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start border-l-2 border-zinc-300 pl-6">
              <span className="text-xl font-serif text-zinc-400 shrink-0">
                03
              </span>
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 mb-1">
                  무료 시안, 먼저 만들고 결정
                </h3>
                <p className="text-sm text-zinc-500 leading-relaxed font-light">
                  결제 부담 없이 시안을 먼저 완벽하게 만들어보신 뒤, 전체
                  디자인이 마음에 드시면 그때 최종 결정을 하실 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. 미리보기 스냅 모형 목업 섹션 */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-xl font-medium text-zinc-800 mb-2">
            실시간 감성 디자인 미리보기
          </h2>
          <p className="text-xs text-zinc-400 mb-10">
            모던 · 빈티지 · 내추럴 등 다양한 무드를 커스텀해 보세요.
          </p>

          <div className="flex items-center justify-center gap-4 py-4 overflow-x-auto">
            {PREVIEWS.map((p, i) => (
              <div
                key={i}
                className={`relative rounded-[32px] overflow-hidden shadow-xl border border-zinc-200/50 ${p.tilt} ${i === 1 ? "scale-105 shadow-2xl z-10" : "scale-95 opacity-80"}`}
                style={{
                  width: 140,
                  height: 240,
                  background: p.bg,
                  flexShrink: 0,
                }}
              >
                {/* 펀치홀 노치 */}
                <div className="absolute top-2 left-0 right-0 flex items-center justify-center z-10">
                  <div className="w-10 h-2.5 rounded-full bg-black/70" />
                </div>
                {/* 목업 내부 컨텐츠 */}
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 px-3 gap-1">
                  <div
                    style={{
                      color: p.textColor,
                      fontSize: 8,
                      fontStyle: "italic",
                      fontFamily: "DM Serif Display, serif",
                      opacity: 0.8,
                    }}
                  >
                    We&apos;re getting Married!
                  </div>
                  <div
                    style={{
                      color: p.textColor,
                      fontSize: 13,
                      fontWeight: 600,
                      lineHeight: 1.2,
                    }}
                  >
                    수용 ♥ 동미
                  </div>
                  <div
                    style={{
                      color: p.textColor,
                      fontSize: 7,
                      opacity: 0.6,
                      letterSpacing: "0.05em",
                    }}
                  >
                    2026년 05월 03일
                  </div>
                  <div
                    style={{
                      width: 30,
                      height: 1,
                      background: p.accent,
                      marginTop: 4,
                      opacity: 0.8,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. 서비스 제작 유형 분기 (청첩장 vs 돌잔치) */}
      <section className="py-24 px-6 bg-zinc-900 text-white relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
            <h2
              className="text-3xl font-light"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              어떤 감동을 <span className="italic">만들어볼까요?</span>
            </h2>
            <p className="text-zinc-400 text-sm font-light">
              가장 특별한 순간에 어울리는 최적화된 초대 장치를 제공합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 왼쪽 카드: 결혼 청첩장 */}
            <div className="bg-zinc-800/50 border border-zinc-800 rounded-2xl p-8 flex flex-col justify-between hover:border-zinc-700 transition-all">
              <div className="space-y-4">
                <div className="text-4xl">💍</div>
                <h3 className="text-xl font-semibold">모바일 청첩장 빌더</h3>
                <p className="text-zinc-400 text-sm font-light leading-relaxed">
                  레터링 애니메이션, 혼주용 맞춤 비주얼 분할, 디테일한 RSVP 인원
                  체크와 축하 화환 연동까지 완벽하게 지원합니다.
                </p>
              </div>
              <Link
                href="/edit/draft"
                className="mt-8 inline-flex items-center justify-center w-full py-4 bg-white text-zinc-950 rounded-xl text-sm font-semibold hover:bg-zinc-100 transition-all"
              >
                청첩장 만들기 →
              </Link>
            </div>

            {/* 오른쪽 카드: 돌잔치 초대장 */}
            <div className="bg-zinc-800/50 border border-zinc-800 rounded-2xl p-8 flex flex-col justify-between hover:border-zinc-700 transition-all">
              <div className="space-y-4">
                <div className="text-4xl">🎂</div>
                <h3 className="text-xl font-semibold">돌잔치 초대장 빌더</h3>
                <p className="text-zinc-400 text-sm font-light leading-relaxed">
                  소중한 아이의 성장 타임라인과 첫돌 축하 메시지 방명록, 모바일
                  양가 연락처 연동 기능을 손쉽게 맞춤화 하세요.
                </p>
              </div>
              <Link
                href="/doljanchi/edit/draft"
                className="mt-8 inline-flex items-center justify-center w-full py-4 bg-rose-500 text-white rounded-xl text-sm font-semibold hover:bg-rose-600 transition-all"
              >
                돌잔치 초대장 만들기 →
              </Link>
            </div>
          </div>

          <div className="text-center mt-10 text-xs text-zinc-500 font-light">
            * 신용카드 선결제 또는 회원가입 과정 없이 우선 무료 시안 제작이 완전
            가능합니다[cite: 275].
          </div>
        </div>
      </section>

      {/* 8. 만드는 방법 (How it works 단계) */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <h2
            className="text-3xl text-center mb-16 text-zinc-800"
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontStyle: "italic",
            }}
          >
            How it works
          </h2>
          <div className="space-y-8 relative">
            {STEPS.map((s, i) => (
              <div key={s.num} className="flex items-start gap-6 relative">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-stone-50 border border-stone-200 flex items-center justify-center text-sm font-medium text-zinc-700">
                  {s.num}
                </div>
                <div className="pt-1.5">
                  <h4 className="text-base font-semibold text-zinc-900 mb-1">
                    {s.title}
                  </h4>
                  <p className="text-sm text-zinc-500 leading-relaxed font-light">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. 푸터 정보 */}
      <footer className="bg-stone-100 text-zinc-400 text-xs py-12 px-6 border-t border-stone-200">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="space-y-1 font-light">
            <p className="font-semibold text-zinc-600">Salon de Letter</p>
            <p>
              비교할수록 더 선명해지는 가치, 예비부부를 위한 가장 충실한 모바일
              레터[cite: 276, 327].
            </p>
            <p className="pt-2">© Needi All rights reserved[cite: 328].</p>
          </div>
          <div className="flex gap-4 underline text-zinc-500">
            <Link href="/terms">이용약관</Link>
            <Link href="/privacy">개인정보처리방침</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
