import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Sliders, 
  GitFork, 
  Check, 
  HelpCircle,
  Maximize2
} from 'lucide-react';
import { FormField, FieldOption, ConditionalRule } from '../../types';

interface FieldPropertiesModalProps {
  field: FormField | null;
  allFields: FormField[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedField: FormField) => void;
}

export const FieldPropertiesModal: React.FC<FieldPropertiesModalProps> = ({
  field,
  allFields,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen || !field) return null;

  const [activeTab, setActiveTab] = useState<'general' | 'options' | 'logic'>('general');
  const [label, setLabel] = useState(field.label);
  const [placeholder, setPlaceholder] = useState(field.placeholder || '');
  const [helpText, setHelpText] = useState(field.helpText || '');
  const [required, setRequired] = useState(field.required);
  const [width, setWidth] = useState<'full' | 'half' | 'third'>(field.width || 'full');
  const [termsText, setTermsText] = useState(field.termsText || '');

  // Options for select, radio, checkbox
  const [options, setOptions] = useState<FieldOption[]>(
    field.options || [
      { id: 'opt-1', label: 'Opción 1', value: 'opcion_1' },
      { id: 'opt-2', label: 'Opción 2', value: 'opcion_2' },
    ]
  );

  // Conditional Logic
  const [conditionalRules, setConditionalRules] = useState<ConditionalRule[]>(
    field.conditionalRules || []
  );

  const handleAddOption = () => {
    const nextIdx = options.length + 1;
    setOptions([
      ...options,
      {
        id: `opt-${Date.now()}-${nextIdx}`,
        label: `Opción ${nextIdx}`,
        value: `opcion_${nextIdx}`,
      },
    ]);
  };

  const handleUpdateOption = (id: string, newLabel: string) => {
    setOptions(
      options.map((opt) =>
        opt.id === id
          ? { ...opt, label: newLabel, value: newLabel.toLowerCase().replace(/\s+/g, '_') }
          : opt
      )
    );
  };

  const handleDeleteOption = (id: string) => {
    if (options.length <= 1) {
      alert('Debe existir al menos una opción.');
      return;
    }
    setOptions(options.filter((opt) => opt.id !== id));
  };

  const handleAddRule = () => {
    // Find candidate parent fields (exclude self and decorative)
    const candidates = allFields.filter(
      (f) => f.id !== field.id && f.type !== 'heading' && f.type !== 'divider'
    );
    if (candidates.length === 0) {
      alert('Se necesitan otros campos en el formulario para crear una regla condicional.');
      return;
    }

    const newRule: ConditionalRule = {
      id: `rule-${Date.now()}`,
      fieldId: candidates[0].id,
      operator: 'equals',
      value: '',
      action: 'show',
    };

    setConditionalRules([...conditionalRules, newRule]);
  };

  const handleSave = () => {
    const updated: FormField = {
      ...field,
      label,
      placeholder,
      helpText,
      required,
      width,
      termsText: field.type === 'terms' ? termsText : field.termsText,
      options: ['select', 'radio', 'checkbox'].includes(field.type) ? options : field.options,
      conditionalRules,
    };
    onSave(updated);
    onClose();
  };

  const hasOptions = ['select', 'radio', 'checkbox'].includes(field.type);
  const otherFields = allFields.filter(
    (f) => f.id !== field.id && f.type !== 'heading' && f.type !== 'divider'
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Propiedades del Campo</h3>
              <p className="text-xs text-slate-400 capitalize">Tipo: {field.type}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-100 px-6 bg-slate-50/50">
          <button
            onClick={() => setActiveTab('general')}
            className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'general'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            General
          </button>
          {hasOptions && (
            <button
              onClick={() => setActiveTab('options')}
              className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === 'options'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Opciones ({options.length})
            </button>
          )}
          <button
            onClick={() => setActiveTab('logic')}
            className={`py-2.5 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'logic'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <GitFork className="w-3.5 h-3.5" />
            Lógica Condicional {conditionalRules.length > 0 && `(${conditionalRules.length})`}
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeTab === 'general' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Etiqueta del Campo
                </label>
                <input
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              {field.type !== 'heading' && field.type !== 'divider' && field.type !== 'rating' && field.type !== 'nps' && field.type !== 'signature' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Texto de Marcador de Posición (Placeholder)
                  </label>
                  <input
                    type="text"
                    value={placeholder}
                    onChange={(e) => setPlaceholder(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="Ej. Ingrese su respuesta..."
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Texto de Ayuda / Subtítulo
                </label>
                <input
                  type="text"
                  value={helpText}
                  onChange={(e) => setHelpText(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="Instrucciones breves para el encuestado"
                />
              </div>

              {field.type === 'terms' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Texto del Acuerdo / Términos
                  </label>
                  <textarea
                    rows={3}
                    value={termsText}
                    onChange={(e) => setTermsText(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Ancho en Cuadrícula
                  </label>
                  <select
                    value={width}
                    onChange={(e) => setWidth(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="full">Ancho Completo (100%)</option>
                    <option value="half">Medio Ancho (50%)</option>
                    <option value="third">Un Tercio (33%)</option>
                  </select>
                </div>

                {field.type !== 'heading' && field.type !== 'divider' && (
                  <div className="flex flex-col justify-end">
                    <label className="flex items-center gap-2.5 p-2 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer text-sm">
                      <input
                        type="checkbox"
                        checked={required}
                        onChange={(e) => setRequired(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="font-semibold text-slate-800">¿Campo Obligatorio?</span>
                    </label>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'options' && hasOptions && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Opciones disponibles para el usuario:</span>
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50"
                >
                  <Plus className="w-3.5 h-3.5" /> Agregar Opción
                </button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {options.map((opt, index) => (
                  <div key={opt.id} className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 w-5">{index + 1}.</span>
                    <input
                      type="text"
                      value={opt.label}
                      onChange={(e) => handleUpdateOption(opt.id, e.target.value)}
                      className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteOption(opt.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded hover:bg-red-50 transition-colors"
                      title="Eliminar opción"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'logic' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Reglas de Visibilidad Dinámica
                  </h4>
                  <p className="text-xs text-slate-500">
                    Muestra u oculta este campo según la respuesta de otro campo.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddRule}
                  className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50"
                >
                  <Plus className="w-3.5 h-3.5" /> Nueva Regla
                </button>
              </div>

              {conditionalRules.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl">
                  <GitFork className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-500 font-medium">No hay reglas condicionales configuradas.</p>
                  <p className="text-[11px] text-slate-400">Este campo siempre se mostrará por defecto.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {conditionalRules.map((rule, index) => (
                    <div
                      key={rule.id}
                      className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 text-xs"
                    >
                      <div className="flex items-center justify-between font-semibold text-slate-700">
                        <span>Regla #{index + 1}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setConditionalRules(conditionalRules.filter((r) => r.id !== rule.id))
                          }
                          className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Quitar
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {/* Action */}
                        <select
                          value={rule.action}
                          onChange={(e) => {
                            const updated = conditionalRules.map((r) =>
                              r.id === rule.id ? { ...r, action: e.target.value as any } : r
                            );
                            setConditionalRules(updated);
                          }}
                          className="px-2 py-1.5 bg-white border border-slate-300 rounded-md font-semibold text-slate-800"
                        >
                          <option value="show">Mostrar este campo SI</option>
                          <option value="hide">Ocultar este campo SI</option>
                        </select>

                        {/* Target Field */}
                        <select
                          value={rule.fieldId}
                          onChange={(e) => {
                            const updated = conditionalRules.map((r) =>
                              r.id === rule.id ? { ...r, fieldId: e.target.value } : r
                            );
                            setConditionalRules(updated);
                          }}
                          className="px-2 py-1.5 bg-white border border-slate-300 rounded-md text-slate-800"
                        >
                          {otherFields.map((of) => (
                            <option key={of.id} value={of.id}>
                              {of.label.slice(0, 24)}...
                            </option>
                          ))}
                        </select>

                        {/* Operator */}
                        <select
                          value={rule.operator}
                          onChange={(e) => {
                            const updated = conditionalRules.map((r) =>
                              r.id === rule.id ? { ...r, operator: e.target.value as any } : r
                            );
                            setConditionalRules(updated);
                          }}
                          className="px-2 py-1.5 bg-white border border-slate-300 rounded-md text-slate-800"
                        >
                          <option value="equals">es igual a</option>
                          <option value="not_equals">es diferente de</option>
                          <option value="contains">contiene el texto</option>
                          <option value="is_empty">está vacío</option>
                          <option value="is_not_empty">no está vacío</option>
                        </select>
                      </div>

                      {rule.operator !== 'is_empty' && rule.operator !== 'is_not_empty' && (
                        <div>
                          <input
                            type="text"
                            value={rule.value}
                            onChange={(e) => {
                              const updated = conditionalRules.map((r) =>
                                r.id === rule.id ? { ...r, value: e.target.value } : r
                              );
                              setConditionalRules(updated);
                            }}
                            placeholder="Valor esperado (ej. 'si', 'web', etc.)"
                            className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md text-xs"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-200/60"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm"
          >
            <Check className="w-4 h-4" /> Aplicar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};
