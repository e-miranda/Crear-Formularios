import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  ExternalLink, 
  Code, 
  Link as LinkIcon, 
  QrCode 
} from 'lucide-react';
import { Form } from '../types';

interface ShareEmbedModalProps {
  form: Form;
  isOpen: boolean;
  onClose: () => void;
  onOpenPreview: () => void;
}

export const ShareEmbedModal: React.FC<ShareEmbedModalProps> = ({
  form,
  isOpen,
  onClose,
  onOpenPreview,
}) => {
  if (!isOpen) return null;

  const [copied, setCopied] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'link' | 'embed' | 'qr'>('link');

  const formUrl = `${window.location.origin}/form/${form.id}`;
  const iframeCode = `<iframe src="${formUrl}" width="100%" height="700px" frameborder="0" marginheight="0" marginwidth="0">Cargando formulario...</iframe>`;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">Publicar y Compartir Formulario</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex border-b border-slate-100 px-6 bg-slate-50">
          <button
            onClick={() => setActiveTab('link')}
            className={`py-2.5 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 ${
              activeTab === 'link'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" /> Enlace Directo
          </button>
          <button
            onClick={() => setActiveTab('embed')}
            className={`py-2.5 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 ${
              activeTab === 'embed'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Code className="w-3.5 h-3.5" /> Incrustar (iFrame)
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            className={`py-2.5 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 ${
              activeTab === 'qr'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" /> Código QR
          </button>
        </div>

        <div className="p-6 space-y-4">
          {activeTab === 'link' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 leading-relaxed">
                Comparte este enlace para que cualquier usuario pueda responder tu formulario desde cualquier dispositivo móvil o computadora.
              </p>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={formUrl}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 text-slate-700 font-mono"
                />
                <button
                  type="button"
                  onClick={() => copyToClipboard(formUrl, 'link')}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1"
                >
                  {copied === 'link' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied === 'link' ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenPreview();
                  }}
                  className="w-full py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Probar en Pantalla Completa
                </button>
              </div>
            </div>
          )}

          {activeTab === 'embed' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 leading-relaxed">
                Copia este fragmento HTML para incrustar el formulario en sitios WordPress, Laravel Blade, React o cualquier CMS web:
              </p>

              <textarea
                readOnly
                rows={4}
                value={iframeCode}
                className="w-full p-3 border border-slate-300 rounded-lg text-xs bg-slate-900 text-emerald-400 font-mono"
              />

              <button
                type="button"
                onClick={() => copyToClipboard(iframeCode, 'embed')}
                className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5"
              >
                {copied === 'embed' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied === 'embed' ? 'Código iFrame Copiado' : 'Copiar Código de Inserción'}</span>
              </button>
            </div>
          )}

          {activeTab === 'qr' && (
            <div className="flex flex-col items-center justify-center py-4 space-y-3">
              <div className="p-4 bg-white border-2 border-slate-200 rounded-2xl shadow-sm">
                {/* Visual SVG QR Code placeholder */}
                <svg className="w-36 h-36" viewBox="0 0 100 100" fill="none">
                  <rect width="100" height="100" fill="white" />
                  <rect x="10" y="10" width="25" height="25" fill="#1e293b" />
                  <rect x="15" y="15" width="15" height="15" fill="white" />
                  <rect x="18" y="18" width="9" height="9" fill="#2563eb" />
                  <rect x="65" y="10" width="25" height="25" fill="#1e293b" />
                  <rect x="70" y="15" width="15" height="15" fill="white" />
                  <rect x="73" y="18" width="9" height="9" fill="#2563eb" />
                  <rect x="10" y="65" width="25" height="25" fill="#1e293b" />
                  <rect x="15" y="70" width="15" height="15" fill="white" />
                  <rect x="18" y="73" width="9" height="9" fill="#2563eb" />
                  <rect x="42" y="15" width="6" height="6" fill="#1e293b" />
                  <rect x="52" y="25" width="6" height="6" fill="#1e293b" />
                  <rect x="42" y="45" width="16" height="16" fill="#2563eb" />
                  <rect x="65" y="65" width="12" height="12" fill="#1e293b" />
                  <rect x="80" y="78" width="10" height="12" fill="#1e293b" />
                </svg>
              </div>
              <p className="text-xs text-slate-500 font-medium text-center">
                Escanea con la cámara de tu smartphone para responder el formulario al instante.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
