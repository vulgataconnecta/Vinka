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
    const name = String(body.name || '').trim()
    const email = String(body.email || '')
      .trim()
      .toLowerCase()
    const password = String(body.password || '')
    const role = body.role === 'provider' ? 'provider' : 'client'
    const city = String(body.city || '').trim()

    if (!name || !email || password.length < 6) {
      return NextResponse.json(
        { error: 'Completa nombre, correo y contraseña (mínimo 6 caracteres).' },
        { status: 400 },
      )
    }

    const supabase = getSupabaseAdmin()
    const { data: exists } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (exists) {
      return NextResponse.json(
        { error: 'Ya existe una cuenta registrada con este correo.' },
        { status: 409 },
      )
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const { data: created, error } = await supabase
      .from('users')
      .insert({
        name,
        email,
        passwordHash,
        role,
        city: city || null,
        status: 'active',
        providerStatus: role === 'provider' ? 'none' : null,
      })
      .select('*')
      .single()

    if (error || !created) {
      throw error || new Error('No se pudo crear el usuario.')
    }

    const user = created as DbUser
    await setSessionCookie(user.id)
    return NextResponse.json({ user: serializeUser(user) }, { status: 201 })
  } catch (err) {
    console.error('POST /api/auth/register error:', err)
    return NextResponse.json({ error: 'Error al crear la cuenta.' }, { status: 500 })
  }
}
