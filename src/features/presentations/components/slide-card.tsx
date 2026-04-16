import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'

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
  return (
    <Card
      className={`cursor-pointer transition-all hover:border-primary/40 ${
        isActive ? 'ring-2 ring-primary border-primary' : 'border-border/50'
      }`}
      onClick={onClick}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center size-6 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            {slide.order + 1}
          </span>
          <CardTitle className="text-sm line-clamp-1">{slide.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {slide.imageUrl ? (
          <div className="aspect-video rounded-lg overflow-hidden bg-muted mb-2">
            <img
              src={slide.imageUrl}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="aspect-video rounded-lg bg-muted/50 flex items-center justify-center mb-2">
            <span className="text-xs text-muted-foreground">
              Generating image…
            </span>
          </div>
        )}
        <p className="text-xs text-muted-foreground line-clamp-2">
          {slide.content}
        </p>
      </CardContent>
    </Card>
  )
}
