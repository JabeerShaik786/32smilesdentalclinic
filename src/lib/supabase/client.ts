import { createBrowserClient } from '@supabase/ssr'

const DEFAULT_SUPABASE_URL = 'https://gjxpellqcgxlicbylbhe.supabase.co'

let client: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    'placeholder'

  if (typeof window !== 'undefined') {
    // Clean up stale cookies from previous or other clinic projects if present to avoid JWT mismatch
    const staleCookies = [
      'sb-sxfowiececnrqytbtpcb-auth-token',
      'sb-khkxwddrkwmmmcxbreau-auth-token',
    ]
    staleCookies.forEach((name) => {
      if (document.cookie.includes(name)) {
        document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax;`
      }
    })
  }

  if (!client) {
    client = createBrowserClient(url, key, {
      isSingleton: true,
      cookieOptions: {
        name: 'sb-gjxpellqcgxlicbylbhe-auth-token',
      },
    })
  }

  return client
}
