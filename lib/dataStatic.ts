import fs from 'node:fs'
import path from 'node:path'

function readJson<T>(file: string): T {
  const filePath = path.join(process.cwd(), 'public', 'data', file)
  const raw = fs.readFileSync(filePath, 'utf8')
  return JSON.parse(raw) as T
}

export function getAreaIds(): string[] {
  const areas = readJson<{ id: string }[]>('areas.json')
  return areas.map(a => a.id)
}

export function getChannelIds(): string[] {
  const channels = readJson<{ id: string }[]>('channels.json')
  return channels.map(c => c.id)
}

export function getPostIds(): string[] {
  const posts = readJson<{ id: string }[]>('posts.json')
  return posts.map(p => p.id)
}
