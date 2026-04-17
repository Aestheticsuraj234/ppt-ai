import type { SlideLayout, SlideStyle, SlideTone } from './presentation-options'

export type PresentationTemplate = {
  id: string
  label: string
  content: string
  slides: number
  style: SlideStyle
  tone: SlideTone
  layout: SlideLayout
}

export const PRESENTATION_TEMPLATES: PresentationTemplate[] = [
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
]

