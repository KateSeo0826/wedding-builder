'use client'

import { useEffect } from 'react'
import { useDoljanchiStore } from '@/lib/doljanchi-store'
import { DoljanchiData } from '@/types/doljanchi'
import DoljanchiPreviewPanel from '@/components/doljanchi/DoljanchiPreviewPanel'
import DoljanchiEditPanel from '@/components/doljanchi/DoljanchiEditPanel'
import DoljanchiNav from '@/components/doljanchi/DoljanchiNav'

interface Props {
  initialData: DoljanchiData | null
  savedId: string | null
  editToken: string | null
}

export default function DoljanchiLoader({ initialData, savedId, editToken }: Props) {
  const { update, setSaved } = useDoljanchiStore()

  useEffect(() => {
    if (initialData) {
      update(initialData)
      if (savedId && editToken) setSaved(savedId, editToken)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-zinc-100">
      <DoljanchiNav />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex items-center justify-center bg-zinc-200 overflow-hidden">
          <DoljanchiPreviewPanel />
        </div>
        <div className="w-[380px] flex-shrink-0 bg-white border-l border-zinc-200 overflow-y-auto">
          <DoljanchiEditPanel />
        </div>
      </div>
    </div>
  )
}
