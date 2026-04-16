export const SLIDE_STYLES = [
  { value: 'minimal', label: 'Minimal' },
  { value: 'professional', label: 'Professional' },
  { value: 'creative', label: 'Creative' },
  { value: 'bold', label: 'Bold' },
] as const

export const TONE_OPTIONS = [
  { value: 'formal', label: 'Formal' },
  { value: 'casual', label: 'Casual' },
  { value: 'persuasive', label: 'Persuasive' },
  { value: 'informative', label: 'Informative' },
] as const

export const LAYOUT_OPTIONS = [
  { value: 'text-heavy', label: 'Text Heavy' },
  { value: 'visual', label: 'Visual Focus' },
  { value: 'balanced', label: 'Balanced' },
  { value: 'bullet-points', label: 'Bullet Points' },
] as const

export type SlideStyle = (typeof SLIDE_STYLES)[number]['value']
export type SlideTone = (typeof TONE_OPTIONS)[number]['value']
export type SlideLayout = (typeof LAYOUT_OPTIONS)[number]['value']
