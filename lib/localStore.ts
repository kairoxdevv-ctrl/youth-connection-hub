export type LocalUser = {
  username: string
}

export type LocalComment = {
  id: string
  post_id: string
  author: string
  content: string
  created_at: string
}

const USER_KEY = 'user'
const COMMENTS_KEY = 'ych_comments'

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function getUser(): LocalUser | null {
  if (typeof window === 'undefined') return null
  const username = localStorage.getItem(USER_KEY)
  if (!username) return null
  return { username }
}

export function setUser(user: LocalUser) {
  if (typeof window === 'undefined') return
  localStorage.setItem(USER_KEY, user.username)
}

export function clearUser() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(USER_KEY)
}

export function getLocalComments(): LocalComment[] {
  if (typeof window === 'undefined') return []
  return safeParse<LocalComment[]>(localStorage.getItem(COMMENTS_KEY), [])
}

export function saveLocalComments(comments: LocalComment[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments))
}

export function addLocalComment(input: Omit<LocalComment, 'id' | 'created_at'>) {
  const comments = getLocalComments()
  const next: LocalComment = {
    id: `lc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    created_at: new Date().toISOString(),
    ...input,
  }
  comments.unshift(next)
  saveLocalComments(comments)
  return next
}

export function removeLocalComment(id: string) {
  const comments = getLocalComments().filter(c => c.id !== id)
  saveLocalComments(comments)
}
