import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const body = await request.json();
    const { source = 'waitlist', name = '', email = '', phone = '', category = '', notes = '' } = body;

    if (!email && !phone && !name) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    const timestamp = new Date().toISOString();
    const submission = {
      timestamp,
      source, // 'registro_proveedor' | 'waitlist'
      name,
      email,
      phone,
      category,
      notes
    };

    // 1. Local backup storage (so data is never lost)
    try {
      const dataDir = path.join(process.cwd(), 'data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      const filePath = path.join(dataDir, 'submissions.json');
      let currentData = [];
      if (fs.existsSync(filePath)) {
        try {
          const fileContent = fs.readFileSync(filePath, 'utf8');
          currentData = JSON.parse(fileContent);
        } catch {
          currentData = [];
        }
      }
      currentData.unshift(submission);
      fs.writeFileSync(filePath, JSON.stringify(currentData, null, 2), 'utf8');
    } catch (fsErr) {
      console.warn('Could not write to local submissions file:', fsErr);
    }

    // 2. Forward to Google Sheet Webhook if configured
    const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submission),
        });
      } catch (sheetErr) {
        console.warn('Could not forward to Google Sheet Webhook:', sheetErr);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Información registrada con éxito',
      data: submission 
    });
  } catch (error) {
    console.error('Error in /api/register:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'submissions.json');
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return NextResponse.json({ success: true, count: JSON.parse(data).length, data: JSON.parse(data) });
    }
    return NextResponse.json({ success: true, count: 0, data: [] });
  } catch (error) {
    return NextResponse.json({ error: 'Error al consultar registros' }, { status: 500 });
  }
}
