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
  const activeArea = area || areas[0]
  const activeAreaId = activeArea?.id
  const areaChannels = channels.filter(c => c.area_id === activeAreaId)

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

  return (
    <Shell
      areas={areas}
      channels={areaChannels}
      activeAreaId={activeAreaId}
      channelTitle="Channels"
    >
      <div className="space-y-6">
        <div>
          {area ? (
            <>
              <h1 className="text-2xl font-semibold text-white">
                {area.icon} {area.name}
              </h1>
              <p className="mt-2 text-sm text-slate-400">{area.description}</p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-semibold text-white">Explore areas</h1>
              <p className="mt-2 text-sm text-slate-400">
                That area does not exist. Pick one of the active areas below.
              </p>
            </>
          )}
        </div>

        {!area && (
          <section className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400">Areas</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {areas.map(item => (
                <Link
                  key={item.id}
                  href={`/area/${item.id}`}
                  className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 transition hover:border-slate-600"
                >
                  <div className="text-lg font-semibold text-white">
                    {item.icon} {item.name}
                  </div>
                  <p className="mt-2 text-sm text-slate-400">{item.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

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
