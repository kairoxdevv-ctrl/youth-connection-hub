import ChannelClient from './ChannelClient'
import { getChannelIds } from '@/lib/dataStatic'

export function generateStaticParams() {
  return getChannelIds().map(id => ({ id }))
}

export default function ChannelPage({ params }: { params: { id: string } }) {
  return <ChannelClient channelId={params.id} />
}
