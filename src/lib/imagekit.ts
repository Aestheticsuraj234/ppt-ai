import ImageKit from '@imagekit/nodejs'

export const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_BASE_URL!,
})

export async function uploadImageFromUrl(
  url: string,
  fileName: string,
  folder = 'slides',
): Promise<string> {
  const result = await imagekit.upload({
    file: url,
    fileName,
    folder,
    useUniqueFileName: true,
  })
  return result.url
}
