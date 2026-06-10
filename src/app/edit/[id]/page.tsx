import { supabase } from '@/lib/supabase'
import EditLoader from '@/components/builder/EditLoader'
import { InvitationData } from '@/types/invitation'

export default async function EditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ token?: string }>
}) {
  const { id } = await params
  const { token } = await searchParams

  let initialData: InvitationData | null = null
  let savedId: string | null = null
  let editToken: string | null = null

  // id가 'draft'가 아닐 때만 Supabase에서 불러옴
  if (id !== 'draft') {
    const { data } = await supabase
      .from('invitations')
      .select('data')
      .eq('id', id)
      .single()

    if (data) {
      initialData = data.data as InvitationData
      savedId = id
      editToken = token ?? null
    }
  }

  return (
    <EditLoader initialData={initialData} savedId={savedId} editToken={editToken} />
  )
}
