'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Shell from '@/components/Shell'
import { getAreas, getChannels, getPosts, Area, Channel, Post } from '@/lib/dataClient'
import { formatDate, previewText } from '@/lib/format'

export default function HomePage() {
  const [areas, setAreas] = useState<Area[]>([])
  const [channels, setChannels] = useState<Channel[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getAreas(), getChannels(), getPosts()]).then(([a, c, p]) => {
      setAreas(a)
      setChannels(c)
      setPosts(p)
      setLoading(false)
    })
  }, [])

  const newestPosts = useMemo(() => {
    return [...posts]
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .slice(0, 5)
  }, [posts])

  const popularChannels = useMemo(() => {
    const counts: Record<string, number> = {}
    posts.forEach(p => {
      counts[p.channel_id] = (counts[p.channel_id] || 0) + 1
    })
    return [...channels]
      .sort((a, b) => (counts[b.id] || 0) - (counts[a.id] || 0))
      .slice(0, 6)
  }, [channels, posts])

  if (loading) {
    return <div className="mx-auto max-w-6xl px-4 py-10 text-slate-400">Loading...</div>
  }

  return (
    <Shell areas={areas} channels={popularChannels} channelTitle="Popular channels">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-400">
            A calm space to explore topics, share questions, and support each other.
          </p>
        </div>

        <section className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400">Areas</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {areas.map(area => (
              <Link
                key={area.id}
                href={`/area/${area.id}`}
                className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 transition hover:border-slate-600"
              >
                <div className="text-lg font-semibold text-white">
                  {area.icon} {area.name}
                </div>
                <p className="mt-2 text-sm text-slate-400">{area.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400">Newest posts</h2>
          <div className="mt-4 space-y-4">
            {newestPosts.map(post => (
              <Link
                key={post.id}
                href={`/post/${post.id}`}
                className="block rounded-xl border border-slate-800 bg-slate-900/40 p-4 transition hover:border-slate-600"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-lg font-semibold text-white">{post.title}</h3>
                  <span className="text-xs text-slate-500">{formatDate(post.created_at)}</span>
                </div>
                <p className="mt-2 text-sm text-slate-400">{previewText(post.content)}</p>
                <p className="mt-2 text-xs text-slate-500">by {post.author}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </Shell>
  )
}
