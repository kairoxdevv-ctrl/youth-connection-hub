import PostClient from './PostClient'
import { getPostIds } from '@/lib/dataStatic'

export function generateStaticParams() {
  return getPostIds().map(id => ({ id }))
}

export default function PostPage({ params }: { params: { id: string } }) {
  return <PostClient postId={params.id} />
}
