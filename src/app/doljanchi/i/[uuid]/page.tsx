import { supabase } from '@/lib/supabase'
import DoljanchiView from '@/components/doljanchi/DoljanchiView'
import { notFound } from 'next/navigation'
import { DoljanchiData } from '@/types/doljanchi'

export default async function DoljanchiPublicPage({
  params,
}: {
  params: Promise<{ uuid: string }>
}) {
  const { uuid } = await params

  const { data, error } = await supabase
    .from('invitations')
    .select('data')
    .eq('id', uuid)
    .single()

  if (error || !data) notFound()

  const invitationData = data.data as DoljanchiData

  return (
    <div className="min-h-screen bg-zinc-900 flex items-start justify-center py-0">
      <div className="w-full max-w-[430px] min-h-screen">
        <DoljanchiView data={invitationData} />
      </div>
    </div>
  )
}
