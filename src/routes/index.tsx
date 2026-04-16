import { getSession } from '@/lib/auth.functions'
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
import { createFileRoute, redirect } from '@tanstack/react-router'
import { Sparkles, Wand2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

const SLIDE_STYLES = [
  { value: 'minimal', label: 'Minimal' },
  { value: 'professional', label: 'Professional' },
  { value: 'creative', label: 'Creative' },
  { value: 'bold', label: 'Bold' },
] as const

const TONE_OPTIONS = [
  { value: 'formal', label: 'Formal' },
  { value: 'casual', label: 'Casual' },
  { value: 'persuasive', label: 'Persuasive' },
  { value: 'informative', label: 'Informative' },
] as const

const LAYOUT_OPTIONS = [
  { value: 'text-heavy', label: 'Text Heavy' },
  { value: 'visual', label: 'Visual Focus' },
  { value: 'balanced', label: 'Balanced' },
  { value: 'bullet-points', label: 'Bullet Points' },
] as const

const TEMPLATES = [
  {
    id: 'product-tour',
    label: 'Product Tour',
    content: `Introducing our new product: Aurora Notes

Key Features:
- Lightning-fast note capture with AI-powered suggestions
- Smart organization that automatically categorizes your notes
- Real-time sync across all your devices
- Beautiful dark mode and customizable themes
- Collaboration tools for team workspaces

Target Audience:
- Professionals who need quick note-taking
- Students organizing research and lectures
- Teams collaborating on projects`,
    slides: 10,
    style: 'creative',
    tone: 'persuasive',
    layout: 'visual',
  },
  {
    id: 'meeting-summary',
    label: 'Meeting Summary',
    content: `Q3 Planning Meeting - April 2024

Attendees: Product, Engineering, Design, Marketing

Key Decisions:
- Launch new onboarding flow by end of May
- Reduce customer churn by 15% through improved support
- Redesign pricing page with clearer tier comparison

Action Items:
- Sarah: Finalize onboarding wireframes (Due: April 20)
- Mike: Set up churn analysis dashboard (Due: April 25)
- Lisa: Draft new pricing copy (Due: April 22)

Next Steps:
- Weekly sync every Tuesday at 10am
- Review progress in 2 weeks`,
    slides: 6,
    style: 'professional',
    tone: 'formal',
    layout: 'bullet-points',
  },
  {
    id: 'sales-pitch',
    label: 'Sales Pitch',
    content: `Why Choose Our Platform?

The Problem:
- Teams waste 5+ hours weekly on manual reporting
- Data lives in silos across different tools
- Decision-making is slow without real-time insights

Our Solution:
- Automated dashboards that update in real-time
- One-click integrations with 50+ tools
- AI-powered insights and recommendations

Results Our Clients See:
- 60% reduction in reporting time
- 3x faster decision-making
- 40% increase in team productivity

Pricing: Starting at $29/user/month
Free 14-day trial, no credit card required`,
    slides: 8,
    style: 'bold',
    tone: 'persuasive',
    layout: 'visual',
  },
  {
    id: 'project-update',
    label: 'Project Update',
    content: `Project Phoenix - Status Update

Timeline: On track for June 15 launch

Completed This Sprint:
- User authentication system fully implemented
- Database migration completed successfully
- Core API endpoints tested and deployed

In Progress:
- Frontend dashboard (75% complete)
- Mobile responsive design (60% complete)
- Integration testing phase

Blockers:
- Waiting on final brand assets from design team
- Need additional QA resources for testing

Budget Status: $45,000 of $50,000 allocated (90%)`,
    slides: 7,
    style: 'minimal',
    tone: 'informative',
    layout: 'balanced',
  },
  {
    id: 'startup-pitch',
    label: 'Startup Pitch',
    content: `EcoTrack - Making Sustainability Simple

Problem:
- 73% of consumers want to reduce their carbon footprint
- But tracking personal environmental impact is complex
- Existing solutions are either too technical or inaccurate

Solution:
- AI-powered app that automatically tracks your carbon footprint
- Connects to banking, travel, and shopping data
- Provides personalized tips to reduce impact

Traction:
- 50,000 active users in 6 months
- 4.8 star rating on App Store
- Featured in TechCrunch and Forbes

Ask: $2M seed round for team expansion and marketing`,
    slides: 12,
    style: 'bold',
    tone: 'persuasive',
    layout: 'visual',
  },
  {
    id: 'training',
    label: 'Training Guide',
    content: `New Employee Onboarding Guide

Welcome to the Team!

Week 1 - Getting Started:
- Set up your accounts and tools
- Meet your team members
- Review company handbook and policies

Week 2 - Learning the Ropes:
- Shadow experienced team members
- Complete required training modules
- Attend product overview sessions

Week 3-4 - Hands-On Practice:
- Start with supervised tasks
- Regular check-ins with your mentor
- Begin contributing to team projects

Resources:
- Internal wiki: wiki.company.com
- IT Support: support@company.com
- HR Questions: hr@company.com`,
    slides: 8,
    style: 'professional',
    tone: 'informative',
    layout: 'bullet-points',
  },
] as const

export const Route = createFileRoute('/')({
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
  component: HomePage,
})

function HomePage() {
  const _context = Route.useRouteContext()
  const [content, setContent] = useState('')
  const [slideCount, setSlideCount] = useState([8])
  const [style, setStyle] = useState('minimal')
  const [tone, setTone] = useState('professional')
  const [layout, setLayout] = useState('balanced')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    if (!content.trim()) {
      toast.error('Please enter your content first')
      return
    }

    setIsGenerating(true)
    toast.message('Generating your presentation...')

    // Placeholder for actual generation
    setTimeout(() => {
      setIsGenerating(false)
      toast.success('Presentation generated!')
    }, 2000)
  }

  return (
    <main className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            What do you want to{' '}
            <span className="text-gradient-peach">create?</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Enter your content and we'll generate a beautiful presentation
          </p>
        </div>

        {/* Main input card */}
        <div className="glass rounded-3xl p-6 md:p-8 space-y-6">
          {/* Textarea */}
          <div className="space-y-2">
            <Textarea
              placeholder="Describe your presentation topic, paste your notes, or outline your key points..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="h-[200px] min-h-[200px] max-h-[200px] overflow-y-auto text-base bg-background/50 border-border/50 rounded-2xl resize-none focus-visible:ring-primary/30"
            />
            <div className="flex justify-between text-xs text-muted-foreground px-1">
              <span>{content.length.toLocaleString()} characters</span>
              <span>Markdown supported</span>
            </div>
          </div>

          {/* Options grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Slide count */}
            <div className="space-y-2.5">
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

            {/* Style */}
            <div className="space-y-2.5">
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

            {/* Tone */}
            <div className="space-y-2.5">
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

            {/* Layout */}
            <div className="space-y-2.5">
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

          {/* Generate button */}
          <div className="flex justify-end pt-2">
            <Button
              size="lg"
              onClick={handleGenerate}
              disabled={isGenerating || !content.trim()}
              className="rounded-xl px-8 gap-2 font-semibold"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="size-5 animate-pulse" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="size-5" />
                  Generate PPT
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Templates */}
        <div className="mt-8">
          <p className="text-center text-sm text-muted-foreground mb-3">
            Try a template
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {TEMPLATES.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => {
                  setContent(template.content)
                  setSlideCount([template.slides])
                  setStyle(template.style)
                  setTone(template.tone)
                  setLayout(template.layout)
                }}
                className="px-4 py-2 text-sm rounded-full border border-border/50 bg-card/50 text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all"
              >
                {template.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
