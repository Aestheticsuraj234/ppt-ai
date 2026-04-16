import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { Link } from '@tanstack/react-router'

import type { Presentation } from '../types/presentation.types'
import { presentationThumbnailUrl } from '../utils/thumbnail-url'

type PresentationCardProps = {
  presentation: Presentation
}

export function PresentationCard({ presentation: p }: PresentationCardProps) {
  const updated = new Date(p.updatedAt).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
  const thumb = presentationThumbnailUrl(p.id)

  return (
    <Link
      to="/presentations/$presentationId"
      params={{ presentationId: p.id }}
      className="block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
    >
      <Card className="h-full glass border-border/50 py-0 overflow-hidden transition-colors hover:border-primary/40">
        <div className="flex gap-4 p-4">
          <img
            src={thumb}
            alt=""
            width={72}
            height={72}
            className="rounded-xl border border-border/50 shrink-0 bg-background/30"
          />
          <CardHeader className="p-0 gap-1 flex-1 min-w-0">
            <CardTitle className="text-base line-clamp-2">{p.title}</CardTitle>
            <CardDescription className="line-clamp-2">
              {p.slideCount} slides · {p.style} · {p.tone}
            </CardDescription>
            <p className="text-xs text-muted-foreground pt-1">
              Updated {updated}
            </p>
          </CardHeader>
        </div>
      </Card>
    </Link>
  )
}
