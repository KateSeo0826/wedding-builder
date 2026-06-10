'use client'

import { useEffect } from 'react'
import { useStore } from '@/lib/store'
import { InvitationData } from '@/types/invitation'
import PreviewPanel from '@/components/builder/PreviewPanel'
import EditPanel from '@/components/builder/EditPanel'
import BuilderNav from '@/components/builder/BuilderNav'

interface Props {
  initialData: InvitationData | null
  savedId: string | null
  editToken: string | null
}

export default function EditLoader({ initialData, savedId, editToken }: Props) {
  const { update, setSaved } = useStore()

  useEffect(() => {
    if (initialData) {
      update(initialData)
      if (savedId && editToken) setSaved(savedId, editToken)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-zinc-100">
      <BuilderNav />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex items-center justify-center bg-zinc-200 overflow-hidden">
          <PreviewPanel />
        </div>
        <div className="w-[380px] flex-shrink-0 bg-white border-l border-zinc-200 overflow-y-auto">
          <EditPanel />
        </div>
      </div>
    </div>
  )
}
