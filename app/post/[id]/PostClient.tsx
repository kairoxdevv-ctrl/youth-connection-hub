'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Shell from '@/components/Shell'
import { Area, Channel, Comment, Post, getAreas, getChannels, getComments, getPosts } from '@/lib/dataClient'
import { formatDate } from '@/lib/format'
import { addLocalComment, getLocalComments, getUser, LocalComment, LocalUser } from '@/lib/localStore'

export default function PostClient({ postId }: { postId: string }) {
  const [areas, setAreas] = useState<Area[]>([])
  const [channels, setChannels] = useState<Channel[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [localComments, setLocalComments] = useState<LocalComment[]>([])
  const [user, setUser] = useState<LocalUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState('')

  useEffect(() => {
    Promise.all([getAreas(), getChannels(), getPosts(), getComments()]).then(([a, c, p, cm]) => {
      setAreas(a)
      setChannels(c)
      setPosts(p)
      setComments(cm)
      setLocalComments(getLocalComments())
      setUser(getUser())
      setLoading(false)
    })
  }, [])

  const post = posts.find(p => p.id === postId)
  const activePost = post || posts[0]
  const channel = channels.find(c => c.id === activePost?.channel_id)
  const area = areas.find(a => a.id === channel?.area_id)
  const areaChannels = channels.filter(c => c.area_id === channel?.area_id)

  const activePostId = activePost?.id || postId
  const allComments = useMemo(() => {
    const base = comments.filter(c => c.post_id === activePostId)
    const local = localComments.filter(c => c.post_id === activePostId)
    return [...local, ...base].sort((a, b) => b.created_at.localeCompare(a.created_at))
  }, [comments, localComments, activePostId])

  function handleAddComment() {
    if (!user) return
    if (!content.trim()) return

    const next = addLocalComment({
      post_id: activePostId,
      author: user.username,
      content: content.trim(),
    })

    setLocalComments(prev => [next, ...prev])
    setContent('')
  }

  if (loading) {
    return <div className="mx-auto max-w-6xl px-4 py-10 text-slate-400">Loading...</div>
  }

  return (
    <Shell
      areas={areas}
      channels={areaChannels}
      activeAreaId={area?.id}
      activeChannelId={channel?.id}
      channelTitle={area ? `${area.name} channels` : 'Channels'}
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          {area && channel ? (
            <>
              <Link href={`/area/${area.id}`} className="hover:text-slate-200">
                {area.name}
              </Link>
              <span>/</span>
              <Link href={`/channel/${channel.id}`} className="hover:text-slate-200">
                {channel.name}
              </Link>
            </>
          ) : (
            <span>Explore posts</span>
          )}
        </div>

        <article className="rounded-2xl border border-slate-800 bg-slate-950/50 p-6">
          {activePost ? (
            <>
              <h1 className="text-2xl font-semibold text-white">{activePost.title}</h1>
              <div className="mt-2 text-xs text-slate-500">
                {activePost.author} · {formatDate(activePost.created_at)}
              </div>
              <p className="mt-4 whitespace-pre-line text-sm text-slate-200">{activePost.content}</p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-semibold text-white">No posts yet</h1>
              <p className="mt-2 text-sm text-slate-400">Pick a channel to start exploring.</p>
            </>
          )}
        </article>

        <section className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400">Comments</h2>
            <span className="text-xs text-slate-500">{allComments.length}</span>
          </div>

          <div className="mt-4 space-y-3">
            {allComments.length === 0 ? (
              <p className="text-sm text-slate-500">No comments yet. Be the first.</p>
            ) : (
              allComments.map(comment => (
                <div key={comment.id} className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                    <span>{comment.author}</span>
                    <span>{formatDate(comment.created_at)}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-200">{comment.content}</p>
                </div>
              ))
            )}
          </div>

          <div className="mt-6 rounded-xl border border-dashed border-slate-800 bg-slate-950/50 p-4">
            {user ? (
              <>
                <label className="text-xs uppercase tracking-widest text-slate-500">Add a comment</label>
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="mt-3 min-h-[90px] w-full rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-sm text-slate-100"
                  placeholder="Share your thoughts"
                />
                <button
                  onClick={handleAddComment}
                  className="mt-3 rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:border-slate-500"
                >
                  Post comment
                </button>
              </>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-slate-400">Log in with a username to comment.</p>
                <Link
                  href="/login"
                  className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:border-slate-500"
                >
                  Go to login
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
    </Shell>
  )
}
