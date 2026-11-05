import React from 'react';
import { Palette, Check, Type, Sparkles } from 'lucide-react';
import { FormTheme } from '../../types';

interface FormThemeSettingsProps {
  theme: FormTheme;
  onChangeTheme: (updatedTheme: FormTheme) => void;
}

const COLOR_PRESETS = [
  { label: 'Azul Jotform', hex: '#2563eb' },
  { label: 'Esmeralda Fresco', hex: '#059669' },
  { label: 'Violeta Moderno', hex: '#7c3aed' },
  { label: 'Ámbar Cálido', hex: '#d97706' },
  { label: 'Rosa Intenso', hex: '#db2777' },
  { label: 'Pizarra Oscuro', hex: '#1e293b' },
  { label: 'Cian Tecnológico', hex: '#0284c7' },
];

export const FormThemeSettings: React.FC<FormThemeSettingsProps> = ({
  theme,
  onChangeTheme,
}) => {
  const updateProp = <K extends keyof FormTheme>(key: K, value: FormTheme[K]) => {
    onChangeTheme({ ...theme, [key]: value });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
        <Palette className="w-5 h-5 text-blue-600" />
        <h3 className="font-bold text-slate-900 text-sm">Personalización del Diseño</h3>
      </div>

      {/* Primary Color Palette */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Color de Acento Principal
        </label>
        <div className="grid grid-cols-4 gap-2">
          {COLOR_PRESETS.map((preset) => {
            const isSelected = theme.primaryColor.toLowerCase() === preset.hex.toLowerCase();
            return (
              <button
                key={preset.hex}
                type="button"
                onClick={() => updateProp('primaryColor', preset.hex)}
                className="group relative flex flex-col items-center gap-1 p-2 rounded-xl border border-slate-200 hover:border-slate-300 transition-all text-center"
              >
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white shadow-xs"
                  style={{ backgroundColor: preset.hex }}
                >
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                </span>
                <span className="text-[10px] text-slate-600 font-medium truncate w-full">
                  {preset.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-2.5 flex items-center gap-2">
          <input
            type="color"
            value={theme.primaryColor}
            onChange={(e) => updateProp('primaryColor', e.target.value)}
            className="w-8 h-8 rounded-lg border border-slate-300 cursor-pointer p-0.5"
          />
          <span className="text-xs text-slate-500 font-mono">{theme.primaryColor}</span>
        </div>
      </div>

      {/* Border Radius */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Radio de Bordes de Controles
        </label>
        <div className="grid grid-cols-4 gap-1.5 bg-slate-100 p-1 rounded-xl">
          {[
            { id: 'none', label: 'Recto' },
            { id: 'sm', label: 'Suave' },
            { id: 'md', label: 'Medio' },
            { id: 'lg', label: 'Redondo' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => updateProp('borderRadius', item.id as any)}
              className={`py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                theme.borderRadius === item.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Submit Button Customization */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Texto del Botón de Envío
        </label>
        <input
          type="text"
          value={theme.submitButtonText}
          onChange={(e) => updateProp('submitButtonText', e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Thank you screen customization */}
      <div className="space-y-3 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Pantalla de Agradecimiento
          </h4>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
            Título de Confirmación
          </label>
          <input
            type="text"
            value={theme.thankYouTitle}
            onChange={(e) => updateProp('thankYouTitle', e.target.value)}
            className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
            Mensaje Descriptivo
          </label>
          <textarea
            rows={2}
            value={theme.thankYouMessage}
            onChange={(e) => updateProp('thankYouMessage', e.target.value)}
            className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};
