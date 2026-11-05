import React from 'react';
import { 
  GripVertical, 
  Settings, 
  Copy, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Star, 
  Upload, 
  PenTool, 
  CheckSquare, 
  HelpCircle 
} from 'lucide-react';
import { FormField, FormTheme } from '../../types';

interface FieldItemProps {
  field: FormField;
  index: number;
  totalFields: number;
  isSelected: boolean;
  theme: FormTheme;
  onSelect: () => void;
  onOpenSettings: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
}

export const FieldItem: React.FC<FieldItemProps> = ({
  field,
  index,
  totalFields,
  isSelected,
  theme,
  onSelect,
  onOpenSettings,
  onDuplicate,
  onDelete,
  onMoveUp,
  onMoveDown,
  onDragStart,
  onDragOver,
  onDrop,
}) => {
  const isHeading = field.type === 'heading';
  const isDivider = field.type === 'divider';

  const widthClass =
    field.width === 'half'
      ? 'col-span-1'
      : field.width === 'third'
      ? 'col-span-1 sm:col-span-1'
      : 'col-span-1 sm:col-span-2';

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={(e) => onDrop(e, index)}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      className={`${widthClass} group relative p-4 rounded-xl transition-all duration-150 border-2 cursor-pointer ${
        isSelected
          ? 'border-blue-600 bg-blue-50/20 shadow-xs ring-2 ring-blue-600/10'
          : 'border-slate-200 hover:border-slate-300 bg-white hover:shadow-xs'
      }`}
    >
      {/* Top Floating Action Bar (Jotform style on hover / selected) */}
      <div
        className={`absolute -top-3.5 right-3 z-20 flex items-center gap-1 bg-white border border-slate-200 shadow-md rounded-lg p-0.5 transition-opacity ${
          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onOpenSettings}
          title="Configurar Campo"
          className="p-1 rounded text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
        >
          <Settings className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={onDuplicate}
          title="Duplicar Campo"
          className="p-1 rounded text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>

        {index > 0 && (
          <button
            type="button"
            onClick={onMoveUp}
            title="Mover arriba"
            className="p-1 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        )}

        {index < totalFields - 1 && (
          <button
            type="button"
            onClick={onMoveDown}
            title="Mover abajo"
            className="p-1 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          type="button"
          onClick={onDelete}
          title="Eliminar Campo"
          className="p-1 rounded text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Drag handle icon */}
      <div className="absolute top-4 left-1.5 text-slate-300 group-hover:text-slate-500 cursor-grab active:cursor-grabbing">
        <GripVertical className="w-3.5 h-3.5" />
      </div>

      {/* Content Area */}
      <div className="pl-4">
        {/* Label & Type Indicator */}
        {!isDivider && (
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-semibold text-slate-800 flex items-center gap-1">
              {field.label}
              {field.required && <span className="text-red-500 font-bold">*</span>}
            </label>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
              {field.type}
            </span>
          </div>
        )}

        {field.helpText && !isDivider && (
          <p className="text-xs text-slate-400 mb-2">{field.helpText}</p>
        )}

        {/* Dummy Canvas Visual Rendering */}
        {renderPreviewField(field)}

        {/* Conditional Logic Indicator */}
        {field.conditionalRules && field.conditionalRules.length > 0 && (
          <div className="mt-2 flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60 w-fit">
            <span>⚡ Lógica activa: {field.conditionalRules.length} regla(s)</span>
          </div>
        )}
      </div>
    </div>
  );
};

function renderPreviewField(field: FormField) {
  switch (field.type) {
    case 'heading':
      return null;

    case 'divider':
      return <hr className="my-2 border-slate-300 border-dashed" />;

    case 'text':
    case 'email':
    case 'phone':
    case 'number':
    case 'date':
      return (
        <input
          type="text"
          disabled
          placeholder={field.placeholder || `Entrada de tipo ${field.type}`}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50 text-slate-400 cursor-not-allowed"
        />
      );

    case 'textarea':
      return (
        <textarea
          rows={2}
          disabled
          placeholder={field.placeholder || 'Entrada de texto largo...'}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50 text-slate-400 cursor-not-allowed"
        />
      );

    case 'select':
      return (
        <select
          disabled
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50 text-slate-400 cursor-not-allowed"
        >
          <option>{field.options?.[0]?.label || 'Seleccionar opción...'}</option>
        </select>
      );

    case 'radio':
    case 'checkbox':
      return (
        <div className="space-y-1.5 pt-1">
          {field.options?.slice(0, 3).map((opt) => (
            <div key={opt.id} className="flex items-center gap-2 text-xs text-slate-600">
              <span
                className={`w-3.5 h-3.5 border border-slate-300 ${
                  field.type === 'radio' ? 'rounded-full' : 'rounded'
                } bg-white inline-block`}
              />
              <span>{opt.label}</span>
            </div>
          ))}
          {(field.options?.length || 0) > 3 && (
            <span className="text-[10px] text-slate-400 italic">
              +{(field.options?.length || 0) - 3} opción(es) más
            </span>
          )}
        </div>
      );

    case 'rating':
      return (
        <div className="flex items-center gap-1 text-amber-400 py-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} className="w-5 h-5 fill-amber-300 text-amber-400 opacity-60" />
          ))}
          <span className="text-xs text-slate-400 ml-2">(1 a 5 estrellas)</span>
        </div>
      );

    case 'nps':
      return (
        <div className="grid grid-cols-11 gap-1 py-1">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <span
              key={n}
              className="text-[10px] font-semibold text-slate-500 bg-slate-100 rounded text-center py-1 border border-slate-200"
            >
              {n}
            </span>
          ))}
        </div>
      );

    case 'file':
      return (
        <div className="flex items-center gap-2 p-3 border border-dashed border-slate-300 rounded-lg bg-slate-50 text-slate-400 text-xs justify-center">
          <Upload className="w-4 h-4" />
          <span>Zona para arrastrar o subir archivos</span>
        </div>
      );

    case 'signature':
      return (
        <div className="h-16 border border-dashed border-slate-300 rounded-lg bg-slate-50 flex items-center justify-center text-xs text-slate-400 gap-2">
          <PenTool className="w-4 h-4" />
          <span>Área interactiva para firma digital</span>
        </div>
      );

    case 'terms':
      return (
        <div className="flex items-start gap-2 text-xs text-slate-600">
          <CheckSquare className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
          <span className="line-clamp-2">{field.termsText || field.label}</span>
        </div>
      );

    default:
      return null;
  }
}
