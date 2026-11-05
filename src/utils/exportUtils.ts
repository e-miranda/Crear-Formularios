import * as XLSX from 'xlsx';
import { Form, FormSubmission, FormField } from '../types';

/**
 * Formats submission data into a readable object mapping field labels to values
 */
export function formatSubmissionsForExport(form: Form, submissions: FormSubmission[]) {
  const fieldMap: Record<string, FormField> = {};
  form.fields.forEach((f) => {
    fieldMap[f.id] = f;
  });

  return submissions.map((sub, index) => {
    const row: Record<string, any> = {
      '# Envio': index + 1,
      'ID Envio': sub.id,
      'Fecha Envio': new Date(sub.createdAt).toLocaleString('es-ES'),
      'Estado': sub.status.toUpperCase(),
      'Direccion IP': sub.ipAddress || '127.0.0.1',
    };

    form.fields.forEach((field) => {
      // Skip decorative fields
      if (field.type === 'heading' || field.type === 'divider') return;

      const rawVal = sub.data[field.id];
      let displayVal: string = '';

      if (rawVal === undefined || rawVal === null) {
        displayVal = '-';
      } else if (typeof rawVal === 'boolean') {
        displayVal = rawVal ? 'Sí' : 'No';
      } else if (Array.isArray(rawVal)) {
        displayVal = rawVal.join(', ');
      } else if (field.type === 'select' || field.type === 'radio') {
        const matchedOpt = field.options?.find((o) => o.value === rawVal);
        displayVal = matchedOpt ? matchedOpt.label : String(rawVal);
      } else if (field.type === 'signature') {
        displayVal = rawVal ? '[Firma Digital Capturada]' : 'No firmado';
      } else {
        displayVal = String(rawVal);
      }

      row[field.label] = displayVal;
    });

    return row;
  });
}

/**
 * Generates and downloads an Excel file (.xlsx) automatically
 */
export function exportToExcel(form: Form, submissions: FormSubmission[]) {
  if (submissions.length === 0) {
    alert('No hay respuestas para exportar.');
    return;
  }

  const exportRows = formatSubmissionsForExport(form, submissions);
  const worksheet = XLSX.utils.json_to_sheet(exportRows);

  // Auto-fit column widths
  const maxProps = Object.keys(exportRows[0] || {});
  const colWidths = maxProps.map((key) => {
    const maxLen = Math.max(
      key.length,
      ...exportRows.map((r) => String(r[key] || '').length)
    );
    return { wch: Math.min(Math.max(maxLen + 3, 12), 50) };
  });
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  const sheetName = form.title.slice(0, 30).replace(/[:\/\\?*\[\]]/g, '');
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName || 'Respuestas');

  const fileName = `${form.title.replace(/\s+/g, '_')}_respuestas_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
}

/**
 * Generates and downloads a clean CSV file
 */
export function exportToCSV(form: Form, submissions: FormSubmission[]) {
  if (submissions.length === 0) {
    alert('No hay respuestas para exportar.');
    return;
  }

  const exportRows = formatSubmissionsForExport(form, submissions);
  const worksheet = XLSX.utils.json_to_sheet(exportRows);
  const csvOutput = XLSX.utils.sheet_to_csv(worksheet);

  const blob = new Blob(['\uFEFF' + csvOutput], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${form.title.replace(/\s+/g, '_')}_respuestas.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Triggers clean PDF print for single submission or all submissions
 */
export function printSubmissionPDF(form: Form, submission: FormSubmission) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    // Fallback if popup blocked
    window.print();
    return;
  }

  const fieldRowsHtml = form.fields
    .filter((f) => f.type !== 'heading' && f.type !== 'divider')
    .map((field) => {
      const val = submission.data[field.id];
      let formattedVal = '-';
      if (val !== undefined && val !== null) {
        if (typeof val === 'boolean') formattedVal = val ? 'Sí' : 'No';
        else if (field.type === 'select' || field.type === 'radio') {
          const opt = field.options?.find((o) => o.value === val);
          formattedVal = opt ? opt.label : String(val);
        } else if (field.type === 'signature' && val) {
          formattedVal = `<img src="${val}" alt="Firma" style="max-height: 70px; border: 1px dashed #cbd5e1; padding: 4px; border-radius: 4px;" />`;
        } else {
          formattedVal = String(val);
        }
      }

      return `
        <div style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; display: flex; flex-direction: column; gap: 4px;">
          <div style="font-size: 13px; font-weight: 600; color: #475569; text-transform: uppercase; letter-spacing: 0.5px;">${field.label}</div>
          <div style="font-size: 15px; color: #0f172a; font-weight: 500;">${formattedVal}</div>
        </div>
      `;
    })
    .join('');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Envío #${submission.id} - ${form.title}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 40px; color: #0f172a; }
          .header { border-bottom: 3px solid #2563eb; padding-bottom: 16px; margin-bottom: 24px; }
          .badge { display: inline-block; padding: 4px 10px; background: #e0e7ff; color: #3730a3; border-radius: 9999px; font-size: 12px; font-weight: 600; }
          .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; background: #f8fafc; padding: 14px; border-radius: 8px; margin-bottom: 24px; font-size: 13px; }
          @media print {
            body { margin: 20mm; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h1 style="margin: 0; font-size: 22px; color: #1e293b;">${form.title}</h1>
            <span class="badge">ESTADO: ${submission.status.toUpperCase()}</span>
          </div>
          <p style="margin: 6px 0 0 0; color: #64748b; font-size: 14px;">Comprobante Oficial de Envío - FormCraft Engine</p>
        </div>

        <div class="meta-grid">
          <div><strong>ID de Envío:</strong> ${submission.id}</div>
          <div><strong>Fecha y Hora:</strong> ${new Date(submission.createdAt).toLocaleString('es-ES')}</div>
          <div><strong>Dirección IP:</strong> ${submission.ipAddress || '127.0.0.1'}</div>
          <div><strong>Formulario ID:</strong> ${form.id}</div>
        </div>

        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px 20px;">
          <h3 style="margin-top: 0; color: #1e293b; font-size: 16px; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px;">Respuestas Registradas</h3>
          ${fieldRowsHtml}
        </div>

        <div style="margin-top: 40px; border-top: 1px solid #cbd5e1; padding-top: 12px; font-size: 11px; color: #94a3b8; text-align: center;">
          Generado automáticamente por el motor de formularios dinámicos FormCraft. Exportable a PDF y Excel.
        </div>
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 400);
}
