'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Shell from '@/components/Shell'
import { Area, Channel, Post, getAreas, getChannels, getPosts } from '@/lib/dataClient'
import { formatDate, previewText } from '@/lib/format'

export default function AreaClient({ areaId }: { areaId: string }) {
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

  const area = areas.find(a => a.id === areaId)
  const areaChannels = channels.filter(c => c.area_id === areaId)

  const latestPosts = useMemo(() => {
    const channelIds = new Set(areaChannels.map(c => c.id))
    return posts
      .filter(p => channelIds.has(p.channel_id))
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .slice(0, 5)
  }, [areaChannels, posts])

  if (loading) {
    return <div className="mx-auto max-w-6xl px-4 py-10 text-slate-400">Loading...</div>
  }

  if (!area) {
    return <div className="mx-auto max-w-6xl px-4 py-10 text-slate-400">Area not found.</div>
  }

  return (
    <Shell
      areas={areas}
      channels={areaChannels}
      activeAreaId={areaId}
      channelTitle="Channels"
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            {area.icon} {area.name}
          </h1>
          <p className="mt-2 text-sm text-slate-400">{area.description}</p>
        </div>

        <section className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400">Latest posts</h2>
          {latestPosts.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">No posts yet.</p>
          ) : (
            <div className="mt-4 space-y-4">
              {latestPosts.map(post => (
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
          )}
        </section>
      </div>
    </Shell>
  )
}
