import React, { useState } from 'react';
import { 
  Plus, 
  FileText, 
  Users, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Edit3, 
  Eye, 
  Share2, 
  Copy, 
  Trash2, 
  TableProperties,
  Search,
  Sparkles,
  ShieldCheck,
  Shield,
  ArrowRight
} from 'lucide-react';
import { Form, FormSubmission, AppUser, RoleDefinition } from '../types';
import { FormPreviewModal } from './FormPreviewModal';
import { ShareEmbedModal } from './ShareEmbedModal';

interface AdminDashboardProps {
  forms: Form[];
  submissions: FormSubmission[];
  users: AppUser[];
  currentUser: AppUser;
  roles: RoleDefinition[];
  userPermissions: string[];
  onEditForm: (formId: string) => void;
  onViewSubmissions: (formId: string) => void;
  onNewForm: () => void;
  onDuplicateForm: (form: Form) => void;
  onDeleteForm: (formId: string) => void;
  onSelectTemplate: (templateType: string) => void;
  onNewSubmission: (submission: FormSubmission) => void;
  onOpenRolesTab: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  forms = [],
  submissions = [],
  users = [],
  currentUser,
  roles = [],
  userPermissions = [],
  onEditForm,
  onViewSubmissions,
  onNewForm,
  onDuplicateForm,
  onDeleteForm,
  onSelectTemplate,
  onNewSubmission,
  onOpenRolesTab,
}) => {
  const [activeTab, setActiveTab] = useState<'forms' | 'users' | 'templates'>('forms');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'draft' | 'archived'>('all');

  // Preview & Share Modals
  const [previewingForm, setPreviewingForm] = useState<Form | null>(null);
  const [sharingForm, setSharingForm] = useState<Form | null>(null);

  const canCreate = (userPermissions || []).includes('forms.create');
  const canEdit = (userPermissions || []).includes('forms.edit');
  const canDelete = (userPermissions || []).includes('forms.delete');
  const canViewSubmissions = (userPermissions || []).includes('submissions.view');
  const canManageRoles = (userPermissions || []).includes('roles.manage');

  const totalSubmissions = submissions.length;
  const activeFormsCount = forms.filter((f) => f.status === 'active').length;

  const filteredForms = forms.filter((f) => {
    if (statusFilter !== 'all' && f.status !== statusFilter) return false;
    if (!searchQuery) return true;
    return (
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Executive Header Banner - Flat solid corporate style without gradients */}
      <div className="bg-slate-900 text-white rounded-xl p-6 sm:p-7 border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-xs text-slate-300 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-300" />
              <span>Plataforma Corporativa de Formularios y Respuestas</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Panel de Administración y Control
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Bienvenido, <strong className="text-slate-200">{currentUser.name}</strong> ({currentUser.department}). Administra formularios dinámicos, supervisa respuestas en tiempo real, exporta automáticamente a Excel (.xlsx) y PDF, y gestiona la seguridad del equipo.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {canCreate && (
              <button
                onClick={onNewForm}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-white text-slate-900 hover:bg-slate-100 rounded-md text-xs font-semibold transition-colors border border-white"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nuevo Formulario</span>
              </button>
            )}

            {canManageRoles && (
              <button
                onClick={onOpenRolesTab}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 text-slate-200 hover:bg-slate-700 rounded-md text-xs font-semibold transition-colors border border-slate-700"
              >
                <Shield className="w-3.5 h-3.5 text-slate-300" />
                <span>Gestionar Roles</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KPI Metrics - Clean single border card design */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Formularios Creados
            </span>
            <div className="w-7 h-7 rounded bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {forms.length}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">
            {activeFormsCount} activos en línea
          </span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Respuestas Recibidas
            </span>
            <div className="w-7 h-7 rounded bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {totalSubmissions}
          </div>
          <span className="text-xs text-emerald-700 font-semibold mt-1 block">
            +14% vs. mes anterior
          </span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Tasa de Finalización
            </span>
            <div className="w-7 h-7 rounded bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            87.4%
          </div>
          <span className="text-xs text-slate-500 mt-1 block">
            Promedio de conversión
          </span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Miembros & Roles
            </span>
            <div className="w-7 h-7 rounded bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {users.length}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">
            {roles.length} roles configurados
          </span>
        </div>
      </div>

      {/* Navigation Subtabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-1">
        <button
          onClick={() => setActiveTab('forms')}
          className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'forms'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          Formularios ({forms.length})
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'users'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          Equipo y Roles ({users.length})
        </button>

        <button
          onClick={() => setActiveTab('templates')}
          className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'templates'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-slate-500" />
          Plantillas Predefinidas
        </button>
      </div>

      {/* Tab: Forms List */}
      {activeTab === 'forms' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar formularios por título o descripción..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:border-slate-900"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center gap-1 bg-white p-1 rounded-md border border-slate-200">
                {(['all', 'active', 'draft', 'archived'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors capitalize ${
                      statusFilter === st
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {st === 'all' ? 'Todos' : st === 'active' ? 'Activos' : st === 'draft' ? 'Borrador' : 'Archivado'}
                  </button>
                ))}
              </div>

              {canCreate && (
                <button
                  onClick={onNewForm}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold transition-colors border border-slate-900"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Crear Formulario</span>
                </button>
              )}
            </div>
          </div>

          {/* Forms Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-5">Título del Formulario</th>
                    <th className="py-3 px-4">Estado</th>
                    <th className="py-3 px-4">Campos</th>
                    <th className="py-3 px-4">Envíos</th>
                    <th className="py-3 px-4">Creador</th>
                    <th className="py-3 px-4">Última Actualización</th>
                    <th className="py-3 px-5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredForms.map((form) => {
                    const formSubCount = submissions.filter((s) => s.formId === form.id).length;

                    return (
                      <tr key={form.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-5">
                          <div className="font-bold text-slate-900 text-xs">{form.title}</div>
                          <p className="text-slate-500 text-[11px] mt-0.5 line-clamp-1 max-w-sm">
                            {form.description}
                          </p>
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded border ${
                              form.status === 'active'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : form.status === 'draft'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                          >
                            {form.status.toUpperCase()}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-semibold text-slate-700">
                          {form.fields.length} campos
                        </td>

                        <td className="py-3.5 px-4">
                          {canViewSubmissions ? (
                            <button
                              onClick={() => onViewSubmissions(form.id)}
                              className="inline-flex items-center gap-1 font-semibold text-slate-900 hover:text-blue-600 hover:underline"
                            >
                              <TableProperties className="w-3.5 h-3.5" />
                              <span>{formSubCount} respuestas</span>
                            </button>
                          ) : (
                            <span className="text-slate-400">{formSubCount} respuestas</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-slate-600 font-medium">
                          {form.creatorName}
                        </td>

                        <td className="py-3.5 px-4 text-slate-400">
                          {new Date(form.updatedAt).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>

                        <td className="py-3.5 px-5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setPreviewingForm(form)}
                              className="p-1.5 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                              title="Probar Formulario (Vista Previa)"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {canEdit && (
                              <button
                                onClick={() => onEditForm(form.id)}
                                className="p-1.5 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                                title="Editar en Constructor"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            )}

                            <button
                              onClick={() => setSharingForm(form)}
                              className="p-1.5 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                              title="Compartir enlace o código de inserción"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                            </button>

                            {canEdit && (
                              <button
                                onClick={() => onDuplicateForm(form)}
                                className="p-1.5 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                                title="Duplicar / Clonar"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {canDelete && (
                              <button
                                onClick={() => onDeleteForm(form.id)}
                                className="p-1.5 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                title="Eliminar Formulario"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Users and Roles Overview */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Estructura de Roles y Accesos
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Los perfiles determinan qué acciones puede realizar cada usuario sobre los formularios, respuestas y esquemas.
              </p>
            </div>

            {canManageRoles && (
              <button
                onClick={onOpenRolesTab}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 text-white rounded-md text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Abrir Administración de Roles</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user) => {
              const uRole = roles.find((r) => r.id === user.role) || {
                name: user.role,
                description: '',
                badgeBg: 'bg-slate-100',
                badgeText: 'text-slate-800',
                badgeBorder: 'border-slate-200',
                permissions: [],
              };
              return (
                <div
                  key={user.id}
                  className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 text-xs truncate">{user.name}</h4>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{user.department}</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Rol Asignado
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${uRole.badgeBg} ${uRole.badgeText} ${uRole.badgeBorder}`}
                      >
                        {uRole.name}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                      {uRole.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Templates Gallery */}
      {activeTab === 'templates' && (
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Plantillas Preconstruidas</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Selecciona una plantilla lista para implementar con esquemas normalizados.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                id: 'tpl-customer-feedback',
                title: 'Encuesta de Satisfacción de Clientes',
                desc: 'Mide el Net Promoter Score (NPS), calidad del servicio y comentarios de mejora continua.',
                fieldsCount: 8,
              },
              {
                id: 'tpl-job-application',
                title: 'Postulación de Empleo con CV y Firma',
                desc: 'Recibe currículums en PDF, datos personales, cargo al que postula y firma digital de conformidad.',
                fieldsCount: 9,
              },
              {
                id: 'tpl-event-registration',
                title: 'Registro a Conferencia de Tecnología',
                desc: 'Inscripción de asistentes con selección de talleres, tipo de pase y requerimientos dietéticos.',
                fieldsCount: 7,
              },
              {
                id: 'tpl-technical-support',
                title: 'Solicitud de Soporte Técnico y Tickets',
                desc: 'Reporte ágil de fallas con nivel de criticidad, captura de módulos afectados y descripción.',
                fieldsCount: 5,
              },
              {
                id: 'tpl-lead-contact',
                title: 'Formulario de Contacto Comercial B2B',
                desc: 'Generación de prospectos calificados, presupuesto estimado y canal preferido de reunión.',
                fieldsCount: 6,
              },
              {
                id: 'tpl-event-feedback',
                title: 'Evaluación Posterior al Evento',
                desc: 'Valoración de ponentes, logística y sugerencias para futuras ediciones de webinars o talleres.',
                fieldsCount: 6,
              },
            ].map((tpl) => (
              <div
                key={tpl.id}
                className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between hover:border-slate-300 transition-colors"
              >
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    {tpl.fieldsCount} Campos incluidos
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm mb-1.5">{tpl.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{tpl.desc}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end">
                  <button
                    onClick={() => onSelectTemplate(tpl.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Usar Plantilla
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview Modal for testing */}
      {previewingForm && (
        <FormPreviewModal
          form={previewingForm}
          isOpen={Boolean(previewingForm)}
          onClose={() => setPreviewingForm(null)}
          onSubmitSuccess={(sub) => {
            onNewSubmission(sub);
          }}
        />
      )}

      {/* Share / Embed Modal */}
      {sharingForm && (
        <ShareEmbedModal
          form={sharingForm}
          isOpen={Boolean(sharingForm)}
          onClose={() => setSharingForm(null)}
          onOpenPreview={() => {
            const f = sharingForm;
            setSharingForm(null);
            setPreviewingForm(f);
          }}
        />
      )}
    </div>
  );
};
