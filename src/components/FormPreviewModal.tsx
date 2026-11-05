import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Monitor, 
  Tablet, 
  Smartphone, 
  CheckCircle2, 
  Star, 
  Upload, 
  Eraser, 
  AlertCircle,
  FileCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Form, FormField, FormSubmission } from '../types';

interface FormPreviewModalProps {
  form: Form;
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: (submission: FormSubmission) => void;
}

export const FormPreviewModal: React.FC<FormPreviewModalProps> = ({
  form,
  isOpen,
  onClose,
  onSubmitSuccess,
}) => {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lastSubmissionId, setLastSubmissionId] = useState<string>('');

  // Canvas signature state
  const sigCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({});
      setErrors({});
      setIsSubmitted(false);
      setHasSignature(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Conditional Logic evaluator: returns true if the field should be visible
  const isFieldVisible = (field: FormField): boolean => {
    if (!field.conditionalRules || field.conditionalRules.length === 0) {
      return true;
    }

    for (const rule of field.conditionalRules) {
      const parentVal = formData[rule.fieldId];
      let conditionMet = false;

      switch (rule.operator) {
        case 'equals':
          conditionMet = String(parentVal ?? '') === String(rule.value);
          break;
        case 'not_equals':
          conditionMet = String(parentVal ?? '') !== String(rule.value);
          break;
        case 'contains':
          conditionMet = String(parentVal ?? '').toLowerCase().includes(String(rule.value).toLowerCase());
          break;
        case 'is_empty':
          conditionMet = parentVal === undefined || parentVal === '' || parentVal === null;
          break;
        case 'is_not_empty':
          conditionMet = parentVal !== undefined && parentVal !== '' && parentVal !== null;
          break;
      }

      if (rule.action === 'show' && !conditionMet) return false;
      if (rule.action === 'hide' && conditionMet) return false;
    }

    return true;
  };

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[fieldId];
        return copy;
      });
    }
  };

  // Signature Canvas Helpers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    setIsDrawing(true);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1e293b';
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = sigCanvasRef.current;
    if (canvas && hasSignature) {
      const dataUrl = canvas.toDataURL();
      // Find signature field if any
      const sigField = form.fields.find((f) => f.type === 'signature');
      if (sigField) {
        handleInputChange(sigField.id, dataUrl);
      }
    }
  };

  const clearSignature = () => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    const sigField = form.fields.find((f) => f.type === 'signature');
    if (sigField) {
      handleInputChange(sigField.id, null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate fields
    const newErrors: Record<string, string> = {};

    form.fields.forEach((field) => {
      if (!isFieldVisible(field)) return;
      if (field.type === 'heading' || field.type === 'divider') return;

      const val = formData[field.id];

      if (field.required) {
        if (val === undefined || val === null || val === '' || (Array.isArray(val) && val.length === 0)) {
          newErrors[field.id] = 'Este campo es obligatorio.';
          return;
        }
      }

      if (field.type === 'email' && val) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(String(val))) {
          newErrors[field.id] = 'Ingrese una dirección de correo válida.';
        }
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Success! Fire celebration confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    const subId = `sub-${Math.floor(1000 + Math.random() * 9000)}`;
    setLastSubmissionId(subId);

    const newSubmission: FormSubmission = {
      id: subId,
      formId: form.id,
      formTitle: form.title,
      data: { ...formData },
      createdAt: new Date().toISOString(),
      status: 'new',
      ipAddress: '190.85.120.4',
    };

    if (onSubmitSuccess) {
      onSubmitSuccess(newSubmission);
    }

    setIsSubmitted(true);
  };

  const renderFieldInput = (field: FormField) => {
    const errorMsg = errors[field.id];

    switch (field.type) {
      case 'heading':
        return (
          <div className="pt-2 pb-1">
            <h3 className="text-xl font-bold text-slate-800">{field.label}</h3>
            {field.helpText && <p className="text-sm text-slate-500 mt-1">{field.helpText}</p>}
          </div>
        );

      case 'divider':
        return <hr className="my-3 border-slate-200" />;

      case 'text':
      case 'phone':
        return (
          <input
            type={field.type === 'phone' ? 'tel' : 'text'}
            placeholder={field.placeholder || ''}
            value={formData[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 ${
              errorMsg
                ? 'border-red-400 focus:ring-red-200'
                : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
            }`}
          />
        );

      case 'email':
        return (
          <input
            type="email"
            placeholder={field.placeholder || 'nombre@ejemplo.com'}
            value={formData[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 ${
              errorMsg
                ? 'border-red-400 focus:ring-red-200'
                : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
            }`}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            min={field.min}
            max={field.max}
            step={field.step || 1}
            placeholder={field.placeholder || '0'}
            value={formData[field.id] ?? ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 ${
              errorMsg
                ? 'border-red-400 focus:ring-red-200'
                : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
            }`}
          />
        );

      case 'date':
        return (
          <input
            type="date"
            value={formData[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 ${
              errorMsg
                ? 'border-red-400 focus:ring-red-200'
                : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
            }`}
          />
        );

      case 'textarea':
        return (
          <textarea
            rows={3}
            placeholder={field.placeholder || ''}
            value={formData[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 ${
              errorMsg
                ? 'border-red-400 focus:ring-red-200'
                : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
            }`}
          />
        );

      case 'select':
        return (
          <select
            value={formData[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-white transition-all focus:outline-none focus:ring-2 ${
              errorMsg
                ? 'border-red-400 focus:ring-red-200'
                : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
            }`}
          >
            <option value="">-- Seleccionar una opción --</option>
            {field.options?.map((opt) => (
              <option key={opt.id} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="space-y-2 pt-1">
            {field.options?.map((opt) => (
              <label
                key={opt.id}
                className="flex items-center gap-2.5 p-2 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer text-sm"
              >
                <input
                  type="radio"
                  name={field.id}
                  value={opt.value}
                  checked={formData[field.id] === opt.value}
                  onChange={() => handleInputChange(field.id, opt.value)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-slate-700">{opt.label}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        const checkedList = (formData[field.id] as string[]) || [];
        const toggleCheckbox = (val: string) => {
          const exists = checkedList.includes(val);
          const updated = exists ? checkedList.filter((v) => v !== val) : [...checkedList, val];
          handleInputChange(field.id, updated);
        };

        return (
          <div className="space-y-2 pt-1">
            {field.options?.map((opt) => (
              <label
                key={opt.id}
                className="flex items-center gap-2.5 p-2 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer text-sm"
              >
                <input
                  type="checkbox"
                  checked={checkedList.includes(opt.value)}
                  onChange={() => toggleCheckbox(opt.value)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-slate-700">{opt.label}</span>
              </label>
            ))}
          </div>
        );

      case 'rating':
        const ratingVal = formData[field.id] || 0;
        return (
          <div className="flex items-center gap-1.5 py-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleInputChange(field.id, star)}
                className="p-1 hover:scale-110 transition-transform"
              >
                <Star
                  className={`w-7 h-7 ${
                    star <= ratingVal
                      ? 'fill-amber-400 text-amber-500'
                      : 'text-slate-300 hover:text-amber-300'
                  }`}
                />
              </button>
            ))}
            <span className="text-xs font-semibold text-slate-500 ml-2">
              {ratingVal ? `${ratingVal} / 5` : 'Seleccione una calificación'}
            </span>
          </div>
        );

      case 'nps':
        const npsVal = formData[field.id];
        return (
          <div className="space-y-2 pt-1">
            <div className="grid grid-cols-11 gap-1">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                const isSelected = npsVal === num;
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleInputChange(field.id, num)}
                    className={`h-10 text-xs font-bold rounded-lg transition-all border ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm scale-105'
                        : 'bg-slate-50 hover:bg-blue-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {num}
                  </button>
                );
              })}
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 font-medium px-1">
              <span>0 = Nada probable</span>
              <span>10 = Totalmente probable</span>
            </div>
          </div>
        );

      case 'file':
        const fileAttached = formData[field.id];
        return (
          <div className="space-y-2">
            <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50/50 hover:bg-blue-50/20 rounded-xl cursor-pointer transition-colors">
              <Upload className="w-6 h-6 text-slate-400 mb-1.5" />
              <span className="text-xs font-semibold text-blue-600">
                Haz clic para subir un archivo o arrástralo aquí
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5">PDF, DOCX, PNG o JPG (máx. 10MB)</span>
              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleInputChange(field.id, e.target.files[0].name);
                  }
                }}
              />
            </label>
            {fileAttached && (
              <div className="flex items-center gap-2 p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs">
                <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium truncate">{fileAttached}</span>
              </div>
            )}
          </div>
        );

      case 'signature':
        return (
          <div className="space-y-2">
            <div className="border border-slate-300 rounded-xl overflow-hidden bg-white">
              <canvas
                ref={sigCanvasRef}
                width={450}
                height={120}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-28 bg-white cursor-crosshair touch-none"
              />
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 italic">Dibuje su firma con el cursor</span>
              <button
                type="button"
                onClick={clearSignature}
                className="flex items-center gap-1 text-slate-500 hover:text-red-600 px-2 py-1 rounded hover:bg-slate-100"
              >
                <Eraser className="w-3.5 h-3.5" />
                Limpiar firma
              </button>
            </div>
          </div>
        );

      case 'terms':
        return (
          <label className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-200 bg-slate-50/50 cursor-pointer text-xs leading-relaxed">
            <input
              type="checkbox"
              checked={Boolean(formData[field.id])}
              onChange={(e) => handleInputChange(field.id, e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mt-0.5"
            />
            <span className="text-slate-700">
              {field.termsText || 'Acepto los términos y condiciones de este formulario.'}
            </span>
          </label>
        );

      default:
        return null;
    }
  };

  const getContainerWidthClass = () => {
    switch (deviceMode) {
      case 'mobile':
        return 'max-w-sm';
      case 'tablet':
        return 'max-w-xl';
      default:
        return 'max-w-2xl';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-100 rounded-2xl shadow-2xl border border-slate-300 w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Top Bar */}
        <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-900 text-sm">Vista Previa Interactiva</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
              Simulador de Usuario
            </span>
          </div>

          {/* Viewport device toggles */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`p-1.5 rounded text-xs flex items-center gap-1 font-medium transition-colors ${
                deviceMode === 'desktop'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Escritorio"
            >
              <Monitor className="w-4 h-4" />
              <span className="hidden sm:inline">Desktop</span>
            </button>
            <button
              onClick={() => setDeviceMode('tablet')}
              className={`p-1.5 rounded text-xs flex items-center gap-1 font-medium transition-colors ${
                deviceMode === 'tablet'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Tableta"
            >
              <Tablet className="w-4 h-4" />
              <span className="hidden sm:inline">Tablet</span>
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`p-1.5 rounded text-xs flex items-center gap-1 font-medium transition-colors ${
                deviceMode === 'mobile'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Móvil"
            >
              <Smartphone className="w-4 h-4" />
              <span className="hidden sm:inline">Móvil</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center items-start">
          <div
            className={`w-full ${getContainerWidthClass()} transition-all duration-200 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 my-auto`}
          >
            {isSubmitted ? (
              <div className="text-center py-12 space-y-4 animate-in fade-in duration-300">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {form.theme.thankYouTitle || '¡Formulario Enviado con Éxito!'}
                </h2>
                <p className="text-slate-600 max-w-md mx-auto text-sm">
                  {form.theme.thankYouMessage ||
                    'Hemos registrado tus respuestas en el sistema de manera segura.'}
                </p>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 inline-block text-xs text-slate-500">
                  ID de Envío generado: <strong className="text-slate-800">#{lastSubmissionId}</strong>
                </div>

                <div className="pt-4 flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({});
                      setErrors({});
                    }}
                    className="px-4 py-2 border border-slate-300 hover:bg-slate-50 rounded-lg text-sm font-medium text-slate-700"
                  >
                    Enviar otra respuesta
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
                  >
                    Cerrar simulador
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Form Header */}
                <div className="border-b border-slate-200 pb-5">
                  <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    {form.title}
                  </h1>
                  {form.description && (
                    <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
                      {form.description}
                    </p>
                  )}
                </div>

                {/* Form Fields Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {form.fields.map((field) => {
                    if (!isFieldVisible(field)) return null;

                    const widthClass =
                      field.width === 'half'
                        ? 'col-span-1'
                        : field.width === 'third'
                        ? 'col-span-1 sm:col-span-1'
                        : 'col-span-1 sm:col-span-2';

                    const isDecorative = field.type === 'heading' || field.type === 'divider';
                    const hasError = errors[field.id];

                    return (
                      <div key={field.id} className={`${widthClass} space-y-1.5`}>
                        {!isDecorative && (
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-semibold text-slate-800">
                              {field.label}
                              {field.required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                          </div>
                        )}

                        {field.helpText && !isDecorative && (
                          <p className="text-xs text-slate-400">{field.helpText}</p>
                        )}

                        {renderFieldInput(field)}

                        {hasError && (
                          <p className="text-xs text-red-500 flex items-center gap-1 mt-1 font-medium">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            {hasError}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Submit Action */}
                <div className="pt-4 border-t border-slate-200 flex justify-end">
                  <button
                    type="submit"
                    style={{ backgroundColor: form.theme.primaryColor || '#2563eb' }}
                    className="px-6 py-2.5 text-white font-semibold rounded-xl text-sm shadow-sm hover:opacity-95 active:scale-98 transition-all"
                  >
                    {form.theme.submitButtonText || 'Enviar Formulario'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
