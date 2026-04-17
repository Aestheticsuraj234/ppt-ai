import { authClient } from '#/lib/auth-client'
import { cn } from '#/lib/utils'
import { Link, useRouter } from '@tanstack/react-router'
import { LogOut, Moon, Presentation, Sun, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

type Theme = 'light' | 'dark'

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  const stored = localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export default function Navbar() {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    const initial = getInitialTheme()
    setTheme(initial)
    document.documentElement.classList.toggle('dark', initial === 'dark')
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('theme', next)
    document.documentElement.classList.toggle('dark', next === 'dark')
  }

  const handleSignOut = async () => {
    await authClient.signOut()
    router.navigate({ to: '/login' })
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="mx-auto max-w-5xl px-4 py-3">
        <div className="glass rounded-2xl px-4 py-2.5 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 no-underline">
            <div className="size-9 rounded-xl bg-primary flex items-center justify-center">
              <Presentation className="size-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg text-foreground">
              PPT<span className="text-primary">.ai</span>
            </span>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-xl"
            >
              {theme === 'dark' ? (
                <Sun className="size-5" />
              ) : (
                <Moon className="size-5" />
              )}
            </Button>

            {/* User menu */}
            {isPending ? (
              <div className="size-9 rounded-full bg-muted animate-pulse" />
            ) : session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative size-9 rounded-full p-0"
                  >
                    <Avatar className="size-9 border-2 border-primary/30">
                      <AvatarImage
                        src={session.user.image}
                        alt={session.user.name}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {session.user.name ? (
                          session.user.name.charAt(0).toUpperCase()
                        ) : (
                          <User className="size-4" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 glass border-border/50"
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium">{session.user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {session.user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-destructive focus:text-destructive cursor-pointer"
                  >
                    <LogOut className="mr-2 size-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild size="sm" className="rounded-xl">
                <Link to="/login">Sign in</Link>
              </Button>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
