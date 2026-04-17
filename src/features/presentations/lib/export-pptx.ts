import pptxgen from 'pptxgenjs'

type Slide = {
  id: string
  order: number
  title: string
  content: string
  notes?: string | null
  imageUrl?: string | null
}

type ExportOptions = {
  title: string
  slides: Slide[]
}

export async function exportToPptx({ title, slides }: ExportOptions) {
  const pptx = new pptxgen()

  pptx.author = 'PPT AI'
  pptx.title = title
  pptx.subject = 'AI Generated Presentation'
  pptx.layout = 'LAYOUT_16x9'

  for (const slideData of slides) {
    const slide = pptx.addSlide()

    if (slideData.imageUrl) {
      try {
        slide.addImage({
          path: slideData.imageUrl,
          x: 0,
          y: 0,
          w: '100%',
          h: '100%',
          sizing: { type: 'cover', w: '100%', h: '100%' },
        })

        slide.addShape('rect' as pptxgen.ShapeType, {
          x: 0,
          y: 0,
          w: '100%',
          h: '100%',
          fill: { color: '000000', transparency: 50 },
        })
      } catch {
        slide.addShape('rect' as pptxgen.ShapeType, {
          x: 0,
          y: 0,
          w: '100%',
          h: '100%',
          fill: {
            type: 'solid',
            color: '1a1a2e',
          },
        })
      }
    } else {
      slide.addShape('rect' as pptxgen.ShapeType, {
        x: 0,
        y: 0,
        w: '100%',
        h: '100%',
        fill: {
          type: 'solid',
          color: '1a1a2e',
        },
      })
    }

    slide.addText(slideData.title, {
      x: 0.5,
      y: 1.5,
      w: 9,
      h: 1.5,
      fontSize: 44,
      fontFace: 'Arial',
      color: 'FFFFFF',
      bold: true,
      valign: 'middle',
    })

    const contentLines = slideData.content.split('\n').filter(Boolean)
    const formattedContent = contentLines.map((line) => ({
      text: line.startsWith('•') ? line : `• ${line}`,
      options: {
        fontSize: 20,
        color: 'E0E0E0',
        bullet: false,
        breakLine: true,
      },
    }))

    slide.addText(formattedContent, {
      x: 0.5,
      y: 3.2,
      w: 9,
      h: 3.5,
      fontFace: 'Arial',
      valign: 'top',
      paraSpaceAfter: 12,
    })

    if (slideData.notes) {
      slide.addNotes(slideData.notes)
    }
  }

  const filename = `${title.replace(/[^a-zA-Z0-9]/g, '_')}.pptx`
  await pptx.writeFile({ fileName: filename })

  return filename
}
