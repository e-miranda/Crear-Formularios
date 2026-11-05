import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Calendar, 
  Globe, 
  ShieldCheck, 
  User, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';
import { Form, FormSubmission } from '../types';
import { printSubmissionPDF } from '../utils/exportUtils';

interface SubmissionDetailModalProps {
  form: Form;
  submission: FormSubmission | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange?: (submissionId: string, status: FormSubmission['status']) => void;
}

export const SubmissionDetailModal: React.FC<SubmissionDetailModalProps> = ({
  form,
  submission,
  isOpen,
  onClose,
  onStatusChange,
}) => {
  if (!isOpen || !submission) return null;

  const handlePrint = () => {
    printSubmissionPDF(form, submission);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
              #{submission.id.split('-')[1] || submission.id}
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Detalle Oficial del Envío</h3>
              <p className="text-xs text-slate-500">{form.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-blue-600" />
              <span>Imprimir / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Metadata Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Fecha y Hora</span>
              <span className="font-semibold text-slate-800">
                {new Date(submission.createdAt).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block mb-0.5">Dirección IP</span>
              <span className="font-mono text-slate-700">{submission.ipAddress || '127.0.0.1'}</span>
            </div>

            <div>
              <span className="text-slate-400 block mb-0.5">Estado de Revisión</span>
              <select
                value={submission.status}
                onChange={(e) =>
                  onStatusChange && onStatusChange(submission.id, e.target.value as any)
                }
                className="font-bold text-[11px] px-2 py-0.5 rounded border border-slate-300 bg-white text-slate-800 focus:outline-none"
              >
                <option value="new">Nuevo</option>
                <option value="reviewed">Revisado</option>
                <option value="approved">Aprobado</option>
                <option value="rejected">Rechazado</option>
              </select>
            </div>

            <div>
              <span className="text-slate-400 block mb-0.5">Canal de Ingreso</span>
              <span className="font-medium text-slate-700">Web Directo</span>
            </div>
          </div>

          {/* Form Responses Sheet */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Respuestas Registradas
            </h4>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
              {form.fields
                .filter((f) => f.type !== 'heading' && f.type !== 'divider')
                .map((field) => {
                  const val = submission.data[field.id];
                  let renderedVal: React.ReactNode = '-';

                  if (val !== undefined && val !== null) {
                    if (typeof val === 'boolean') {
                      renderedVal = val ? (
                        <span className="text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Sí, Aceptado
                        </span>
                      ) : (
                        <span className="text-slate-400">No</span>
                      );
                    } else if (field.type === 'select' || field.type === 'radio') {
                      const matched = field.options?.find((o) => o.value === val);
                      renderedVal = matched ? matched.label : String(val);
                    } else if (field.type === 'signature' && val) {
                      renderedVal = (
                        <div className="mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg inline-block">
                          <img
                            src={val}
                            alt="Firma"
                            className="max-h-20 max-w-xs object-contain"
                          />
                        </div>
                      );
                    } else {
                      renderedVal = String(val);
                    }
                  }

                  return (
                    <div key={field.id} className="p-3.5 hover:bg-slate-50/50 transition-colors">
                      <div className="text-xs font-semibold text-slate-500 mb-1">
                        {field.label}
                      </div>
                      <div className="text-sm font-medium text-slate-900 leading-relaxed">
                        {renderedVal}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-400">ID del Registro: {submission.id}</span>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-4 h-4" /> Generar Comprobante PDF
          </button>
        </div>
      </div>
    </div>
  );
};
