import React, { useState } from 'react';
import { 
  Type, 
  AlignLeft, 
  Mail, 
  Phone, 
  Hash, 
  Calendar, 
  ChevronDownSquare, 
  CheckCircle, 
  CheckSquare, 
  Star, 
  BarChart, 
  Upload, 
  PenTool, 
  Heading, 
  Minus, 
  ShieldCheck, 
  Eye, 
  Share2, 
  Save, 
  Palette, 
  Sliders, 
  Sparkles,
  Plus,
  ArrowLeft
} from 'lucide-react';
import { Form, FormField, FieldType } from '../../types';
import { FieldItem } from './FieldItem';
import { FieldPropertiesModal } from './FieldPropertiesModal';
import { FormThemeSettings } from './FormThemeSettings';
import { FormPreviewModal } from '../FormPreviewModal';
import { ShareEmbedModal } from '../ShareEmbedModal';

interface FormBuilderProps {
  form: Form;
  onSaveForm: (updatedForm: Form) => void;
  onBackToDashboard: () => void;
  readOnly?: boolean;
}

interface AvailableElement {
  type: FieldType;
  label: string;
  category: 'basic' | 'survey' | 'layout';
  icon: React.ComponentType<{ className?: string }>;
  defaultProps: Partial<FormField>;
}

const AVAILABLE_ELEMENTS: AvailableElement[] = [
  // Básicos
  {
    type: 'text',
    label: 'Texto Corto',
    category: 'basic',
    icon: Type,
    defaultProps: { label: 'Nuevo Campo de Texto', placeholder: 'Ingrese una respuesta breve...', required: false },
  },
  {
    type: 'textarea',
    label: 'Párrafo / Texto Largo',
    category: 'basic',
    icon: AlignLeft,
    defaultProps: { label: 'Comentarios o Descripción', placeholder: 'Escriba aquí los detalles...', required: false },
  },
  {
    type: 'email',
    label: 'Correo Electrónico',
    category: 'basic',
    icon: Mail,
    defaultProps: { label: 'Correo Electrónico', placeholder: 'usuario@empresa.com', required: true },
  },
  {
    type: 'phone',
    label: 'Número de Teléfono',
    category: 'basic',
    icon: Phone,
    defaultProps: { label: 'Teléfono de Contacto', placeholder: '+593 99 000 0000', required: false },
  },
  {
    type: 'number',
    label: 'Campo Numérico',
    category: 'basic',
    icon: Hash,
    defaultProps: { label: 'Cantidad o Valor', placeholder: '0', required: false, min: 0 },
  },
  {
    type: 'date',
    label: 'Selector de Fecha',
    category: 'basic',
    icon: Calendar,
    defaultProps: { label: 'Fecha de Registro', required: false },
  },
  {
    type: 'select',
    label: 'Menú Desplegable',
    category: 'basic',
    icon: ChevronDownSquare,
    defaultProps: {
      label: 'Seleccione una Opción',
      required: false,
      options: [
        { id: '1', label: 'Opción 1', value: 'opcion_1' },
        { id: '2', label: 'Opción 2', value: 'opcion_2' },
        { id: '3', label: 'Opción 3', value: 'opcion_3' },
      ],
    },
  },
  {
    type: 'radio',
    label: 'Selección Única (Radio)',
    category: 'basic',
    icon: CheckCircle,
    defaultProps: {
      label: 'Pregunta de Selección Única',
      required: false,
      options: [
        { id: '1', label: 'Opción A', value: 'a' },
        { id: '2', label: 'Opción B', value: 'b' },
      ],
    },
  },
  {
    type: 'checkbox',
    label: 'Casillas Múltiples',
    category: 'basic',
    icon: CheckSquare,
    defaultProps: {
      label: 'Seleccione todo lo que aplique',
      required: false,
      options: [
        { id: '1', label: 'Interés 1', value: 'int_1' },
        { id: '2', label: 'Interés 2', value: 'int_2' },
        { id: '3', label: 'Interés 3', value: 'int_3' },
      ],
    },
  },
  // Encuesta y Especiales
  {
    type: 'rating',
    label: 'Estrellas de Calificación',
    category: 'survey',
    icon: Star,
    defaultProps: { label: '¿Cómo califica nuestro servicio?', helpText: 'Seleccione de 1 a 5 estrellas', max: 5, required: false },
  },
  {
    type: 'nps',
    label: 'Escala NPS (0-10)',
    category: 'survey',
    icon: BarChart,
    defaultProps: { label: '¿Qué tan probable es que nos recomiende?', helpText: '0 = Nada probable, 10 = Muy probable', min: 0, max: 10, required: false },
  },
  {
    type: 'file',
    label: 'Adjuntar Archivo',
    category: 'survey',
    icon: Upload,
    defaultProps: { label: 'Subir Documento o Evidencia', helpText: 'Formatos soportados: PDF, DOCX, PNG o JPG', required: false },
  },
  {
    type: 'signature',
    label: 'Firma Digital',
    category: 'survey',
    icon: PenTool,
    defaultProps: { label: 'Firma de Conformidad', helpText: 'Dibuje su firma con el cursor o pantalla táctil', required: true },
  },
  {
    type: 'terms',
    label: 'Términos y Condiciones',
    category: 'survey',
    icon: ShieldCheck,
    defaultProps: {
      label: 'Aceptación de Políticas',
      termsText: 'Acepto expresamente el tratamiento de mis datos de conformidad con las políticas de privacidad.',
      required: true,
    },
  },
  // Estructura
  {
    type: 'heading',
    label: 'Encabezado / Título',
    category: 'layout',
    icon: Heading,
    defaultProps: { label: 'Título de la Sección', helpText: 'Instrucciones adicionales para esta sección' },
  },
  {
    type: 'divider',
    label: 'Separador de Línea',
    category: 'layout',
    icon: Minus,
    defaultProps: { label: 'Separador' },
  },
];

export const FormBuilder: React.FC<FormBuilderProps> = ({
  form,
  onSaveForm,
  onBackToDashboard,
  readOnly = false,
}) => {
  const [currentForm, setCurrentForm] = useState<Form>(form);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<FormField | null>(null);
  const [rightPanelTab, setRightPanelTab] = useState<'theme' | null>(null);

  // Modals
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // Drag & drop reordering state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const selectedField = currentForm.fields.find((f) => f.id === selectedFieldId) || null;

  const handleAddField = (elem: AvailableElement) => {
    if (readOnly) return;
    const newField: FormField = {
      id: `f-${Date.now()}`,
      type: elem.type,
      width: 'full',
      required: false,
      ...elem.defaultProps,
    } as FormField;

    setCurrentForm((prev) => ({
      ...prev,
      fields: [...prev.fields, newField],
      updatedAt: new Date().toISOString(),
    }));
    setSelectedFieldId(newField.id);
  };

  const handleUpdateField = (updated: FormField) => {
    setCurrentForm((prev) => ({
      ...prev,
      fields: prev.fields.map((f) => (f.id === updated.id ? updated : f)),
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleDuplicateField = (field: FormField) => {
    if (readOnly) return;
    const duplicated: FormField = {
      ...field,
      id: `f-${Date.now()}`,
      label: `${field.label} (Copia)`,
    };
    const targetIdx = currentForm.fields.findIndex((f) => f.id === field.id);
    const newFields = [...currentForm.fields];
    newFields.splice(targetIdx + 1, 0, duplicated);

    setCurrentForm((prev) => ({
      ...prev,
      fields: newFields,
      updatedAt: new Date().toISOString(),
    }));
    setSelectedFieldId(duplicated.id);
  };

  const handleDeleteField = (fieldId: string) => {
    if (readOnly) return;
    if (currentForm.fields.length <= 1) {
      alert('El formulario debe tener al menos un campo.');
      return;
    }
    setCurrentForm((prev) => ({
      ...prev,
      fields: prev.fields.filter((f) => f.id !== fieldId),
      updatedAt: new Date().toISOString(),
    }));
    if (selectedFieldId === fieldId) {
      setSelectedFieldId(null);
    }
  };

  const handleMoveField = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= currentForm.fields.length) return;

    const updated = [...currentForm.fields];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIdx, 0, moved);

    setCurrentForm((prev) => ({ ...prev, fields: updated }));
  };

  // Drag & drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const updated = [...currentForm.fields];
    const [moved] = updated.splice(draggedIndex, 1);
    updated.splice(targetIndex, 0, moved);

    setCurrentForm((prev) => ({ ...prev, fields: updated }));
    setDraggedIndex(null);
  };

  const handleSave = () => {
    onSaveForm(currentForm);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-100 overflow-hidden">
      {/* Top Builder Control Bar */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 flex items-center justify-between shrink-0 z-10 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="Volver al Panel de Control"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={currentForm.title}
              disabled={readOnly}
              onChange={(e) => setCurrentForm({ ...currentForm, title: e.target.value })}
              className="text-base font-bold text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-blue-500 px-1 py-0.5 rounded focus:outline-none transition-all max-w-xs sm:max-w-md"
            />
            <select
              value={currentForm.status}
              disabled={readOnly}
              onChange={(e) =>
                setCurrentForm({ ...currentForm, status: e.target.value as any })
              }
              className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                currentForm.status === 'active'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : currentForm.status === 'draft'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              <option value="active">Activo</option>
              <option value="draft">Borrador</option>
              <option value="archived">Archivado</option>
            </select>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {saveToast && (
            <span className="text-xs font-semibold text-emerald-600 animate-in fade-in hidden sm:inline">
              ✓ Cambios guardados
            </span>
          )}

          <button
            onClick={() => setRightPanelTab(rightPanelTab === 'theme' ? null : 'theme')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              rightPanelTab === 'theme'
                ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                : 'border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span className="hidden sm:inline">Diseñador</span>
          </button>

          <button
            onClick={() => setIsPreviewOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Eye className="w-4 h-4 text-blue-600" />
            <span className="hidden sm:inline">Vista Previa</span>
          </button>

          <button
            onClick={() => setIsShareOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Share2 className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">Compartir</span>
          </button>

          {!readOnly && (
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Guardar</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Builder Grid */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Form Elements Drawer (Jotform style) */}
        {!readOnly && (
          <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 z-10 shadow-2xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Elementos de Formulario
              </span>
              <span className="text-[10px] bg-slate-100 text-slate-500 font-medium px-1.5 py-0.5 rounded">
                Clic para agregar
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              {/* Basic Fields */}
              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
                  Campos Básicos
                </h4>
                <div className="grid grid-cols-1 gap-1.5">
                  {AVAILABLE_ELEMENTS.filter((e) => e.category === 'basic').map((elem) => {
                    const Icon = elem.icon;
                    return (
                      <button
                        key={elem.type}
                        type="button"
                        onClick={() => handleAddField(elem)}
                        className="w-full flex items-center gap-2.5 p-2 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-left transition-colors group"
                      >
                        <span className="p-1.5 rounded-md bg-slate-100 group-hover:bg-blue-100 text-slate-600 group-hover:text-blue-700 transition-colors">
                          <Icon className="w-3.5 h-3.5" />
                        </span>
                        <span className="text-xs font-medium text-slate-700 group-hover:text-slate-900">
                          {elem.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Survey & Advanced Fields */}
              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
                  Encuestas & Avanzados
                </h4>
                <div className="grid grid-cols-1 gap-1.5">
                  {AVAILABLE_ELEMENTS.filter((e) => e.category === 'survey').map((elem) => {
                    const Icon = elem.icon;
                    return (
                      <button
                        key={elem.type}
                        type="button"
                        onClick={() => handleAddField(elem)}
                        className="w-full flex items-center gap-2.5 p-2 rounded-lg border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 text-left transition-colors group"
                      >
                        <span className="p-1.5 rounded-md bg-slate-100 group-hover:bg-indigo-100 text-slate-600 group-hover:text-indigo-700 transition-colors">
                          <Icon className="w-3.5 h-3.5" />
                        </span>
                        <span className="text-xs font-medium text-slate-700 group-hover:text-slate-900">
                          {elem.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Layout Fields */}
              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
                  Estructura Visual
                </h4>
                <div className="grid grid-cols-1 gap-1.5">
                  {AVAILABLE_ELEMENTS.filter((e) => e.category === 'layout').map((elem) => {
                    const Icon = elem.icon;
                    return (
                      <button
                        key={elem.type}
                        type="button"
                        onClick={() => handleAddField(elem)}
                        className="w-full flex items-center gap-2.5 p-2 rounded-lg border border-slate-200 hover:border-slate-400 hover:bg-slate-50 text-left transition-colors group"
                      >
                        <span className="p-1.5 rounded-md bg-slate-100 text-slate-600">
                          <Icon className="w-3.5 h-3.5" />
                        </span>
                        <span className="text-xs font-medium text-slate-700">
                          {elem.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* Center Canvas */}
        <main
          className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center items-start"
          onClick={() => setSelectedFieldId(null)}
        >
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-10 my-4 space-y-6">
            {/* Form Title & Description in Canvas */}
            <div className="border-b border-slate-200 pb-5">
              <input
                type="text"
                value={currentForm.title}
                disabled={readOnly}
                onChange={(e) => setCurrentForm({ ...currentForm, title: e.target.value })}
                placeholder="Título del Formulario"
                className="w-full text-2xl font-extrabold text-slate-900 border-none p-0 focus:outline-none focus:ring-0 placeholder-slate-300"
              />
              <textarea
                rows={2}
                value={currentForm.description}
                disabled={readOnly}
                onChange={(e) => setCurrentForm({ ...currentForm, description: e.target.value })}
                placeholder="Escriba aquí la descripción o instrucciones generales para los usuarios..."
                className="w-full text-sm text-slate-500 mt-2 border-none p-0 focus:outline-none focus:ring-0 placeholder-slate-300 resize-none"
              />
            </div>

            {/* Fields List */}
            {currentForm.fields.length === 0 ? (
              <div className="py-16 text-center border-2 border-dashed border-slate-200 rounded-2xl">
                <Plus className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-600">El formulario está vacío</p>
                <p className="text-xs text-slate-400 mt-1">
                  Selecciona cualquier elemento del panel izquierdo para empezar a construir tu formulario.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentForm.fields.map((field, idx) => (
                  <FieldItem
                    key={field.id}
                    field={field}
                    index={idx}
                    totalFields={currentForm.fields.length}
                    isSelected={selectedFieldId === field.id}
                    theme={currentForm.theme}
                    onSelect={() => setSelectedFieldId(field.id)}
                    onOpenSettings={() => setEditingField(field)}
                    onDuplicate={() => handleDuplicateField(field)}
                    onDelete={() => handleDeleteField(field.id)}
                    onMoveUp={() => handleMoveField(idx, 'up')}
                    onMoveDown={() => handleMoveField(idx, 'down')}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  />
                ))}
              </div>
            )}

            {/* Dummy Submit Button in canvas */}
            <div className="pt-6 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                style={{ backgroundColor: currentForm.theme.primaryColor || '#2563eb' }}
                className="px-6 py-2.5 text-white font-semibold rounded-xl text-sm opacity-90 cursor-default"
              >
                {currentForm.theme.submitButtonText || 'Enviar Formulario'}
              </button>
            </div>
          </div>
        </main>

        {/* Right Sidebar: Theme Settings Drawer */}
        {rightPanelTab === 'theme' && (
          <aside className="w-80 bg-white border-l border-slate-200 p-6 flex flex-col shrink-0 overflow-y-auto z-10 shadow-2xs">
            <FormThemeSettings
              theme={currentForm.theme}
              onChangeTheme={(updatedTheme) =>
                setCurrentForm({ ...currentForm, theme: updatedTheme })
              }
            />
          </aside>
        )}
      </div>

      {/* Field Properties Modal */}
      <FieldPropertiesModal
        field={editingField}
        allFields={currentForm.fields}
        isOpen={Boolean(editingField)}
        onClose={() => setEditingField(null)}
        onSave={handleUpdateField}
      />

      {/* Interactive Form Preview Simulator */}
      <FormPreviewModal
        form={currentForm}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />

      {/* Share / Embed Code Modal */}
      <ShareEmbedModal
        form={currentForm}
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        onOpenPreview={() => {
          setIsShareOpen(false);
          setIsPreviewOpen(true);
        }}
      />
    </div>
  );
};
