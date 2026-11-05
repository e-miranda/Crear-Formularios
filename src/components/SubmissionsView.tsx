import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  FileDown, 
  Search, 
  Filter, 
  Printer, 
  Eye, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Layers,
  ShieldAlert
} from 'lucide-react';
import { Form, FormSubmission } from '../types';
import { exportToExcel, exportToCSV, printSubmissionPDF } from '../utils/exportUtils';
import { SubmissionDetailModal } from './SubmissionDetailModal';

interface SubmissionsViewProps {
  forms: Form[];
  submissions: FormSubmission[];
  selectedFormId: string;
  userPermissions: string[];
  onSelectFormId: (id: string) => void;
  onUpdateSubmissionStatus: (submissionId: string, status: FormSubmission['status']) => void;
}

export const SubmissionsView: React.FC<SubmissionsViewProps> = ({
  forms = [],
  submissions = [],
  selectedFormId,
  userPermissions = [],
  onSelectFormId,
  onUpdateSubmissionStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'reviewed' | 'approved' | 'rejected'>('all');
  const [detailModalSubmission, setDetailModalSubmission] = useState<FormSubmission | null>(null);

  const canExportExcel = (userPermissions || []).includes('submissions.export_excel');
  const canExportPdf = (userPermissions || []).includes('submissions.export_pdf');
  const canChangeStatus = (userPermissions || []).includes('submissions.change_status');

  const currentForm = forms.find((f) => f.id === selectedFormId) || forms[0] || {
    id: 'empty',
    title: 'Sin Formularios',
    description: '',
    status: 'draft',
    createdAt: '',
    updatedAt: '',
    creatorId: '',
    creatorName: '',
    submissionCount: 0,
    theme: {
      primaryColor: '#2563eb',
      backgroundColor: '#f8fafc',
      cardColor: '#ffffff',
      textColor: '#0f172a',
      borderRadius: 'md',
      fontFamily: 'sans',
      submitButtonText: 'Enviar',
      thankYouTitle: 'Listo',
      thankYouMessage: '',
    },
    fields: [],
  };

  // Filter submissions for the current form
  const formSubmissions = submissions.filter((s) => s.formId === currentForm.id);

  const filteredSubmissions = formSubmissions.filter((sub) => {
    if (statusFilter !== 'all' && sub.status !== statusFilter) return false;
    if (!searchQuery) return true;

    // Search across all submission field values
    const query = searchQuery.toLowerCase();
    const dataMatches = Object.values(sub.data).some((val) =>
      String(val || '').toLowerCase().includes(query)
    );
    const idMatches = sub.id.toLowerCase().includes(query);
    return dataMatches || idMatches;
  });

  const handleExportExcel = () => {
    if (!canExportExcel) {
      alert('Tu rol no cuenta con permiso para exportar a Excel.');
      return;
    }
    exportToExcel(currentForm, filteredSubmissions);
  };

  const handleExportCSV = () => {
    if (!canExportExcel) {
      alert('Tu rol no cuenta con permiso para exportar.');
      return;
    }
    exportToCSV(currentForm, filteredSubmissions);
  };

  // Get primary display fields (skip heading and divider)
  const displayFields = currentForm.fields.filter(
    (f) => f.type !== 'heading' && f.type !== 'divider'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top Header & Form Switcher - Executive clean style */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 border border-slate-800">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Control de Respuestas y Tablas
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <select
                value={currentForm.id}
                onChange={(e) => onSelectFormId(e.target.value)}
                className="text-sm font-bold text-slate-900 bg-transparent border-b border-dashed border-slate-300 pb-0.5 focus:outline-none cursor-pointer"
              >
                {forms.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.title} ({submissions.filter((s) => s.formId === f.id).length})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Automatic Export Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {canExportExcel ? (
            <>
              <button
                onClick={handleExportExcel}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold transition-colors border border-slate-900"
                title="Genera y descarga un archivo .xlsx formateado"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Exportar a Excel (.xlsx)</span>
              </button>

              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-md text-xs font-semibold transition-colors"
              >
                <FileDown className="w-3.5 h-3.5 text-slate-500" />
                <span>Exportar CSV</span>
              </button>
            </>
          ) : (
            <span className="text-xs text-slate-400 italic flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" /> Exportación no autorizada para tu rol
            </span>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Total Respuestas
          </span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">
            {formSubmissions.length}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Nuevas Sin Revisar
          </span>
          <span className="text-2xl font-bold text-slate-800 mt-1 block">
            {formSubmissions.filter((s) => s.status === 'new').length}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Aprobadas
          </span>
          <span className="text-2xl font-bold text-emerald-700 mt-1 block">
            {formSubmissions.filter((s) => s.status === 'approved').length}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Último Registro
          </span>
          <span className="text-xs font-semibold text-slate-700 mt-2 block truncate">
            {formSubmissions[0]
              ? new Date(formSubmissions[0].createdAt).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Sin registros'}
          </span>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por nombre, correo, respuesta..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:border-slate-900"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filtro:
          </span>
          {[
            { id: 'all', label: 'Todos' },
            { id: 'new', label: 'Nuevos' },
            { id: 'reviewed', label: 'Revisados' },
            { id: 'approved', label: 'Aprobados' },
            { id: 'rejected', label: 'Rechazados' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setStatusFilter(item.id as any)}
              className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors whitespace-nowrap ${
                statusFilter === item.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {filteredSubmissions.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-semibold text-slate-700">No se encontraron respuestas</p>
            <p className="text-xs text-slate-400">
              Prueba cambiando los filtros o usa la "Vista Previa" para enviar una respuesta de prueba.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 w-12">#</th>
                  <th className="py-3 px-4">Fecha</th>
                  <th className="py-3 px-4">Estado</th>
                  {displayFields.slice(0, 5).map((field) => (
                    <th key={field.id} className="py-3 px-4 min-w-[140px] truncate">
                      {field.label}
                    </th>
                  ))}
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSubmissions.map((sub, idx) => (
                  <tr
                    key={sub.id}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                    onClick={() => setDetailModalSubmission(sub)}
                  >
                    <td className="py-3 px-4 font-mono text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-4 whitespace-nowrap font-medium text-slate-700">
                      {new Date(sub.createdAt).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td
                      className="py-3 px-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {canChangeStatus ? (
                        <select
                          value={sub.status}
                          onChange={(e) =>
                            onUpdateSubmissionStatus(sub.id, e.target.value as any)
                          }
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border cursor-pointer ${
                            sub.status === 'approved'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : sub.status === 'reviewed'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : sub.status === 'rejected'
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          <option value="new">Nuevo</option>
                          <option value="reviewed">Revisado</option>
                          <option value="approved">Aprobado</option>
                          <option value="rejected">Rechazado</option>
                        </select>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded border bg-slate-100 text-slate-700 border-slate-200">
                          {sub.status.toUpperCase()}
                        </span>
                      )}
                    </td>

                    {displayFields.slice(0, 5).map((field) => {
                      const val = sub.data[field.id];
                      let displayTxt = '-';
                      if (val !== undefined && val !== null) {
                        if (typeof val === 'boolean') displayTxt = val ? 'Sí' : 'No';
                        else if (field.type === 'select' || field.type === 'radio') {
                          const opt = field.options?.find((o) => o.value === val);
                          displayTxt = opt ? opt.label : String(val);
                        } else if (field.type === 'signature') {
                          displayTxt = '[Firma Digital]';
                        } else {
                          displayTxt = String(val);
                        }
                      }

                      return (
                        <td key={field.id} className="py-3 px-4 text-slate-700 font-medium truncate max-w-[200px]">
                          {displayTxt}
                        </td>
                      );
                    })}

                    <td
                      className="py-3 px-4 text-right whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setDetailModalSubmission(sub)}
                          className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                          title="Ver Detalle"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {canExportPdf && (
                          <button
                            onClick={() => printSubmissionPDF(currentForm, sub)}
                            className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                            title="Imprimir / Exportar a PDF"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Submission Detail Modal */}
      <SubmissionDetailModal
        form={currentForm}
        submission={detailModalSubmission}
        isOpen={Boolean(detailModalSubmission)}
        onClose={() => setDetailModalSubmission(null)}
        onStatusChange={canChangeStatus ? onUpdateSubmissionStatus : undefined}
      />
    </div>
  );
};
