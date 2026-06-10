import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { InvitationData } from '@/types/invitation'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json() as { data: InvitationData; edit_token: string }
  const { photos: _photos, ...dataWithoutPhotos } = body.data

  const db = createServerClient()

  // edit_token 검증
  const { data: existing, error: fetchError } = await db
    .from('invitations')
    .select('edit_token')
    .eq('id', id)
    .single()

  if (fetchError || !existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  if (existing.edit_token !== body.edit_token) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { error } = await db
    .from('invitations')
    .update({ data: dataWithoutPhotos, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
