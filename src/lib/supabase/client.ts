import { createBrowserClient } from '@supabase/ssr'

const DEFAULT_SUPABASE_URL = 'https://gjxpellqcgxlicbylbhe.supabase.co'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!url || url.includes('placeholder.supabase.co')) {
    throw new Error(
      'Missing or invalid NEXT_PUBLIC_SUPABASE_URL. Please configure your actual Supabase project URL (e.g. https://gjxpellqcgxlicbylbhe.supabase.co).'
    )
  }

  if (!key || key === 'placeholder') {
    throw new Error(
      'Missing or invalid NEXT_PUBLIC_SUPABASE_ANON_KEY / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. Please configure your actual Supabase public anon/publishable key.'
    )
  }

  return createBrowserClient(url, key)
}
