import { useCallback, useEffect, useState } from 'react'

export function useFullscreen(targetElementId: string) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const toggleFullscreen = useCallback(async () => {
    const elem = document.getElementById(targetElementId)
    if (!elem) return

    if (!document.fullscreenElement) {
      await elem.requestFullscreen()
      setIsFullscreen(true)
    } else {
      await document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [targetElementId])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () =>
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  return { isFullscreen, toggleFullscreen }
}

