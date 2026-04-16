import { getSession } from '@/lib/auth.functions'
import {
  LAYOUT_OPTIONS,
  SLIDE_STYLES,
  TONE_OPTIONS,
  presentationQueryKeys,
  presentationThumbnailUrl,
} from '#/features/presentations'
import {
  deletePresentation,
  regeneratePresentation,
  updatePresentation,
} from '#/features/presentations/actions/presentation-mutations'
import { getPresentationWithSlides } from '#/features/presentations/api/presentation-queries'
import { GenerationStatus } from '#/features/presentations/components/generation-status'
import { SlideCard } from '#/features/presentations/components/slide-card'
import { SlidePreview } from '#/features/presentations/components/slide-preview'
import { Button } from '#/components/ui/button'
import { Label } from '#/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { Slider } from '#/components/ui/slider'
import { Textarea } from '#/components/ui/textarea'
import {
  createFileRoute,
  Link,
  redirect,
  useNavigate,
} from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Save,
  Trash2,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/presentations/$presentationId')({
  beforeLoad: async ({ location }) => {
    const session = await getSession()

    if (!session) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      })
    }

    return { user: session.user }
  },
  component: PresentationDetailPage,
})

function PresentationDetailPage() {
  const { presentationId } = Route.useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, isPending, isError, error } = useQuery({
    queryKey: presentationQueryKeys.detail(presentationId),
    queryFn: () => getPresentationWithSlides({ data: { id: presentationId } }),
    refetchInterval: (query) => {
      const status = query.state.data?.status
      return status === 'GENERATING' ? 3000 : false
    },
  })

  const [title, setTitle] = useState('')
  const [prompt, setPrompt] = useState('')
  const [slideCount, setSlideCount] = useState([8])
  const [style, setStyle] = useState('minimal')
  const [tone, setTone] = useState('professional')
  const [layout, setLayout] = useState('balanced')
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    if (!data) return
    setTitle(data.title)
    setPrompt(data.prompt)
    setSlideCount([data.slideCount])
    setStyle(data.style)
    setTone(data.tone)
    setLayout(data.layout)
  }, [data])

  const updateMut = useMutation({
    mutationFn: () =>
      updatePresentation({
        data: {
          id: presentationId,
          title,
          prompt,
          slideCount: slideCount[0],
          style: style as (typeof SLIDE_STYLES)[number]['value'],
          tone: tone as (typeof TONE_OPTIONS)[number]['value'],
          layout: layout as (typeof LAYOUT_OPTIONS)[number]['value'],
        },
      }),
    onSuccess: () => {
      toast.success('Presentation saved')
      queryClient.invalidateQueries({ queryKey: presentationQueryKeys.list() })
      queryClient.invalidateQueries({
        queryKey: presentationQueryKeys.detail(presentationId),
      })
    },
    onError: (e) => {
      toast.error(e instanceof Error ? e.message : 'Could not save')
    },
  })

  const regenerateMut = useMutation({
    mutationFn: () => regeneratePresentation({ data: { id: presentationId } }),
    onSuccess: () => {
      toast.success('Regenerating slides…')
      queryClient.invalidateQueries({
        queryKey: presentationQueryKeys.detail(presentationId),
      })
    },
    onError: (e) => {
      toast.error(e instanceof Error ? e.message : 'Could not regenerate')
    },
  })

  const deleteMut = useMutation({
    mutationFn: () => deletePresentation({ data: { id: presentationId } }),
    onSuccess: () => {
      toast.success('Presentation deleted')
      queryClient.invalidateQueries({ queryKey: presentationQueryKeys.list() })
      queryClient.removeQueries({
        queryKey: presentationQueryKeys.detail(presentationId),
      })
      navigate({ to: '/' })
    },
    onError: (e) => {
      toast.error(e instanceof Error ? e.message : 'Could not delete')
    },
  })

  if (isPending) {
    return (
      <main className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto text-muted-foreground">
          Loading presentation…
        </div>
      </main>
    )
  }

  if (isError || !data) {
    return (
      <main className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto space-y-4">
          <p className="text-destructive">
            {error instanceof Error ? error.message : 'Something went wrong'}
          </p>
          <Button asChild variant="outline" className="rounded-xl">
            <Link to="/">Back home</Link>
          </Button>
        </div>
      </main>
    )
  }

  const thumb = presentationThumbnailUrl(data.id)
  const updatedLabel = new Date(data.updatedAt).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
  const slides = data.slides ?? []
  const activeSlide = slides[activeSlideIndex]
  const isGenerating = data.status === 'GENERATING'

  return (
    <main className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="rounded-xl gap-1"
            >
              <Link to="/">
                <ArrowLeft className="size-4" />
                Home
              </Link>
            </Button>
            <GenerationStatus status={data.status} />
          </div>
          <span className="text-sm text-muted-foreground">
            Updated {updatedLabel}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <div className="glass rounded-2xl p-4 flex items-center gap-4">
              <img
                src={thumb}
                alt=""
                width={56}
                height={56}
                className="rounded-xl border border-border/50 bg-background/30"
              />
              <div className="flex-1 min-w-0">
                <h1 className="font-semibold truncate">{data.title}</h1>
                <p className="text-sm text-muted-foreground">
                  {slides.length} slides
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl gap-1"
                  disabled={regenerateMut.isPending || isGenerating}
                  onClick={() => regenerateMut.mutate()}
                >
                  <RefreshCw
                    className={`size-4 ${isGenerating ? 'animate-spin' : ''}`}
                  />
                  {isGenerating ? 'Generating…' : 'Regenerate'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-xl"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  {showSettings ? 'Hide settings' : 'Edit settings'}
                </Button>
              </div>
            </div>

            {showSettings && (
              <div className="glass rounded-2xl p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pres-title" className="text-sm font-medium">
                    Title
                  </Label>
                  <input
                    id="pres-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="flex h-10 w-full rounded-xl border border-border/50 bg-background/50 px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Prompt</Label>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[120px] text-sm bg-background/50 border-border/50 rounded-xl resize-y"
                  />
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Slides: {slideCount[0]}
                    </Label>
                    <Slider
                      value={slideCount}
                      onValueChange={setSlideCount}
                      min={3}
                      max={20}
                      step={1}
                      className="py-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Style</Label>
                    <Select value={style} onValueChange={setStyle}>
                      <SelectTrigger className="bg-background/50 border-border/50 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass">
                        {SLIDE_STYLES.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Tone</Label>
                    <Select value={tone} onValueChange={setTone}>
                      <SelectTrigger className="bg-background/50 border-border/50 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass">
                        {TONE_OPTIONS.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Layout</Label>
                    <Select value={layout} onValueChange={setLayout}>
                      <SelectTrigger className="bg-background/50 border-border/50 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass">
                        {LAYOUT_OPTIONS.map((l) => (
                          <SelectItem key={l.value} value={l.value}>
                            {l.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-wrap justify-between gap-3 pt-2">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="rounded-xl gap-2"
                    disabled={deleteMut.isPending}
                    onClick={() => {
                      if (
                        typeof window !== 'undefined' &&
                        window.confirm(
                          'Delete this presentation? This cannot be undone.',
                        )
                      ) {
                        deleteMut.mutate()
                      }
                    }}
                  >
                    <Trash2 className="size-4" />
                    Delete
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    className="rounded-xl gap-2"
                    disabled={
                      updateMut.isPending || !title.trim() || !prompt.trim()
                    }
                    onClick={() => updateMut.mutate()}
                  >
                    <Save className="size-4" />
                    {updateMut.isPending ? 'Saving…' : 'Save changes'}
                  </Button>
                </div>
              </div>
            )}

            {activeSlide && (
              <div className="space-y-3">
                <SlidePreview slide={activeSlide} />
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl gap-1"
                    disabled={activeSlideIndex === 0}
                    onClick={() =>
                      setActiveSlideIndex((i) => Math.max(0, i - 1))
                    }
                  >
                    <ChevronLeft className="size-4" />
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {activeSlideIndex + 1} / {slides.length}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl gap-1"
                    disabled={activeSlideIndex >= slides.length - 1}
                    onClick={() =>
                      setActiveSlideIndex((i) =>
                        Math.min(slides.length - 1, i + 1),
                      )
                    }
                  >
                    Next
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
            )}

            {slides.length === 0 && !isGenerating && (
              <div className="glass rounded-2xl p-12 text-center">
                <p className="text-muted-foreground mb-4">
                  No slides yet. Click "Regenerate" to create slides from your
                  prompt.
                </p>
                <Button
                  className="rounded-xl gap-2"
                  onClick={() => regenerateMut.mutate()}
                  disabled={regenerateMut.isPending}
                >
                  <RefreshCw className="size-4" />
                  Generate slides
                </Button>
              </div>
            )}

            {slides.length === 0 && isGenerating && (
              <div className="glass rounded-2xl p-12 text-center">
                <RefreshCw className="size-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">
                  Generating your presentation…
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  This may take a minute
                </p>
              </div>
            )}
          </div>

          {slides.length > 0 && (
            <div className="lg:w-72 xl:w-80 space-y-3">
              <h2 className="font-medium text-sm px-1">Slides</h2>
              <div className="space-y-3 max-h-[calc(100vh-12rem)] overflow-y-auto pr-1">
                {slides.map((slide, i) => (
                  <SlideCard
                    key={slide.id}
                    slide={slide}
                    isActive={i === activeSlideIndex}
                    onClick={() => setActiveSlideIndex(i)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
