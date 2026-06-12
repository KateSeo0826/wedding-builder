import { supabase } from '@/lib/supabase'

const BUCKET = 'photos'

export async function uploadPhoto(url: string, prefix: string): Promise<string> {
  // Already a permanent URL — return as-is
  if (!url.startsWith('blob:') && !url.startsWith('data:')) return url
  // Empty
  if (!url) return url

  try {
    const res = await fetch(url)
    const blob = await res.blob()
    const ext = blob.type.split('/')[1]?.replace('jpeg', 'jpg') ?? 'jpg'
    const path = `${prefix}-${Date.now()}.${ext}`

    const { data, error } = await supabase.storage
      .from(BUCKET)
      .upload(path, blob, { upsert: true, contentType: blob.type })

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(data.path)
    return publicUrl
  } catch {
    // Upload failed — return empty string (photo won't be shown)
    return ''
  }
}

export async function uploadPhotos(urls: string[], prefix: string): Promise<string[]> {
  const results = await Promise.all(urls.map((url, i) => uploadPhoto(url, `${prefix}-${i}`)))
  return results.filter(Boolean)
}
