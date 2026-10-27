import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const defaultUrl = 'https://gjxpellqcgxlicbylbhe.supabase.co'
  const urlEnv = process.env.NEXT_PUBLIC_SUPABASE_URL || defaultUrl
  const keyEnv =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    'placeholder'

  // Clean up stale cookies from other clinic projects if detected
  const staleCookies = [
    'sb-sxfowiececnrqytbtpcb-auth-token',
    'sb-khkxwddrkwmmmcxbreau-auth-token',
  ]
  staleCookies.forEach((name) => {
    if (request.cookies.has(name)) {
      supabaseResponse.cookies.delete(name)
    }
  })

  const supabase = createServerClient(
    urlEnv,
    keyEnv,
    {
      cookieOptions: {
        name: 'sb-gjxpellqcgxlicbylbhe-auth-token',
      },
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          staleCookies.forEach((name) => {
            if (request.cookies.has(name)) {
              supabaseResponse.cookies.delete(name)
            }
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/auth') &&
    !request.nextUrl.pathname.startsWith('/forgot-password') &&
    !request.nextUrl.pathname.startsWith('/reset-password') &&
    !request.nextUrl.pathname.startsWith('/services') &&
    !request.nextUrl.pathname.startsWith('/about') &&
    !request.nextUrl.pathname.startsWith('/contact') &&
    !request.nextUrl.pathname.startsWith('/terms-of-service') &&
    !request.nextUrl.pathname.startsWith('/privacy-policy') &&
    !request.nextUrl.pathname.startsWith('/book-appointment') &&
    request.nextUrl.pathname !== '/'
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
