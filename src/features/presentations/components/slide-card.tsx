import { useState } from 'react'
import { ImageIcon, Loader2 } from 'lucide-react'

type SlideCardProps = {
  slide: {
    id: string
    order: number
    title: string
    content: string
    notes?: string | null
    imageUrl?: string | null
  }
  isActive?: boolean
  onClick?: () => void
}

export function SlideCard({ slide, isActive, onClick }: SlideCardProps) {
  const [imageStatus, setImageStatus] = useState<'loading' | 'loaded' | 'error'>('loading')

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left rounded-xl p-3 transition-all ${
        isActive
          ? 'bg-primary/10 ring-2 ring-primary/50'
          : 'bg-card/50 hover:bg-card/80 border border-border/30 hover:border-border/60'
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`shrink-0 flex items-center justify-center size-6 rounded-md text-xs font-semibold ${
            isActive
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          {slide.order + 1}
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium line-clamp-1 mb-2">
            {slide.title}
          </h3>
          <div className="aspect-video rounded-lg overflow-hidden bg-muted relative">
            {slide.imageUrl ? (
              <>
                {imageStatus === 'loading' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <Loader2 className="size-5 text-muted-foreground animate-spin" />
                  </div>
                )}
                {imageStatus === 'error' && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/50 gap-1">
                    <ImageIcon className="size-5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Loading…
                    </span>
                  </div>
                )}
                <img
                  src={slide.imageUrl}
                  alt={slide.title}
                  className={`w-full h-full object-cover transition-opacity ${
                    imageStatus === 'loaded' ? 'opacity-100' : 'opacity-0'
                  }`}
                  loading="lazy"
                  onLoad={() => setImageStatus('loaded')}
                  onError={() => setImageStatus('error')}
                />
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs text-muted-foreground">
                  No image
                </span>
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-2">
            {slide.content}
          </p>
        </div>
      </div>
    </button>
  )
}
