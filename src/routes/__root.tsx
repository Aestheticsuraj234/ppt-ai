import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'

import Navbar from '../components/navbar'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'
import QueryClientProvider from '#/integrations/tanstack-query/root-provider'
import { Toaster } from '#/components/ui/sonner'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'PPT.ai - Generate presentations from text',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  component: RootLayout,
  shellComponent: RootDocument,
})

function RootLayout() {
  return (
    <div className="min-h-svh">
      <Navbar />
      <Outlet />
    </div>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <HeadContent />
      </head>
      <body className="font-sans antialiased bg-background text-foreground selection:bg-primary/20">
        <QueryClientProvider>
          {children}
          <Toaster closeButton position="top-center" richColors />
          <Scripts />
        </QueryClientProvider>
      </body>
    </html>
  )
}
