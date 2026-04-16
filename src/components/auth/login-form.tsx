import { Button } from '#/components/ui/button'
import { Separator } from '#/components/ui/separator'
import { authClient } from '#/lib/auth-client'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'

function toInternalPath(maybeUrl: string | undefined) {
  if (!maybeUrl) return null
  if (maybeUrl.startsWith('/')) return maybeUrl
  try {
    const url = new URL(maybeUrl)
    return `${url.pathname}${url.search}${url.hash}`
  } catch {
    return null
  }
}

export default function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState<'github' | 'google' | null>(
    null,
  )

  const handleSocialLogin = async (provider: 'github' | 'google') => {
    try {
      setIsSubmitting(provider)
      await authClient.signIn.social({
        provider,
        fetchOptions: {
          onSuccess: () => {
            toast.success('Logged in successfully!')
            const internalRedirect = toInternalPath(redirectTo)
            navigate({ to: internalRedirect ?? '/' })
          },
          onError: ({ error }) => {
            toast.error(error.message || 'Failed to login. Please try again.')
            setIsSubmitting(null)
          },
        },
      })
    } catch {
      toast.error('Failed to login. Please try again.')
      setIsSubmitting(null)
    }
  }

  return (
    <div className="space-y-4">
      <Button
        variant="outline"
        className="w-full h-11 rounded-xl gap-3"
        onClick={() => handleSocialLogin('github')}
        disabled={isSubmitting !== null}
      >
        <svg className="size-5" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
        </svg>
        {isSubmitting === 'github' ? 'Redirecting...' : 'Continue with GitHub'}
      </Button>

      <Button
        variant="outline"
        className="w-full h-11 rounded-xl gap-3"
        onClick={() => handleSocialLogin('google')}
        disabled={isSubmitting !== null}
      >
        <svg className="size-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        {isSubmitting === 'google' ? 'Redirecting...' : 'Continue with Google'}
      </Button>

      <div className="relative py-2">
        <Separator />
      </div>

      <p className="text-center text-xs text-muted-foreground">
        By signing in, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  )
}
