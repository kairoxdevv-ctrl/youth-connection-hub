'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Shell from '@/components/Shell'
import { Area, Channel, Post, getAreas, getChannels, getPosts } from '@/lib/dataClient'
import { formatDate, previewText } from '@/lib/format'

export default function ChannelClient({ channelId }: { channelId: string }) {
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

  const channel = channels.find(c => c.id === channelId)
  const areaId = channel?.area_id
  const area = areas.find(a => a.id === areaId)
  const areaChannels = useMemo(() => channels.filter(c => c.area_id === areaId), [channels, areaId])

  const channelPosts = posts
    .filter(p => p.channel_id === channelId)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))

  if (loading) {
    return <div className="mx-auto max-w-6xl px-4 py-10 text-slate-400">Loading...</div>
  }

  if (!channel) {
    return <div className="mx-auto max-w-6xl px-4 py-10 text-slate-400">Channel not found.</div>
  }

  return (
    <Shell
      areas={areas}
      channels={areaChannels}
      activeAreaId={area?.id}
      activeChannelId={channelId}
      channelTitle={area ? `${area.name} channels` : 'Channels'}
    >
      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500">Channel</p>
          <h1 className="text-2xl font-semibold text-white">{channel.name}</h1>
          <p className="mt-2 text-sm text-slate-400">{channel.description}</p>
        </div>

        <section className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400">Posts</h2>
          {channelPosts.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">No posts yet.</p>
          ) : (
            <div className="mt-4 space-y-4">
              {channelPosts.map(post => (
                <Link
                  key={post.id}
                  href={`/post/${post.id}`}
                  className="block rounded-xl border border-slate-800 bg-slate-900/40 p-4 transition hover:border-slate-600"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-lg font-semibold text-white">{post.title}</h3>
                    <span className="text-xs text-slate-500">{formatDate(post.created_at)}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">{previewText(post.content, 180)}</p>
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
