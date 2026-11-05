import React, { useState } from 'react';
import { 
  Database, 
  Code2, 
  Copy, 
  Check, 
  Download, 
  Server, 
  FileSpreadsheet, 
  Layers,
  Globe,
  Github,
  CheckCircle2,
  ExternalLink,
  Cpu,
  ShieldAlert
} from 'lucide-react';
import { 
  MYSQL_SCHEMA_SQL, 
  LARAVEL_MIGRATION_PHP, 
  LARAVEL_CONTROLLER_PHP, 
  VUE_COMPONENT_VUE 
} from '../utils/laravelGenerator';

export const LaravelMySQLView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'mysql' | 'migration' | 'controller' | 'vue' | 'deployment'>('mysql');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header Info Banner - Clean Executive Solid Slate */}
      <div className="bg-slate-900 rounded-xl p-6 text-white border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-xs text-slate-300 font-semibold">
              <Server className="w-3.5 h-3.5" />
              <span>Arquitectura de Producción Laravel 13 & MySQL 8.0</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Generador de Base de Datos MySQL y Backend Laravel 13
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
              Estructura normalizada y optimizada con soporte para RBAC (Roles y Permisos dinámicos), consultas analíticas complejas, exportación a Excel y PDF con librerías de código abierto y guías de despliegue gratuito.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() =>
                downloadFile(
                  MYSQL_SCHEMA_SQL,
                  'formcraft_mysql_schema.sql',
                  'application/sql'
                )
              }
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white text-slate-900 hover:bg-slate-100 rounded-md text-xs font-semibold transition-colors border border-white"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar .SQL</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto bg-white rounded-t-xl px-4 pt-1">
        <button
          onClick={() => setActiveTab('mysql')}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'mysql'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Database className="w-4 h-4" />
          1. Esquema MySQL DDL (RBAC + Índices)
        </button>

        <button
          onClick={() => setActiveTab('migration')}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'migration'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Code2 className="w-4 h-4" />
          2. Migración Laravel 13 (Blueprint)
        </button>

        <button
          onClick={() => setActiveTab('controller')}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'controller'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          3. Controlador Exportación Excel & PDF
        </button>

        <button
          onClick={() => setActiveTab('vue')}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'vue'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          4. Componente Vue 3 / Livewire
        </button>

        <button
          onClick={() => setActiveTab('deployment')}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'deployment'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Globe className="w-4 h-4" />
          5. Hosting Gratuito y Despliegue en GitHub
        </button>
      </div>

      {/* Code Container / Guide Container */}
      {activeTab !== 'deployment' ? (
        <div className="bg-slate-950 rounded-b-xl border border-slate-800 overflow-hidden">
          {/* Code Header Bar */}
          <div className="bg-slate-900 px-5 py-2.5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
              <span className="text-xs text-slate-400 font-mono ml-2">
                {activeTab === 'mysql'
                  ? 'database/schema.sql'
                  : activeTab === 'migration'
                  ? 'database/migrations/2026_01_01_000001_create_forms_and_submissions_tables.php'
                  : activeTab === 'controller'
                  ? 'app/Http/Controllers/FormSubmissionController.php'
                  : 'resources/js/Components/FormBuilder.vue'}
              </span>
            </div>

            <button
              onClick={() => {
                const currentContent =
                  activeTab === 'mysql'
                    ? MYSQL_SCHEMA_SQL
                    : activeTab === 'migration'
                    ? LARAVEL_MIGRATION_PHP
                    : activeTab === 'controller'
                    ? LARAVEL_CONTROLLER_PHP
                    : VUE_COMPONENT_VUE;
                copyToClipboard(currentContent, activeTab);
              }}
              className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded text-xs font-mono transition-colors border border-slate-700"
            >
              {copiedKey === activeTab ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar código</span>
                </>
              )}
            </button>
          </div>

          {/* Code Content */}
          <div className="p-5 max-h-[600px] overflow-y-auto font-mono text-xs text-slate-300 leading-relaxed">
            <pre className="whitespace-pre-wrap">
              {activeTab === 'mysql' && MYSQL_SCHEMA_SQL}
              {activeTab === 'migration' && LARAVEL_MIGRATION_PHP}
              {activeTab === 'controller' && LARAVEL_CONTROLLER_PHP}
              {activeTab === 'vue' && VUE_COMPONENT_VUE}
            </pre>
          </div>
        </div>
      ) : (
        /* Deployment & Hosting Guide Tab */
        <div className="bg-white rounded-b-xl border border-slate-200 p-6 sm:p-8 space-y-8">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Guía de Publicación Gratuita y Ejecución desde GitHub
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Respuestas directas y pasos prácticos para publicar y ejecutar esta aplicación a costo $0.
            </p>
          </div>

          {/* Pregunta 1: En qué sitio puedo publicar gratis la aplicación */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
              <Globe className="w-4 h-4 text-slate-700" />
              <span>1. ¿En qué plataformas puedo publicar GRATIS la aplicación?</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Dado que la arquitectura consta de un <strong>Frontend</strong> (interfaz interactiva) y un <strong>Backend Laravel 13 con MySQL</strong>, las mejores opciones gratuitas recomendadas son:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Opción A: Frontend Estático */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Para el Frontend (SPA / Vue / React)
                </span>
                <h4 className="font-bold text-slate-900 text-sm">Vercel / Netlify / Cloudflare Pages</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  • <strong>Gratis al 100%</strong> sin límite de expiración.<br />
                  • Conexión directa con tu repositorio de GitHub.<br />
                  • Despliegue automático con cada <code className="bg-slate-200 px-1 rounded text-[11px]">git push</code>.<br />
                  • Certificado SSL (HTTPS) y dominio gratuito (.vercel.app / .netlify.app).
                </p>
              </div>

              {/* Opción B: Backend Laravel */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Para el Backend Laravel 13
                </span>
                <h4 className="font-bold text-slate-900 text-sm">Render.com / Fly.io / Railway</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  • <strong>Render.com</strong>: Ofrece servicios web gratuitos para desplegar aplicaciones Docker o PHP.<br />
                  • <strong>Fly.io</strong>: Permite hasta 3 micro-instancias en contenedores Docker de forma gratuita.<br />
                  • <strong>Railway.app</strong>: Crédito de prueba inicial para correr Laravel + Workers.
                </p>
              </div>

              {/* Opción C: Base de Datos MySQL */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Base de Datos MySQL Gratis
                </span>
                <h4 className="font-bold text-slate-900 text-sm">Aiven / TiDB Cloud / AlwaysData</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  • <strong>Aiven.io</strong>: Ofrece base de datos MySQL o PostgreSQL gratuita administrada.<br />
                  • <strong>TiDB Cloud</strong>: Totalmente compatible con MySQL 8.0, 5 GB de almacenamiento gratuito de por vida.<br />
                  • <strong>Clever Cloud</strong>: MySQL gratuito de 20MB para proyectos académicos o pruebas.
                </p>
              </div>
            </div>
          </div>

          {/* Pregunta 2: Se puede ejecutar desde GitHub? */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
              <Github className="w-4 h-4 text-slate-700" />
              <span>2. ¿Se puede ejecutar directamente desde GitHub?</span>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-slate-900" />
                  A. Sí, mediante GitHub Codespaces (Recomendado para desarrollo gratuito en la nube)
                </h4>
                <p>
                  GitHub ofrece <strong>GitHub Codespaces</strong>, que proporciona <strong>60 horas gratis al mes</strong> en una máquina virtual completa en la nube (con Linux, PHP 8.3, Composer, Node.js y MySQL).
                </p>
                <div className="bg-slate-900 text-slate-200 p-3 rounded font-mono text-xs space-y-1">
                  <div>1. En tu repositorio en GitHub, presiona la tecla <strong>&quot;.&quot;</strong> o haz clic en <strong>Code &gt; Codespaces &gt; Create codespace on main</strong>.</div>
                  <div>2. En la terminal integrada, ejecuta: <code className="text-white">composer install &amp;&amp; npm install &amp;&amp; php artisan serve</code></div>
                  <div>3. Codespaces te dará una URL web pública y segura para interactuar con tu aplicación en tiempo real.</div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-slate-900" />
                  B. ¿Se puede alojar en GitHub Pages?
                </h4>
                <p>
                  <strong>GitHub Pages solo aloja archivos estáticos (HTML, CSS, JavaScript)</strong>. Por tanto:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-2">
                  <li>
                    El frontend actual (Vite / Vue / React) <strong>SÍ se puede publicar gratis en GitHub Pages</strong> generando la carpeta de distribución con <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">npm run build</code>.
                  </li>
                  <li>
                    Sin embargo, el servidor PHP Laravel y la base de datos MySQL <strong>NO pueden ejecutarse directamente dentro del servidor estático de GitHub Pages</strong>; el backend debe estar alojado en Render, Fly.io o un contenedor, al cual el frontend se conectará mediante API REST.
                  </li>
                </ul>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-slate-900" />
                  C. Despliegue Automatizado con GitHub Actions (CI/CD)
                </h4>
                <p>
                  Puedes configurar un archivo <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">.github/workflows/deploy.yml</code> para que cada vez que hagas <code className="font-mono">git push</code>, GitHub Actions ejecute los tests, compile los assets y envíe el código automáticamente a Vercel o a tu servidor VPS sin intervención manual.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Architecture Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <h4 className="font-bold text-slate-900 text-sm mb-1">Rendimiento en MySQL 8.0</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Utiliza una estructura de valores EAV optimizada con columnas tipadas (<code className="font-mono text-slate-800">value_number</code>, <code className="font-mono text-slate-800">value_text</code>, <code className="font-mono text-slate-800">value_json</code>) e índices B-Tree compuestos que aceleran consultas analíticas en milisegundos.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <h4 className="font-bold text-slate-900 text-sm mb-1">Exportación Automática</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Integrado con <code className="font-mono text-slate-800">maatwebsite/excel</code> y <code className="font-mono text-slate-800">barryvdh/laravel-dompdf</code> para descargas automáticas tanto en la web como programadas mediante jobs asíncronos.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <h4 className="font-bold text-slate-900 text-sm mb-1">Control de Acceso Dinámico (RBAC)</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Estructura relacional completa con tablas <code className="font-mono text-slate-800">roles</code>, <code className="font-mono text-slate-800">permissions</code> y <code className="font-mono text-slate-800">role_has_permissions</code> para gestionar permisos granulares por cada acción en Laravel 13.
          </p>
        </div>
      </div>
    </div>
  );
};
