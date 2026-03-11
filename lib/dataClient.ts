export type Area = {
  id: string
  name: string
  description: string
  icon?: string
}

export type Channel = {
  id: string
  area_id: string
  name: string
  description: string
}

export type Post = {
  id: string
  channel_id: string
  title: string
  content: string
  author: string
  created_at: string
}

export type Comment = {
  id: string
  post_id: string
  author: string
  content: string
  created_at: string
}

const cache: Record<string, unknown> = {}
const inflight: Record<string, Promise<unknown>> = {}
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

async function fetchJson<T>(file: string): Promise<T> {
  if (cache[file]) return cache[file] as T
  if (inflight[file]) return inflight[file] as Promise<T>

  const url = `${basePath}/data/${file}`
  inflight[file] = fetch(url)
    .then(res => {
      if (!res.ok) throw new Error(`Failed to load ${file}`)
      return res.json() as Promise<T>
    })
    .then(data => {
      cache[file] = data
      return data
    })
    .finally(() => {
      delete inflight[file]
    })

  return inflight[file] as Promise<T>
}

export function getAreas() {
  return fetchJson<Area[]>('areas.json')
}

export function getChannels() {
  return fetchJson<Channel[]>('channels.json')
}

export function getPosts() {
  return fetchJson<Post[]>('posts.json')
}

export function getComments() {
  return fetchJson<Comment[]>('comments.json')
}
