import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'
import { ensureBootstrap } from '@/lib/bootstrap'
import { serializeUser } from '@/lib/serializers'
import { setSessionCookie } from '@/lib/session'
import { type DbUser, getSupabaseAdmin } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    await ensureBootstrap()
    const body = await req.json()
    const email = String(body.email || '')
      .trim()
      .toLowerCase()
    const password = String(body.password || '')

    if (!email || !password) {
      return NextResponse.json({ error: 'Ingresa tu correo y contraseña.' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle()

    const user = data as DbUser | null
    if (!user) {
      return NextResponse.json({ error: 'Correo o contraseña incorrectos.' }, { status: 401 })
    }
    if (user.status === 'suspended') {
      return NextResponse.json({ error: 'Esta cuenta se encuentra suspendida.' }, { status: 403 })
    }

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      return NextResponse.json({ error: 'Correo o contraseña incorrectos.' }, { status: 401 })
    }

    await setSessionCookie(user.id)
    return NextResponse.json({ user: serializeUser(user) })
  } catch (err) {
    console.error('POST /api/auth/login error:', err)
    return NextResponse.json({ error: 'Error al iniciar sesión.' }, { status: 500 })
  }
}
