import LoginForm from '@/components/auth/login-form'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Presentation } from 'lucide-react'
import { z } from 'zod'

export const Route = createFileRoute('/_auth/login')({
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
  component: LoginPage,
})

function LoginPage() {
  const { redirect } = Route.useSearch()

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="glass rounded-3xl p-8 space-y-6">
          {/* Logo */}
          <div className="flex flex-col items-center gap-3">
            <Link to="/" className="no-underline">
              <div className="size-14 rounded-2xl bg-primary flex items-center justify-center">
                <Presentation className="size-8 text-primary-foreground" />
              </div>
            </Link>
            <div className="text-center">
              <h1 className="text-2xl font-bold">
                Welcome to <span className="text-primary">PPT.ai</span>
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Sign in to create beautiful presentations
              </p>
            </div>
          </div>

          {/* Login form */}
          <LoginForm redirectTo={redirect} />
        </div>
      </div>
    </div>
  )
}
