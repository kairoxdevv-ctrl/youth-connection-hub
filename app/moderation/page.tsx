'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getPosts, Post } from '@/lib/dataClient'
import { getLocalComments, removeLocalComment, LocalComment, isAdmin } from '@/lib/localStore'
import { formatDate } from '@/lib/format'

export default function ModerationPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [comments, setComments] = useState<LocalComment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAdmin()) {
      router.push('/login')
      return
    }

    getPosts().then(p => {
      setPosts(p)
      setComments(getLocalComments())
      setLoading(false)
    })
  }, [router])

  function deleteComment(id: string) {
    if (!confirm('Delete this comment?')) return
    removeLocalComment(id)
    setComments(getLocalComments())
  }

  if (loading) {
    return <div className="mx-auto max-w-5xl px-4 py-10 text-slate-400">Loading...</div>
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-white">Moderation</h1>
      <p className="mt-2 text-sm text-slate-400">
        Manage comments added from this browser session. Static seed comments cannot be removed.
      </p>

      {comments.length === 0 ? (
        <p className="mt-6 text-sm text-slate-500">No local comments yet.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {comments.map(comment => {
            const post = posts.find(p => p.id === comment.post_id)
            return (
              <div key={comment.id} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                  <span>{comment.author}</span>
                  <span>{formatDate(comment.created_at)}</span>
                </div>
                <p className="mt-2 text-sm text-slate-200">{comment.content}</p>
                <p className="mt-2 text-xs text-slate-500">Post: {post?.title || 'Unknown'}</p>
                <button
                  onClick={() => deleteComment(comment.id)}
                  className="mt-3 rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-200 hover:border-slate-500"
                >
                  Delete comment
                </button>
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}
