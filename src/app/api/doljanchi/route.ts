import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { DoljanchiData } from '@/types/doljanchi'

export async function POST(req: NextRequest) {
  const body = await req.json() as { data: DoljanchiData }
  const photos = (body.data.photos ?? []).filter((u: string) => !u.startsWith('blob:'))
  const dataToSave = { ...body.data, photos }
  const db = createServerClient()
  const { data, error } = await db
    .from('invitations')
    .insert({ data: dataToSave })
    .select('id, edit_token')
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ id: data.id, edit_token: data.edit_token })
}
