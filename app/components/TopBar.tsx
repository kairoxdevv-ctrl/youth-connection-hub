'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { clearUser, getUser, isAdmin, LocalUser } from '@/lib/localStore'
import { useRouter } from 'next/navigation'

export default function TopBar() {
  const router = useRouter()
  const [user, setUser] = useState<LocalUser | null>(null)

  useEffect(() => {
    setUser(getUser())
  }, [])

  function logout() {
    clearUser()
    setUser(null)
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold tracking-tight text-slate-100">
          Youth Connection Hub
        </Link>

        <div className="flex items-center gap-3 text-sm">
          {user ? (
            <>
              <span className="text-slate-300">@{user.username}</span>
              {isAdmin() && (
                <Link href="/moderation" className="rounded-full border border-slate-700 px-3 py-1 text-slate-200 hover:border-slate-500">
                  Moderation
                </Link>
              )}
              <button
                onClick={logout}
                className="rounded-full border border-slate-700 px-3 py-1 text-slate-200 hover:border-slate-500"
              >
                Log out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-full border border-slate-700 px-3 py-1 text-slate-200 hover:border-slate-500"
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
