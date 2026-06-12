import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { DoljanchiData } from '@/types/doljanchi'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json() as { data: DoljanchiData; edit_token: string }
  const photos = (body.data.photos ?? []).filter((u: string) => !u.startsWith('blob:'))
  const dataWithoutPhotos = { ...body.data, photos }

  const db = createServerClient()
  const { data: existing, error: fetchErr } = await db
    .from('invitations')
    .select('edit_token')
    .eq('id', id)
    .single()

  if (fetchErr || !existing) return NextResponse.json({ error: 'not found' }, { status: 404 })
  if (existing.edit_token !== body.edit_token) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  const { error } = await db
    .from('invitations')
    .update({ data: dataWithoutPhotos })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
