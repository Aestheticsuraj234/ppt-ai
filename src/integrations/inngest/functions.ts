import { generateObject } from 'ai'
import { google } from '@ai-sdk/google'
import { z } from 'zod'

import { prisma } from '#/db'
import { uploadImageFromUrl } from '#/lib/imagekit'

import { inngest } from './client'

const slideSchema = z.object({
  title: z.string().describe('Slide title'),
  content: z.string().describe('Main content / bullet points for the slide'),
  notes: z.string().optional().describe('Speaker notes'),
  imagePrompt: z
    .string()
    .describe(
      'A concise prompt to generate an illustration for this slide (professional, clean style)',
    ),
})

const slidesResponseSchema = z.object({
  slides: z.array(slideSchema),
})

export const generatePresentation = inngest.createFunction(
  {
    id: 'generate-presentation',
    retries: 2,
    triggers: [{ event: 'presentation/generate' }],
  },
  async ({ event, step }) => {
    const { presentationId } = event.data as { presentationId: string }

    const presentation = await step.run('fetch-presentation', async () => {
      const p = await prisma.presentation.findUnique({
        where: { id: presentationId },
      })
      if (!p) throw new Error('Presentation not found')
      return p
    })

    await step.run('mark-generating', async () => {
      await prisma.presentation.update({
        where: { id: presentationId },
        data: { status: 'GENERATING' },
      })
    })

    const { slides } = await step.run('generate-slides-content', async () => {
      const systemPrompt = `You are an expert presentation designer. Given a user's content/prompt, create a compelling presentation.

Style: ${presentation.style}
Tone: ${presentation.tone}
Layout preference: ${presentation.layout}
Number of slides requested: ${presentation.slideCount}

Guidelines:
- Create exactly ${presentation.slideCount} slides
- First slide should be a title slide
- Last slide should be a summary or call-to-action
- Keep content concise and impactful
- For imagePrompt, describe a professional illustration that complements the slide (no text in images)
`

      const result = await generateObject({
        model: google('gemini-2.0-flash'),
        schema: slidesResponseSchema,
        system: systemPrompt,
        prompt: presentation.prompt,
      })

      return result.object
    })

    await step.run('delete-old-slides', async () => {
      await prisma.slide.deleteMany({
        where: { presentationId },
      })
    })

    const createdSlides = await step.run('create-slides', async () => {
      const created = await prisma.slide.createManyAndReturn({
        data: slides.map((s, i) => ({
          presentationId,
          order: i,
          title: s.title,
          content: s.content,
          notes: s.notes ?? null,
          imagePrompt: s.imagePrompt,
        })),
      })
      return created
    })

    for (const slide of createdSlides) {
      await step.run(`generate-image-${slide.id}`, async () => {
        if (!slide.imagePrompt) return

        const imageGenPrompt = `Professional presentation slide illustration: ${slide.imagePrompt}. Clean, modern, minimal style with soft gradients. No text.`

        const response = await fetch(
          `https://image.pollinations.ai/prompt/${encodeURIComponent(imageGenPrompt)}?width=1024&height=576&nologo=true&model=flux`,
        )

        if (!response.ok) {
          console.error('Image generation failed for slide', slide.id)
          return
        }

        const imageUrl = response.url

        const uploadedUrl = await uploadImageFromUrl(
          imageUrl,
          `slide-${slide.id}.png`,
          `presentations/${presentationId}`,
        )

        await prisma.slide.update({
          where: { id: slide.id },
          data: { imageUrl: uploadedUrl },
        })
      })
    }

    await step.run('mark-completed', async () => {
      await prisma.presentation.update({
        where: { id: presentationId },
        data: { status: 'COMPLETED' },
      })
    })

    return { success: true, slideCount: slides.length }
  },
)

export const helloWorld = inngest.createFunction(
  {
    id: 'hello-world',
    triggers: [{ event: 'test/hello.world' }],
  },
  async ({ event, step }) => {
    await step.sleep('wait-a-moment', '1s')
    return { message: `Hello ${event.data.email}!` }
  },
)
