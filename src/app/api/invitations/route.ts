import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { InvitationData } from '@/types/invitation'

export async function POST(req: NextRequest) {
  const body = await req.json() as { data: InvitationData }

  // blob URL인 사진은 다른 기기에서 동작하지 않으므로 제거
  const { photos: _photos, ...dataWithoutPhotos } = body.data

  const db = createServerClient()
  const { data, error } = await db
    .from('invitations')
    .insert({ data: dataWithoutPhotos })
    .select('id, edit_token')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ id: data.id, edit_token: data.edit_token })
}
