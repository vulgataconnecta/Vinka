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
      margin: 14mm 16mm 14mm 16mm;
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
      min-height: 250mm;
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
      font-size: 10.5pt;
      font-weight: 700;
      color: #3D2B22;
      border-left: 3.5px solid #A36B42;
      padding-left: 8px;
      margin: 12px 0 6px 0;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    h3.subsection-heading {
      font-family: 'Outfit', sans-serif;
      font-size: 9pt;
      font-weight: 700;
      color: #422D22;
      margin: 8px 0 4px 0;
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

    /* Tables & Spec Grids */
    table.spec-table {
      width: 100%;
      border-collapse: collapse;
      margin: 8px 0;
      font-size: 8pt;
    }

    table.spec-table th {
      background: #3D2B22;
      color: #FFFFFF;
      text-align: left;
      padding: 6px 8px;
      font-family: 'Outfit', sans-serif;
      font-weight: 600;
      letter-spacing: 0.03em;
    }

    table.spec-table td {
      border: 1px solid #E2D7CC;
      padding: 6px 8px;
      vertical-align: top;
    }

    table.spec-table tr:nth-child(even) {
      background: #FAF7F4;
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
      min-height: 48px;
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
      margin-top: 18px;
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
      <li><strong>I.1. Declara VINKA:</strong> Ser una plataforma tecnológica especializada en el descubrimiento, promoción, alquiler y gestión automatizada de locaciones exclusivas, servicios para eventos y experiencias de primer nivel, orientada a conectar clientes calificados con proveedores de alto estándar.</li>
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
      <strong>IMPORTANTE:</strong> Para que el perfil del Proveedor sea activado e indexado en el catálogo público de Vinka, es indispensable el cumplimiento estricto de las <strong>Especificaciones Técnicas y Curaduría</strong> detalladas en la Página 2 del presente documento.
    </div>

    <div class="page-footer">
      <span>Vinka Platform &copy; 2026 &bull; Plataforma Digital de Locaciones y Experiencias</span>
      <span>Página 1 de 3 &bull; Convenio de Afiliación</span>
    </div>
  </div>

  <!-- ==================== PÁGINA 2: ESPECIFICACIONES TÉCNICAS ==================== -->
  <div class="page">
    <div class="doc-header">
      <div class="logo-container">
        <img src="${logoSrc}" alt="Vinka" class="logo-img">
      </div>
      <div class="doc-title-block">
        <div class="doc-category-badge">Anexo Normativo &bull; Control de Calidad</div>
        <div class="doc-main-title">ESPECIFICACIONES DE PUBLICACIÓN</div>
        <div class="doc-meta">Estándares obligatorios para activación de catálogo en Vinka</div>
      </div>
    </div>

    <p style="margin-bottom: 8px;">
      Para garantizar una experiencia visual prémium y mantener la confianza de nuestros clientes, cada proveedor registrado en <strong>Vinka</strong> debe someterse a los siguientes estándares de publicación:
    </p>

    <h2 class="section-heading">1. NOMBRE COMERCIAL Y TITULARIDAD</h2>
    <p>
      Debe registrarse el nombre comercial exacto con el que el público reconoce la marca o el recinto. No se permiten nombres genéricos, apodos no comerciales ni inclusión de teléfonos o emojis en el nombre visible del listado.
    </p>

    <h2 class="section-heading">2. PROTOCOLO OBLIGATORIO DE MATERIAL FOTOGRÁFICO</h2>
    <div class="highlight-card">
      <p style="margin-bottom: 4px;"><strong>Requisito Indispensable: Mínimo 5 Fotografías de Alta Calidad</strong></p>
      <p style="font-size: 8.2pt; color: #5C473C; margin-bottom: 6px;">
        Las imágenes son el factor principal de decisión para los organizadores de eventos. El Proveedor deberá entregar un paquete mínimo de 5 fotografías que cumplan rigurosamente con los siguientes lineamientos:
      </p>
      <table class="spec-table">
        <thead>
          <tr>
            <th style="width: 18%;">Fotografía</th>
            <th style="width: 32%;">Enfoque Requerido</th>
            <th style="width: 50%;">Criterio de Calidad &amp; Validación Vinka</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Foto 1: Portada</strong></td>
            <td>Vista panorámica o fachada principal.</td>
            <td>Resolución mínima 1920x1080px (horizontal), iluminación diurna o nocturna profesional, sin autos ni elementos obstructivos.</td>
          </tr>
          <tr>
            <td><strong>Foto 2: Espacio</strong></td>
            <td>Área de montaje / capacidad de aforo.</td>
            <td>Muestra el área con montaje real para evento (mesas, pista, escenario o mobiliario dispuesto).</td>
          </tr>
          <tr>
            <td><strong>Foto 3: Detalle</strong></td>
            <td>Arquitectura, acabados o textura.</td>
            <td>Detalles finos del espacio o servicio (iluminación, barra, texturas, cristalería, jardinería cuidada).</td>
          </tr>
          <tr>
            <td><strong>Foto 4: Servicio</strong></td>
            <td>Experiencia en vivo / operación.</td>
            <td>Platillos terminados, montaje de barras, decoración en acción o servicio activo con armonía visual.</td>
          </tr>
          <tr>
            <td><strong>Foto 5: Adicional</strong></td>
            <td>Amenidad diferencial o plus.</td>
            <td>Área lounge, vista panorámica, suite nupcial, alberca o iluminación ambiental nocturna.</td>
          </tr>
        </tbody>
      </table>
      <div style="font-size: 7.6pt; color: #A36B42; font-weight: 600; margin-top: 4px;">
        &bull; PROCESO DE VERIFICACIÓN: Todas las fotografías son auditadas por el equipo de curaduría de Vinka. Se rechazarán fotos borrosas, capturas de pantalla, imágenes con marcas de agua de terceros, marcas de celular o con baja resolución.
      </div>
    </div>

    <h2 class="section-heading">3. DESCRIPCIÓN CON LÍMITE MÁXIMO DE PALABRAS</h2>
    <p>
      La descripción en el perfil de Vinka está diseñada para ser ágil, inspiradora y directa. Debe respetar un <strong>LÍMITE MÁXIMO DE 180 PALABRAS</strong> estructuradas en 3 bloques clave:
    </p>
    <ul class="legal-list">
      <li><strong>Esencia y Atmósfera (40-60 palabras):</strong> Qué hace único al lugar o servicio, estilo arquitectónico o concepto.</li>
      <li><strong>Capacidad y Versatilidad (40-60 palabras):</strong> Tipos de eventos ideales (bodas, corporativos, aniversarios) y aforo óptimo.</li>
      <li><strong>Amenidades Incluidas (40-60 palabras):</strong> Resumen de beneficios (estacionamiento, climatización, cocina, sonido).</li>
    </ul>

    <h2 class="section-heading">4. CATEGORÍAS AFINES Y ETIQUETAS DE BÚSQUEDA</h2>
    <p>
      Cada afiliado se clasificará bajo una <strong>Categoría Primaria</strong> y hasta dos <strong>Subcategorías de Especialidad</strong> para que los filtros de recomendación inteligente de Vinka sugieran el servicio a los clientes correctos.
    </p>

    <div class="page-footer">
      <span>Vinka Platform &copy; 2026 &bull; Especificaciones Técnicas de Publicación</span>
      <span>Página 2 de 3 &bull; Criterios de Aprobación</span>
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
        <span class="form-label">Ubicación / Dirección Completa (Ciudad, Municipio, Zona):</span>
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
      <div class="check-item"><span class="square-box"></span> Audio, DJ &amp; Iluminación</div>
      <div class="check-item"><span class="square-box"></span> Fotografía &amp; Video</div>
      <div class="check-item"><span class="square-box"></span> Mixología &amp; Barras</div>
      <div class="check-item"><span class="square-box"></span> Wedding / Event Planner</div>
      <div class="check-item"><span class="square-box"></span> Música en Vivo / Shows</div>
    </div>

    <!-- Descripción Oficial -->
    <h2 class="section-heading" style="margin-top: 6px;">3. DESCRIPCIÓN OFICIAL PARA LA PÁGINA (MÁXIMO 180 PALABRAS)</h2>
    <div class="form-field full" style="margin-bottom: 6px;">
      <span class="form-label">Texto descriptivo curado (Destaca ambiente, servicios y propuesta de valor):</span>
      <div class="form-textarea-box" style="height: 52px;"></div>
    </div>

    <!-- Especificaciones Operativas -->
    <h2 class="section-heading" style="margin-top: 4px;">4. ESPECIFICACIONES DE OPERACIÓN &amp; FOTOGRAFÍAS</h2>
    <div class="form-grid">
      <div class="form-field">
        <span class="form-label">Capacidad de Personas (Mín - Máx):</span>
        <div class="form-input-line"></div>
      </div>
      <div class="form-field">
        <span class="form-label">Rango de Precio Base o Paquete Promedio:</span>
        <div class="form-input-line"></div>
      </div>
      <div class="form-field full">
        <span class="form-label">Enlace a Carpeta Cloud de las 5 Fotografías de Alta Calidad (Google Drive / Dropbox):</span>
        <div class="form-input-line"></div>
      </div>
    </div>

    <div style="display: flex; gap: 10px; margin-top: 4px; font-size: 7.2pt; background: #F7F3EE; padding: 5px 8px; border-radius: 4px; border: 1px solid #DECFC2;">
      <div><strong>Checklist Vinka:</strong></div>
      <div><span class="square-box"></span> Foto 1 (Portada)</div>
      <div><span class="square-box"></span> Foto 2 (Espacio)</div>
      <div><span class="square-box"></span> Foto 3 (Detalle)</div>
      <div><span class="square-box"></span> Foto 4 (Servicio)</div>
      <div><span class="square-box"></span> Foto 5 (Plus)</div>
      <div style="color: #A36B42;"><strong>&bull; Estatus: [ &nbsp; ] Verificadas y Aprobadas</strong></div>
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
  console.log('PDF Contract successfully generated at:', pdfOutputPath);
});
