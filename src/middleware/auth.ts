import { auth } from '@/lib/auth'
import {
  isLoginPath,
  isPublicPath,
} from '@/lib/auth-paths'
import { redirect } from '@tanstack/react-router'
import { createMiddleware } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'

// Kept here so it’s obvious what we consider public.
// `isPublicPath` is the actual check used below.
// (List lives in `src/lib/auth-paths.ts`)

export const authFnMiddleware = createMiddleware({ type: 'function' }).server(
  async ({ next }) => {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })

    if (!session) throw redirect({ to: AUTH_LOGIN_PATH })

    return next({ context: { session } })
  },
)

export const authMiddleware = createMiddleware({ type: 'request' }).server(
  async ({ request, next }) => {
    const { pathname } = new URL(request.url)
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })

    // logged-in users should not visit login
    if (isLoginPath(pathname) && session) throw redirect({ to: '/' })

    // allow public paths
    if (isPublicPath(pathname)) return next()

    // protect everything else
    if (!session) throw redirect({ to: AUTH_LOGIN_PATH })

    return next({ context: { session } })
  },
)