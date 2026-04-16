import { auth } from '@/lib/auth'
import { redirect } from '@tanstack/react-router'
import { createMiddleware } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'

const PUBLIC_PATHS = [
  '/login',
  '/api/auth',
  '/api/inngest',
 
]

export const authFnMiddleware = createMiddleware({ type: 'function' }).server(
  async ({ next }) => {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })

    if (!session) {
      throw redirect({ to: '/login' })
    }

    return next({ context: { session } })
  },
)

export const authMiddleware = createMiddleware({ type: 'request' }).server(
  async ({ request, next }) => {
    const { pathname } = new URL(request.url)
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })

    // logged-in users should not visit login
    if (pathname.startsWith('/login') && session) {
      throw redirect({ to: '/' }) // or '/dashboard'
    }

    // allow public paths
    if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
      return next()
    }

    // protect everything else
    if (!session) {
      throw redirect({ to: '/login' })
    }

    return next({ context: { session } })
  },
)