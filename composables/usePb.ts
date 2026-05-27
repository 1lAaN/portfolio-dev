import PocketBase from 'pocketbase'

let pbClient: PocketBase | null = null

export const usePb = () => {
  if (!pbClient) {
    const config = useRuntimeConfig()
    const url = config.public.pocketbaseUrl
    if (!url) throw new Error('NUXT_PUBLIC_POCKETBASE_URL is required')
    pbClient = new PocketBase(url)
    pbClient.autoCancellation(false)
  }
  return pbClient
}
