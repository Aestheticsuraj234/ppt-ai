import { z } from 'zod'

export const presentationStyleSchema = z.enum([
  'minimal',
  'professional',
  'creative',
  'bold',
])

export const presentationToneSchema = z.enum([
  'formal',
  'casual',
  'persuasive',
  'informative',
])

export const presentationLayoutSchema = z.enum([
  'text-heavy',
  'visual',
  'balanced',
  'bullet-points',
])

export const presentationIdInputSchema = z.object({ id: z.string().min(1) })

export const createPresentationInputSchema = z.object({
  prompt: z.string().min(1).max(50_000),
  slideCount: z.number().int().min(3).max(20),
  style: presentationStyleSchema,
  tone: presentationToneSchema,
  layout: presentationLayoutSchema,
})

export const updatePresentationInputSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().min(1).max(200).optional(),
    prompt: z.string().min(1).max(50_000).optional(),
    slideCount: z.number().int().min(3).max(20).optional(),
    style: presentationStyleSchema.optional(),
    tone: presentationToneSchema.optional(),
    layout: presentationLayoutSchema.optional(),
  })
  .refine(
    (data) => {
      const { id: _id, ...rest } = data
      return Object.keys(rest).length > 0
    },
    { message: 'At least one field is required to update' },
  )
