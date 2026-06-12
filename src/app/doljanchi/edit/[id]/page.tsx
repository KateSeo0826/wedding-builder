import { createServerClient } from '@/lib/supabase'
import DoljanchiLoader from '@/components/doljanchi/DoljanchiLoader'
import { DoljanchiData } from '@/types/doljanchi'

export default async function DoljanchiEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ token?: string }>
}) {
  const { id } = await params
  const { token } = await searchParams

  let initialData: DoljanchiData | null = null
  let savedId: string | null = null
  let editToken: string | null = null

  if (id !== 'draft') {
    const { data } = await createServerClient()
      .from('invitations')
      .select('data')
      .eq('id', id)
      .single()

    if (data) {
      initialData = data.data as DoljanchiData
      savedId = id
      editToken = token ?? null
    }
  }

  return <DoljanchiLoader initialData={initialData} savedId={savedId} editToken={editToken} />
}
