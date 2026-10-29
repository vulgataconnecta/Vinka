import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// URL del webhook de Google Apps Script oficial de Vinka
const DEFAULT_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbwULBBNXV7DI_VUNPiqyq83FbqUqpWKU0bb9qbC6ed-k-V024BthOuslAF-zjT2_pJJ/exec';

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

    // 1. Enviar prioritariamente a Google Sheets (tanto en producción/dominio como en local)
    const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL || DEFAULT_WEBHOOK_URL;
    let sheetResponseText = null;

    if (webhookUrl) {
      try {
        const sheetRes = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submission),
          redirect: 'follow',
        });
        sheetResponseText = await sheetRes.text();
        console.log('Google Sheets Webhook response:', sheetResponseText);
      } catch (sheetErr) {
        console.error('Error al enviar a Google Sheets Webhook:', sheetErr);
      }
    }

    // 2. Respaldo local seguro en disco (cuando el entorno lo soporte)
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
      // En plataformas serverless como Vercel el disco raíz es read-only, lo manejamos limpiamente
      console.log('Nota servidor: almacenamiento en memoria o sólo lectura');
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Información registrada con éxito en Google Sheets',
      data: submission,
      sheetResult: sheetResponseText
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
