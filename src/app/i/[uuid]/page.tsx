import { createServerClient } from '@/lib/supabase'
import InvitationView from '@/components/invitation/InvitationView'
import { notFound } from 'next/navigation'
import { InvitationData } from '@/types/invitation'

export default async function PublicInvitationPage({
  params,
}: {
  params: Promise<{ uuid: string }>
}) {
  const { uuid } = await params

  const { data, error } = await createServerClient()
    .from('invitations')
    .select('data')
    .eq('id', uuid)
    .single()

  if (error || !data) notFound()

  const invitationData = data.data as InvitationData

  return (
    <div className="min-h-screen bg-zinc-900 flex items-start justify-center py-0">
      <div className="w-full max-w-[430px] min-h-screen">
        <InvitationView data={invitationData} />
      </div>
    </div>
  )
}
