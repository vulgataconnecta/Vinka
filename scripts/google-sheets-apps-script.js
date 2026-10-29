/**
 * =========================================================================
 * VINKA — GOOGLE APPS SCRIPT PARA GOOGLE SHEETS (MULTI-HOJA)
 * Conexión automática con Formulario de Proveedores y Lista de Espera Web
 * =========================================================================
 * 
 * ORGANIZACIÓN DE HOJAS:
 * 1. Pestaña "Proveedores": Guarda registros completos (Nombre, Correo, Teléfono, Categoría, Notas).
 * 2. Pestaña "Lista de Espera": Guarda los correos de la sección "Sé el primero en enterarte".
 * 
 * INSTRUCCIONES PARA ACTUALIZAR (Toma 30 segundos y NO cambia tu URL):
 * 1. Abre tu Google Sheet: 
 *    https://docs.google.com/spreadsheets/d/1LVENdrErohVcwSneNGh5GxYg4Baf6EjFXgGen0QWsAU/edit
 * 2. Ve a: Extensiones > Apps Script
 * 3. Reemplaza todo el código por este nuevo código completo y presiona Guardar (Ctrl + S).
 * 4. Haz clic en el botón azul "Implementar" > "Administrar implementaciones".
 * 5. Haz clic en el icono del Lápiz (Editar) a la derecha.
 * 6. En el menú desplegable "Versión", selecciona "Nueva versión".
 * 7. Haz clic en el botón azul "Implementar".
 *    ¡Listo! Tu misma URL continuará funcionando pero ahora separando en dos pestañas automáticamente.
 * =========================================================================
 */

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();

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

    // =========================================================================
    // CASO 1: LISTA DE ESPERA (Sección "Sé el primero en enterarte")
    // =========================================================================
    if (data.source === "waitlist") {
      var waitlistSheet = ss.getSheetByName("Lista de Espera");
      
      // Si la hoja no existe, la creamos
      if (!waitlistSheet) {
        waitlistSheet = ss.insertSheet("Lista de Espera");
      }

      // Si no tiene encabezados, los agregamos con formato estilizado Vinka
      if (waitlistSheet.getLastRow() === 0) {
        waitlistSheet.appendRow([
          "Fecha y Hora", 
          "Correo Electrónico", 
          "Origen / Sección",
          "Estado"
        ]);
        var headerRange = waitlistSheet.getRange(1, 1, 1, 4);
        headerRange.setBackground("#3D2B22");
        headerRange.setFontColor("#FFFFFF");
        headerRange.setFontWeight("bold");
        headerRange.setHorizontalAlignment("center");
        waitlistSheet.setFrozenRows(1);
      }

      var correo = data.email || "";
      waitlistSheet.appendRow([
        fecha, 
        correo, 
        "Página Web (Sé el primero en enterarte)", 
        "Interesado Preventa"
      ]);

      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        message: "Correo guardado con éxito en la pestaña 'Lista de Espera'"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // =========================================================================
    // CASO 2: REGISTRO DE PROVEEDORES (Formulario /registro-proveedor)
    // =========================================================================
    else {
      var provSheet = ss.getSheetByName("Proveedores");

      // Si no existe 'Proveedores', revisamos la hoja activa o la primera hoja
      if (!provSheet) {
        var firstSheet = ss.getSheets()[0];
        if (firstSheet && firstSheet.getName() !== "Lista de Espera") {
          provSheet = firstSheet;
          // Si tenía nombre por defecto, le asignamos 'Proveedores' para claridad
          if (provSheet.getName().match(/^(Hoja|Sheet)\s*\d*$/i)) {
            provSheet.setName("Proveedores");
          }
        } else {
          provSheet = ss.insertSheet("Proveedores");
        }
      }

      // Si no tiene encabezados, los agregamos
      if (provSheet.getLastRow() === 0) {
        provSheet.appendRow([
          "Fecha y Hora", 
          "Nombre Comercial / Marca", 
          "Correo Electrónico", 
          "Teléfono (WhatsApp)", 
          "Categoría Principal", 
          "Notas / Especificaciones"
        ]);
        var headerRange = provSheet.getRange(1, 1, 1, 6);
        headerRange.setBackground("#3D2B22");
        headerRange.setFontColor("#FFFFFF");
        headerRange.setFontWeight("bold");
        headerRange.setHorizontalAlignment("center");
        provSheet.setFrozenRows(1);
      }

      var nombre = data.name || "N/A";
      var correo = data.email || "";
      var telefono = data.phone || "N/A";
      var categoria = data.category || "N/A";
      var notas = data.notes || "";

      provSheet.appendRow([fecha, nombre, correo, telefono, categoria, notas]);

      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        message: "Proveedor guardado con éxito en la pestaña 'Proveedores'"
      })).setMimeType(ContentService.MimeType.JSON);
    }

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
    message: "Webhook multi-hoja de Vinka activo (Proveedores & Lista de Espera)."
  })).setMimeType(ContentService.MimeType.JSON);
}
