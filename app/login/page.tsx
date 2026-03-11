'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getUser, setUser } from '@/lib/localStore'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')

  useEffect(() => {
    const existing = getUser()
    if (existing) {
      setUsername(existing.username)
    }
  }, [])

  function handleLogin() {
    if (!username.trim()) return
    setUser({ username: username.trim() })
    router.push('/')
  }

  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <h1 className="text-2xl font-semibold text-white">Log in</h1>
        <p className="mt-2 text-sm text-slate-400">
          Use a simple username to join the conversation.
        </p>

        <label className="mt-6 block text-xs uppercase tracking-widest text-slate-500">Username</label>
        <input
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="e.g. Nova"
          className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-sm text-slate-100"
        />

        <button
          onClick={handleLogin}
          className="mt-6 w-full rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:border-slate-500"
        >
          Continue
        </button>
      </div>
    </main>
  )
}
