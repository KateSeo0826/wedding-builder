import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!

// 클라이언트 컴포넌트 + 서버 컴포넌트 읽기용 (anon key)
export const supabase = createClient(url, anonKey)

// API Route 전용 — service role (절대 클라이언트에 노출 금지)
export function createServerClient() {
  return createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  })
}
