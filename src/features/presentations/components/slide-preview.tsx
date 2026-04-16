type SlidePreviewProps = {
  slide: {
    id: string
    order: number
    title: string
    content: string
    notes?: string | null
    imageUrl?: string | null
  }
}

export function SlidePreview({ slide }: SlidePreviewProps) {
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="aspect-video relative bg-gradient-to-br from-background to-muted">
        {slide.imageUrl && (
          <img
            src={slide.imageUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
        )}
        <div className="relative z-10 h-full flex flex-col justify-center p-8 md:p-12">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">{slide.title}</h2>
          <div className="text-base md:text-lg text-muted-foreground whitespace-pre-line max-w-2xl">
            {slide.content}
          </div>
        </div>
      </div>
      {slide.notes && (
        <div className="p-4 border-t border-border/50 bg-muted/30">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">Speaker notes:</span> {slide.notes}
          </p>
        </div>
      )}
    </div>
  )
}
