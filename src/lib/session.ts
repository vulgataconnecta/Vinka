import crypto from 'node:crypto'
import { cookies } from 'next/headers'
import { type DbUser, getSupabaseAdmin } from './supabase'

const COOKIE_NAME = 'vinka_session'

function getSecret() {
  return process.env.SESSION_SECRET || 'vinka-default-session-secret-change-me'
}

function signUserId(userId: string): string {
  const sig = crypto.createHmac('sha256', getSecret()).update(userId).digest('hex')
  return `${userId}.${sig}`
}

function verifyToken(token: string): string | null {
  const idx = token.lastIndexOf('.')
  if (idx <= 0) return null
  const userId = token.slice(0, idx)
  const sig = token.slice(idx + 1)
  const expected = crypto.createHmac('sha256', getSecret()).update(userId).digest('hex')
  if (sig.length !== expected.length) return null
  return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected)) ? userId : null
}

export async function setSessionCookie(userId: string) {
  const store = await cookies()
  store.set(COOKIE_NAME, signUserId(userId), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 14, // 14 days
  })
}

export async function clearSessionCookie() {
  const store = await cookies()
  store.delete(COOKIE_NAME)
}

export async function getSessionUser(): Promise<DbUser | null> {
  const store = await cookies()
  const raw = store.get(COOKIE_NAME)?.value
  if (!raw) return null
  const userId = verifyToken(raw)
  if (!userId) return null

  const supabase = getSupabaseAdmin()
  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  return (data as DbUser | null) ?? null
}
