'use client'

import { useStore } from '@/lib/store'
import InvitationView from '@/components/invitation/InvitationView'

export default function PreviewPanel() {
  const { data, update, activeSection } = useStore()

  return (
    <div className="flex flex-col items-center gap-4">
      {/* 폰 프레임 */}
      <div
        className="relative bg-white shadow-2xl overflow-hidden"
        style={{
          width: 390,
          height: 720,
          borderRadius: 40,
          boxShadow: '0 32px 80px rgba(0,0,0,0.22), 0 0 0 1px rgba(0,0,0,0.08)',
        }}
      >
        {/* 상태바 notch */}
        <div className="absolute top-0 left-0 right-0 h-10 flex items-center justify-center z-50 pointer-events-none">
          <div className="w-28 h-6 bg-black rounded-full" />
        </div>
        {/* 청첩장 내용 (스크롤 가능) */}
        <div className="absolute inset-0 overflow-y-auto pt-10 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
          <InvitationView
            data={data}
            isPreview
            isDragMode={activeSection === 'lettering'}
            onPositionChange={(target, x, y) => {
              if (target === 'top') update({ letteringTopPosition: { x, y } })
              else if (target === 'names') update({ letteringNamesPosition: { x, y } })
              else update({ letteringDatePosition: { x, y } })
            }}
          />
        </div>
      </div>
      <p className="text-xs text-zinc-400 font-light tracking-wide">실시간 미리보기</p>
    </div>
  )
}
