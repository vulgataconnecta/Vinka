const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

const workspaceDir = path.resolve(__dirname, '..');
const logoPath = path.join(workspaceDir, 'public', 'logo-coffee.png');
const htmlOutputPath = path.join(workspaceDir, 'Contrato_Proveedores_Vinka.html');
const pdfOutputPath = path.join(workspaceDir, 'Contrato_Proveedores_Vinka.pdf');

const logoBase64 = fs.readFileSync(logoPath).toString('base64');
const logoSrc = `data:image/png;base64,${logoBase64}`;

const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Contrato de Afiliación y Especificaciones de Proveedores — Vinka</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Outfit:wght@400;600;700;800&display=swap');

    @page {
      size: letter;
      margin: 13mm 16mm 13mm 16mm;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #2D1D16;
      background: #FFFFFF;
      font-size: 8.8pt;
      line-height: 1.45;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .page {
      page-break-after: always;
      position: relative;
      min-height: 252mm;
      padding-bottom: 12mm;
    }

    .page:last-child {
      page-break-after: avoid;
    }

    /* Header styling */
    .doc-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #3D2B22;
      padding-bottom: 10px;
      margin-bottom: 14px;
    }

    .logo-container {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-img {
      height: 38px;
      width: auto;
    }

    .doc-title-block {
      text-align: right;
    }

    .doc-category-badge {
      font-size: 7pt;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #A36B42;
      margin-bottom: 2px;
    }

    .doc-main-title {
      font-family: 'Outfit', sans-serif;
      font-size: 13pt;
      font-weight: 800;
      color: #1E140F;
      letter-spacing: -0.01em;
    }

    .doc-meta {
      font-size: 7.5pt;
      color: #7D6558;
      margin-top: 2px;
    }

    /* Headings */
    h2.section-heading {
      font-family: 'Outfit', sans-serif;
      font-size: 10.2pt;
      font-weight: 700;
      color: #3D2B22;
      border-left: 3.5px solid #A36B42;
      padding-left: 8px;
      margin: 11px 0 6px 0;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    h3.subsection-heading {
      font-family: 'Outfit', sans-serif;
      font-size: 8.8pt;
      font-weight: 700;
      color: #422D22;
      margin: 8px 0 3px 0;
    }

    p {
      margin-bottom: 6px;
      text-align: justify;
    }

    /* Highlights & Boxes */
    .highlight-card {
      background: #F7F3EE;
      border: 1px solid #DECFC2;
      border-radius: 6px;
      padding: 10px 12px;
      margin: 8px 0;
    }

    .warning-box {
      background: #FFF9F3;
      border: 1px solid #E8CDB5;
      border-left: 3.5px solid #A36B42;
      border-radius: 4px;
      padding: 8px 10px;
      margin: 8px 0;
      font-size: 8.2pt;
    }

    /* Lists */
    ul.legal-list {
      margin-left: 14px;
      margin-bottom: 8px;
    }

    ul.legal-list li {
      margin-bottom: 4px;
      text-align: justify;
    }

    /* Form Fill-in Fields */
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-bottom: 8px;
    }

    .form-field {
      border: 1px solid #D8C7B8;
      border-radius: 4px;
      padding: 5px 8px;
      background: #FFFFFF;
    }

    .form-field.full {
      grid-column: span 2;
    }

    .form-label {
      font-size: 6.8pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #7D6558;
      display: block;
      margin-bottom: 2px;
    }

    .form-input-line {
      height: 18px;
      border-bottom: 1px dashed #A36B42;
      display: flex;
      align-items: center;
      font-size: 8.5pt;
      color: #1E140F;
    }

    .form-textarea-box {
      min-height: 52px;
      border: 1px dashed #A36B42;
      border-radius: 3px;
      background: #FAF7F4;
      padding: 4px 6px;
      font-size: 8pt;
    }

    /* Checkbox list */
    .checkbox-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 6px;
      margin: 6px 0;
    }

    .check-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 7.8pt;
      background: #F7F3EE;
      border: 1px solid #E2D7CC;
      padding: 4px 6px;
      border-radius: 4px;
    }

    .square-box {
      width: 11px;
      height: 11px;
      border: 1.2px solid #6B4E3E;
      border-radius: 2px;
      background: #FFFFFF;
      display: inline-block;
      flex-shrink: 0;
    }

    /* Signature Block */
    .signatures-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 28px;
      margin-top: 24px;
      padding-top: 10px;
    }

    .signature-card {
      border-top: 1.5px solid #2D1D16;
      padding-top: 6px;
      text-align: center;
    }

    .sig-name {
      font-family: 'Outfit', sans-serif;
      font-weight: 700;
      font-size: 8.8pt;
      color: #1E140F;
    }

    .sig-role {
      font-size: 7.5pt;
      color: #7D6558;
    }

    /* Footer */
    .page-footer {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid #E2D7CC;
      padding-top: 5px;
      font-size: 7pt;
      color: #A58F82;
    }
  </style>
</head>
<body>

  <!-- ==================== PÁGINA 1: CONVENIO Y CLÁUSULAS ==================== -->
  <div class="page">
    <div class="doc-header">
      <div class="logo-container">
        <img src="${logoSrc}" alt="Vinka" class="logo-img">
      </div>
      <div class="doc-title-block">
        <div class="doc-category-badge">Plataforma Oficial Vinka &bull; Documento Legal</div>
        <div class="doc-main-title">CONVENIO DE AFILIACIÓN Y PUBLICACIÓN</div>
        <div class="doc-meta">Folio: <strong>VK-PROV-2026-__________</strong> &bull; Fecha: ______ / ______ / 2026</div>
      </div>
    </div>

    <p style="font-size: 8.2pt; color: #5C473C; margin-bottom: 8px;">
      El presente Convenio de Colaboración y Términos de Publicación (en lo sucesivo, el <strong>"CONVENIO"</strong>) se celebra entre la plataforma tecnológica <strong>VINKA</strong> (representada por su equipo directivo y operativo) y el <strong>PROVEEDOR / ALIADO COMERCIAL</strong> cuyos datos se consignan en la Ficha Técnica de Registro de este documento.
    </p>

    <h2 class="section-heading">I. DECLARACIONES Y ANTECEDENTES</h2>
    <ul class="legal-list">
      <li><strong>I.1. Declara VINKA:</strong> Ser una plataforma tecnológica especializada en el descubrimiento, promoción, alquiler y gestión de locaciones y servicios para eventos de primer nivel, orientada a conectar clientes calificados con proveedores de alto estándar.</li>
      <li><strong>I.2. Declara el PROVEEDOR:</strong> Ser una persona física o moral legalmente constituida o con facultades suficientes para disponer y comercializar el espacio, locación o catálogo de servicios ofrecidos, contando con los permisos comerciales vigentes.</li>
    </ul>

    <h2 class="section-heading">II. CLÁUSULAS CONTRACTUALES</h2>

    <h3 class="subsection-heading">PRIMERA. OBJETO DEL CONVENIO</h3>
    <p>
      El presente Convenio tiene por objeto regular los términos bajo los cuales <strong>VINKA</strong> exhibirá, publicará y promoverá dentro de su catálogo digital los servicios y/o locaciones del <strong>PROVEEDOR</strong>, facilitando a los clientes finales la consulta, cotización, contacto y reserva de dichos servicios.
    </p>

    <h3 class="subsection-heading">SEGUNDA. COMPROMISOS Y POLÍTICA DE COMISIÓN CERO (PRELANZAMIENTO)</h3>
    <p>
      Como beneficio de membresía fundadora durante la fase de lanzamiento oficial de la plataforma, Vinka otorgará al Proveedor una <strong>tasa de comisión del 0% (cero por ciento)</strong> durante los primeros <strong>3 (tres) meses</strong> naturales posteriores a la apertura pública de reservas. Concluida dicha vigencia, regirá el esquema comercial pactado por escrito entre las partes.
    </p>

    <h3 class="subsection-heading">TERCERA. ESTÁNDAR DE SERVICIO, PRECIOS Y DISPONIBILIDAD</h3>
    <p>
      El Proveedor se compromete a respetar en todo momento las tarifas exhibidas, los términos de cotización y los paquetes registrados en Vinka. Toda reserva confirmada a través del sistema deberá ser honrada en fecha, horario, aforo y especificaciones acordadas, evitando sobreventas o cancelaciones injustificadas.
    </p>

    <h3 class="subsection-heading">CUARTA. AUTORIZACIÓN DE DERECHOS DE IMAGEN Y MARCA</h3>
    <p>
      El Proveedor concede a Vinka una licencia no exclusiva, libre de regalías y para fines promocionales, para utilizar el material fotográfico, nombres comerciales, marcas y descripciones proporcionadas en la plataforma web, redes sociales y campañas publicitarias oficiales de Vinka.
    </p>

    <h3 class="subsection-heading">QUINTA. VERACIDAD Y RESPONSABILIDAD LEGAL</h3>
    <p>
      El Proveedor garantiza que la información suministrada es verídica, vigente y comprobable. El Proveedor asume plena responsabilidad civil, laboral y de protección al consumidor respecto a la ejecución directa de sus servicios, deslindando a Vinka de contingencias ajenas a la intermediación tecnológica.
    </p>

    <div class="warning-box">
      <strong>IMPORTANTE:</strong> Para que el perfil del Proveedor sea activado e indexado en el catálogo público de Vinka, es indispensable el cumplimiento de las <strong>Sugerencias Visuales y Criterios de Calidad</strong> detallados en la Página 2 del presente documento.
    </div>

    <div class="page-footer">
      <span>Vinka Platform &copy; 2026 &bull; Plataforma Digital de Locaciones y Experiencias</span>
      <span>Página 1 de 3 &bull; Convenio de Afiliación</span>
    </div>
  </div>

  <!-- ==================== PÁGINA 2: SUGERENCIAS VISUALES Y ESPECIFICACIONES ==================== -->
  <div class="page">
    <div class="doc-header">
      <div class="logo-container">
        <img src="${logoSrc}" alt="Vinka" class="logo-img">
      </div>
      <div class="doc-title-block">
        <div class="doc-category-badge">Anexo Técnico &bull; Guía de Calidad Visual</div>
        <div class="doc-main-title">SUGERENCIAS Y PAUTAS DE PUBLICACIÓN</div>
        <div class="doc-meta">Recomendaciones para que tu espacio o servicio luzca al máximo en Vinka</div>
      </div>
    </div>

    <p style="margin-bottom: 6px;">
      En <strong>Vinka</strong> promovemos tanto <strong>locaciones exclusivas</strong> como <strong>servicios especializados para eventos</strong> (banquetes, flores, barras, mobiliario, audio, etc.). Las siguientes pautas son recomendaciones orientadas a que tus 5 fotografías muestren el mejor ángulo de tu trabajo, transmitan profesionalismo y multipliquen tus contrataciones.
    </p>

    <h2 class="section-heading">1. NOMBRE COMERCIAL Y TITULARIDAD</h2>
    <p>
      Debe registrarse el nombre comercial oficial con el que el público reconoce la marca, empresa o recinto (sin teléfonos, links ni emojis en el título visible).
    </p>

    <h2 class="section-heading">2. GUÍA Y SUGERENCIAS VISUALES PARA TUS 5 FOTOGRAFÍAS</h2>
    <p style="font-size: 8.2pt; color: #5C473C; margin-bottom: 6px;">
      Requerimos un paquete de <strong>al menos 5 fotografías</strong> que serán <strong>verificadas por nuestro equipo de curaduría</strong> para asegurar que se vean impecables. Como la naturaleza de cada negocio es distinta, te sugerimos enfocar tus imágenes de acuerdo con tu categoría:
    </p>

    <!-- Dos columnas de sugerencias según tipo de proveedor -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 6px 0 8px 0;">
      <!-- Columna Locaciones -->
      <div class="highlight-card" style="margin: 0; padding: 8px 10px; background: #FAF7F4; border: 1px solid #DFCFC2;">
        <div style="font-weight: 700; color: #3D2B22; font-size: 8.5pt; margin-bottom: 4px; border-bottom: 1.5px solid #DECFC2; padding-bottom: 3px;">
          🏡 Si eres una LOCACIÓN / RECINTO:
        </div>
        <ul style="margin-left: 14px; font-size: 7.7pt; color: #4E392E; line-height: 1.45;">
          <li><strong>1. Vista Principal / Portada:</strong> Fachada o perspectiva panorámica amplia, despejada y con excelente iluminación (horizontal).</li>
          <li><strong>2. Área de Montaje:</strong> El espacio dispuesto para evento con mesas, sillería o pista, para que el cliente dimensione capacidad real.</li>
          <li><strong>3. Arquitectura y Detalles:</strong> Acabados de los muros, techos, jardines cuidados, arcos o fuentes.</li>
          <li><strong>4. El Espacio en Acción:</strong> El recinto vivo durante una celebración o evento real bien ambientado.</li>
          <li><strong>5. Amenidad Diferencial:</strong> Alberca, terraza con vista, suite nupcial, barra de servicio o iluminación nocturna.</li>
        </ul>
      </div>

      <!-- Columna Servicios -->
      <div class="highlight-card" style="margin: 0; padding: 8px 10px; background: #FAF7F4; border: 1px solid #DFCFC2;">
        <div style="font-weight: 700; color: #A36B42; font-size: 8.5pt; margin-bottom: 4px; border-bottom: 1.5px solid #DECFC2; padding-bottom: 3px;">
          💐 Si eres un SERVICIO (Flores, Comida, DJ, etc.):
        </div>
        <ul style="margin-left: 14px; font-size: 7.7pt; color: #4E392E; line-height: 1.45;">
          <li><strong>1. Producto Insignia:</strong> Centro de mesa floral espectacular, platillo gourmet emplatado o coctel de autor.</li>
          <li><strong>2. Montaje Integral:</strong> La mesa completa decorada, la estación de comida/buffet o el escenario y cabina de DJ.</li>
          <li><strong>3. Detalle y Frescura:</strong> Primer plano a la textura de flores, calidad de ingredientes, cristalería o acabados.</li>
          <li><strong>4. Servicio en Vivo:</strong> Tu equipo preparando alimentos, sirviendo bebidas, montando flores o animando el evento.</li>
          <li><strong>5. Variedad de Opciones:</strong> Muestra de versatilidad (distintos estilos florales, opciones de menú o sets de mobiliario).</li>
        </ul>
      </div>
    </div>

    <!-- Criterios para que se vean bien -->
    <div class="highlight-card" style="background: #FFFBF7; border: 1px solid #EAD8C8; padding: 8px 10px; margin: 6px 0;">
      <p style="font-weight: 700; color: #3D2B22; font-size: 8pt; margin-bottom: 3px;">
        ✨ Criterios clave para que tus fotografías se vean increíbles y generen confianza:
      </p>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; font-size: 7.4pt; color: #5C473C; line-height: 1.4;">
        <div><strong>Luz Natural o Cálida:</strong> Evita fotos oscuras o con flash directo de celular que aplane texturas y colores.</div>
        <div><strong>Nitidez y Resolución:</strong> Mínimo 1080p, archivos originales en alta definición. No capturas de pantalla de redes sociales.</div>
        <div><strong>Orden y Limpieza:</strong> Espacios despejados sin cables sueltos, cajas, basura ni elementos que distraigan la atención.</div>
      </div>
      <div style="font-size: 7.2pt; color: #A36B42; font-weight: 600; margin-top: 5px; border-top: 1px dashed #DECFC2; padding-top: 3px;">
        &bull; PROCESO DE VERIFICACIÓN: El equipo de curaduría de Vinka revisará y optimizará las fotografías para asegurarse de que cumplan con estos estándares antes de activar el perfil público.
      </div>
    </div>

    <h2 class="section-heading">3. DESCRIPCIÓN CON LÍMITE MÁXIMO DE PALABRAS</h2>
    <p>
      La descripción en Vinka debe ser directa, inspiradora y clara, con un <strong>LÍMITE MÁXIMO DE 180 PALABRAS</strong> estructuradas en 3 puntos:
    </p>
    <ul class="legal-list">
      <li><strong>Esencia y Especialidad (40-60 palabras):</strong> Qué define a tu marca o recinto, estilo, sazón o propuesta de valor.</li>
      <li><strong>Capacidad o Alcance (40-60 palabras):</strong> Tipos de eventos ideales (bodas, aniversarios, cenas íntimas, corporativos) y volumen de atención.</li>
      <li><strong>Beneficios Incluidos (40-60 palabras):</strong> Resumen de lo que incluye tu servicio o espacio (personal, montaje, traslados, etc.).</li>
    </ul>

    <h2 class="section-heading">4. CATEGORÍAS AFINES Y ETIQUETAS DE BÚSQUEDA</h2>
    <p>
      Cada proveedor se clasificará en su categoría principal y subcategorías para ser recomendado con precisión a los usuarios que organicen eventos.
    </p>

    <div class="page-footer">
      <span>Vinka Platform &copy; 2026 &bull; Pautas Visuales y Recomendaciones de Calidad</span>
      <span>Página 2 de 3 &bull; Criterios de Publicación</span>
    </div>
  </div>

  <!-- ==================== PÁGINA 3: FICHA DE REGISTRO Y FIRMAS ==================== -->
  <div class="page">
    <div class="doc-header">
      <div class="logo-container">
        <img src="${logoSrc}" alt="Vinka" class="logo-img">
      </div>
      <div class="doc-title-block">
        <div class="doc-category-badge">Formato de Alta &bull; Anexo Técnico</div>
        <div class="doc-main-title">FICHA TÉCNICA DE REGISTRO</div>
        <div class="doc-meta">Completar para indexación oficial en la plataforma Vinka</div>
      </div>
    </div>

    <p style="font-size: 8pt; color: #5C473C; margin-bottom: 6px;">
      Favor de llenar los siguientes campos con letra legible o formato digital. Esta información será la base para construir tu perfil en <strong>vinka.club</strong>:
    </p>

    <!-- Datos Generales -->
    <h2 class="section-heading" style="margin-top: 4px;">1. DATOS GENERALES DEL PROVEEDOR</h2>
    <div class="form-grid">
      <div class="form-field full">
        <span class="form-label">Nombre Comercial de la Locación o Servicio (Visible en Plataforma):</span>
        <div class="form-input-line"></div>
      </div>
      <div class="form-field">
        <span class="form-label">Razón Social o Nombre del Titular:</span>
        <div class="form-input-line"></div>
      </div>
      <div class="form-field">
        <span class="form-label">RFC / Identificación Oficial:</span>
        <div class="form-input-line"></div>
      </div>
      <div class="form-field">
        <span class="form-label">Teléfono de Contacto Directo:</span>
        <div class="form-input-line"></div>
      </div>
      <div class="form-field">
        <span class="form-label">Correo Electrónico para Reservas:</span>
        <div class="form-input-line"></div>
      </div>
      <div class="form-field full">
        <span class="form-label">Ubicación / Dirección Completa (Ciudad, Municipio, Zona de Cobertura):</span>
        <div class="form-input-line"></div>
      </div>
    </div>

    <!-- Categorías -->
    <h2 class="section-heading" style="margin-top: 6px;">2. CATEGORÍA OFICIAL Y ESPECIALIDAD</h2>
    <div class="checkbox-grid">
      <div class="check-item"><span class="square-box"></span> Locación / Finca / Jardín</div>
      <div class="check-item"><span class="square-box"></span> Terraza / Rooftop / Salón</div>
      <div class="check-item"><span class="square-box"></span> Banquetes &amp; Catering</div>
      <div class="check-item"><span class="square-box"></span> Mobiliario &amp; Decoración</div>
      <div class="check-item"><span class="square-box"></span> Floristería &amp; Diseño Floral</div>
      <div class="check-item"><span class="square-box"></span> Audio, DJ &amp; Iluminación</div>
      <div class="check-item"><span class="square-box"></span> Fotografía &amp; Video</div>
      <div class="check-item"><span class="square-box"></span> Mixología &amp; Barras</div>
      <div class="check-item"><span class="square-box"></span> Wedding / Event Planner</div>
    </div>

    <!-- Descripción Oficial -->
    <h2 class="section-heading" style="margin-top: 6px;">3. DESCRIPCIÓN OFICIAL PARA LA PÁGINA (MÁXIMO 180 PALABRAS)</h2>
    <div class="form-field full" style="margin-bottom: 6px;">
      <span class="form-label">Texto descriptivo curado (Destaca ambiente, servicios y propuesta de valor):</span>
      <div class="form-textarea-box" style="height: 56px;"></div>
    </div>

    <!-- Especificaciones Operativas -->
    <h2 class="section-heading" style="margin-top: 4px;">4. ESPECIFICACIONES DE OPERACIÓN &amp; ENTREGA DE FOTOGRAFÍAS</h2>
    <div class="form-grid">
      <div class="form-field">
        <span class="form-label">Capacidad de Personas o Alcance del Servicio (Mín - Máx):</span>
        <div class="form-input-line"></div>
      </div>
      <div class="form-field">
        <span class="form-label">Rango de Precio Base o Paquete Promedio:</span>
        <div class="form-input-line"></div>
      </div>
      <div class="form-field full">
        <span class="form-label">Enlace Cloud a las 5 Fotografías Sugeridas (Google Drive / Dropbox / WeTransfer):</span>
        <div class="form-input-line"></div>
      </div>
    </div>

    <div style="margin-top: 4px; font-size: 7.5pt; background: #F7F3EE; padding: 6px 10px; border-radius: 4px; border: 1px solid #DECFC2; color: #5C473C; text-align: justify;">
      <strong>Aclaración sobre el material fotográfico:</strong> Las 5 fotografías enviadas en el enlace serán verificadas por el equipo de curaduría de Vinka para confirmar su nitidez y buena resolución, asegurando que tu perfil refleje la más alta calidad y se vea impecable para los clientes.
    </div>

    <!-- Firmas -->
    <div class="signatures-container">
      <div class="signature-card">
        <div style="height: 38px;"></div>
        <div class="sig-name">POR VINKA PLATFORM</div>
        <div class="sig-role">Dirección de Operaciones &amp; Curaduría Comercial</div>
      </div>
      <div class="signature-card">
        <div style="height: 38px;"></div>
        <div class="sig-name">POR EL PROVEEDOR / AFILIADO</div>
        <div class="sig-role">Nombre y Firma del Titular o Representante Legal</div>
      </div>
    </div>

    <div class="page-footer">
      <span>Vinka Platform &copy; 2026 &bull; Formato de Registro Oficial de Proveedores</span>
      <span>Página 3 de 3 &bull; Ficha y Firmas</span>
    </div>
  </div>

</body>
</html>`;

fs.writeFileSync(htmlOutputPath, htmlContent, 'utf8');
console.log('HTML contract generated at:', htmlOutputPath);

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

execFile(edgePath, [
  '--headless=new',
  '--disable-gpu',
  '--no-pdf-header-footer',
  `--print-to-pdf=${pdfOutputPath}`,
  htmlOutputPath
], (err) => {
  if (err) {
    console.error('Error generating PDF:', err);
    process.exit(1);
  }
  console.log('PDF Contract successfully updated at:', pdfOutputPath);
});
