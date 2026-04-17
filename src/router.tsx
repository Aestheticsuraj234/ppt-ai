import { createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { QueryClient } from '@tanstack/react-query'

// Create a new router instance
export const getRouter = () => {
  const router = createRouter({
    routeTree,
    context: {
      queryClient: new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      }),
    },

    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  })

  return router
}
