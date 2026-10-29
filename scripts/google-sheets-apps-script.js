/**
 * =========================================================================
 * VINKA — GOOGLE APPS SCRIPT PARA GOOGLE SHEETS
 * Conexión automática con el Formulario de la Página Web Vinka
 * =========================================================================
 * 
 * INSTRUCCIONES DE INSTALACIÓN (Toma menos de 1 minuto):
 * 1. Abre tu Google Sheet: 
 *    https://docs.google.com/spreadsheets/d/1LVENdrErohVcwSneNGh5GxYg4Baf6EjFXgGen0QWsAU/edit
 * 2. En el menú superior haz clic en: Extensiones > Apps Script
 * 3. Borra todo el código que aparezca y pega este código completo.
 * 4. Haz clic en el botón azul "Implementar" (arriba a la derecha) > "Nueva implementación".
 * 5. En el engrane selecciona tipo: "Aplicación web".
 * 6. Configura:
 *    - Descripción: "Webhook Vinka Web"
 *    - Ejecutar como: "Yo" (tu cuenta de Google)
 *    - Quién tiene acceso: "Cualquier persona" (Anyone)
 * 7. Haz clic en "Implementar" y copia la URL generada (termina en /exec).
 * 8. Pega esa URL en tu proyecto o envíamela para guardarla en las variables de entorno.
 * =========================================================================
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Crear encabezados si la hoja está vacía
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Fecha y Hora", 
        "Tipo de Registro", 
        "Nombre / Marca", 
        "Correo Electrónico", 
        "Teléfono de Contacto", 
        "Categoría", 
        "Mensaje / Notas"
      ]);
      // Formato a los encabezados
      var headerRange = sheet.getRange(1, 1, 1, 7);
      headerRange.setBackground("#3D2B22");
      headerRange.setFontColor("#FFFFFF");
      headerRange.setFontWeight("bold");
    }

    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    var fecha = Utilities.formatDate(new Date(), "America/Ciudad_Juarez", "yyyy-MM-dd HH:mm:ss");
    var tipo = data.source === "registro_proveedor" ? "PROVEEDOR" : "LISTA DE ESPERA";
    var nombre = data.name || "N/A";
    var correo = data.email || "";
    var telefono = data.phone || "N/A";
    var categoria = data.category || "N/A";
    var notas = data.notes || "";

    sheet.appendRow([fecha, tipo, nombre, correo, telefono, categoria, notas]);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Fila agregada correctamente a Google Sheets"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "ok",
    message: "Webhook de Vinka Google Sheets activo y funcionando."
  })).setMimeType(ContentService.MimeType.JSON);
}
