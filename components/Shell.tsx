'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import type { Area, Channel } from '@/lib/dataClient'

type ShellProps = {
  areas: Area[]
  channels: Channel[]
  activeAreaId?: string
  activeChannelId?: string
  children: ReactNode
  channelTitle?: string
}

export default function Shell({
  areas,
  channels,
  activeAreaId,
  activeChannelId,
  children,
  channelTitle = 'Channels',
}: ShellProps) {
  const pathname = usePathname()

  return (
    <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-4 px-4 py-6 lg:grid-cols-[220px_260px_1fr]">
      <aside className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400">Areas</h3>
        <ul className="mt-4 space-y-1">
          {areas.map(area => {
            const active = activeAreaId === area.id || pathname === `/area/${area.id}`
            return (
              <li key={area.id}>
                <Link
                  href={`/area/${area.id}`}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
                    active ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{area.icon || '•'}</span>
                    {area.name}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </aside>

      <aside className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400">{channelTitle}</h3>
          {activeAreaId && (
            <Link
              href={`/area/${activeAreaId}`}
              className="text-xs text-slate-500 hover:text-slate-300"
            >
              View area
            </Link>
          )}
        </div>
        {channels.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">No channels found.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {channels.map(channel => {
              const active = activeChannelId === channel.id || pathname === `/channel/${channel.id}`
              return (
                <li key={channel.id}>
                  <Link
                    href={`/channel/${channel.id}`}
                    className={`block rounded-lg border px-3 py-2 text-sm transition ${
                      active
                        ? 'border-slate-600 bg-slate-800 text-white'
                        : 'border-transparent text-slate-300 hover:border-slate-700 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="font-medium">{channel.name}</div>
                    <div className="text-xs text-slate-500">{channel.description}</div>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </aside>

      <section className="min-h-[60vh] rounded-2xl border border-slate-800 bg-slate-900/30 p-6">
        {children}
      </section>
    </div>
  )
}
