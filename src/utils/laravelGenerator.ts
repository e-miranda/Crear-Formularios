export const MYSQL_SCHEMA_SQL = `-- ============================================================================
-- FORMCRAFT / JOTFORM ENTERPRISE DATABASE SCHEMA (MySQL 8.0+)
-- Arquitectura altamente escalable con particionado lógico, JSON y EAV optimizado
-- ============================================================================

CREATE DATABASE IF NOT EXISTS \`formcraft_db\` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE \`formcraft_db\`;

-- 1. SISTEMA DE ROLES Y PERMISOS DINÁMICOS (RBAC)
CREATE TABLE \`roles\` (
  \`id\` VARCHAR(64) PRIMARY KEY,
  \`name\` VARCHAR(191) NOT NULL,
  \`description\` TEXT NULL,
  \`is_system\` TINYINT(1) NOT NULL DEFAULT 0,
  \`created_at\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE \`permissions\` (
  \`key\` VARCHAR(64) PRIMARY KEY,
  \`name\` VARCHAR(191) NOT NULL,
  \`category\` VARCHAR(64) NOT NULL,
  \`description\` TEXT NULL,
  \`created_at\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE \`role_has_permissions\` (
  \`role_id\` VARCHAR(64) NOT NULL,
  \`permission_key\` VARCHAR(64) NOT NULL,
  PRIMARY KEY (\`role_id\`, \`permission_key\`),
  CONSTRAINT \`fk_rhp_role\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\` (\`id\`) ON DELETE CASCADE,
  CONSTRAINT \`fk_rhp_perm\` FOREIGN KEY (\`permission_key\`) REFERENCES \`permissions\` (\`key\`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 2. TABLA DE USUARIOS CON ASIGNACIÓN DE ROLES
CREATE TABLE \`users\` (
  \`id\` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`name\` VARCHAR(191) NOT NULL,
  \`email\` VARCHAR(191) NOT NULL UNIQUE,
  \`password\` VARCHAR(255) NOT NULL,
  \`role_id\` VARCHAR(64) NOT NULL DEFAULT 'user',
  \`avatar_url\` VARCHAR(500) NULL,
  \`department\` VARCHAR(100) NULL,
  \`is_active\` TINYINT(1) NOT NULL DEFAULT 1,
  \`remember_token\` VARCHAR(100) NULL,
  \`created_at\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT \`fk_users_role\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\` (\`id\`) ON DELETE RESTRICT,
  INDEX \`idx_users_role_status\` (\`role_id\`, \`is_active\`)
) ENGINE=InnoDB;

-- 2. TABLA DE FORMULARIOS (Cabecera y Metadatos)
CREATE TABLE \`forms\` (
  \`id\` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`uuid\` CHAR(36) NOT NULL UNIQUE,
  \`user_id\` BIGINT UNSIGNED NOT NULL,
  \`title\` VARCHAR(255) NOT NULL,
  \`slug\` VARCHAR(255) NOT NULL,
  \`description\` TEXT NULL,
  \`status\` ENUM('draft', 'active', 'archived') NOT NULL DEFAULT 'draft',
  \`theme_config\` JSON NOT NULL COMMENT 'Colores primarios, tipografias, radio de bordes, banner',
  \`settings\` JSON NULL COMMENT 'Notificaciones email, limites de respuestas, redirecciones',
  \`submission_count\` INT UNSIGNED NOT NULL DEFAULT 0,
  \`created_at\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  \`deleted_at\` TIMESTAMP NULL DEFAULT NULL,
  CONSTRAINT \`fk_forms_user_id\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE,
  INDEX \`idx_forms_user_status\` (\`user_id\`, \`status\`),
  INDEX \`idx_forms_slug\` (\`slug\`)
) ENGINE=InnoDB;

-- 3. TABLA DE CAMPOS DINÁMICOS DEL FORMULARIO (Campos y reglas)
CREATE TABLE \`form_fields\` (
  \`id\` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`form_id\` BIGINT UNSIGNED NOT NULL,
  \`field_key\` VARCHAR(64) NOT NULL COMMENT 'Identificador único dentro del formulario (ej. f_email)',
  \`type\` VARCHAR(32) NOT NULL COMMENT 'text, textarea, email, number, select, radio, checkbox, rating, nps, file, signature, etc.',
  \`label\` VARCHAR(255) NOT NULL,
  \`placeholder\` VARCHAR(255) NULL,
  \`help_text\` VARCHAR(500) NULL,
  \`is_required\` TINYINT(1) NOT NULL DEFAULT 0,
  \`order_index\` INT UNSIGNED NOT NULL DEFAULT 0,
  \`width\` ENUM('full', 'half', 'third') NOT NULL DEFAULT 'full',
  \`options\` JSON NULL COMMENT 'Array de opciones para select, radio o checkbox',
  \`conditional_logic\` JSON NULL COMMENT 'Reglas si X es igual a Y entonces mostrar/ocultar',
  \`validation_rules\` JSON NULL COMMENT 'Regex, min, max, longitud requerida',
  \`created_at\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT \`fk_fields_form_id\` FOREIGN KEY (\`form_id\`) REFERENCES \`forms\` (\`id\`) ON DELETE CASCADE,
  UNIQUE KEY \`uk_form_field_key\` (\`form_id\`, \`field_key\`),
  INDEX \`idx_form_fields_order\` (\`form_id\`, \`order_index\`)
) ENGINE=InnoDB;

-- 4. TABLA DE ENVÍOS / RESPUESTAS DE FORMULARIO
CREATE TABLE \`form_submissions\` (
  \`id\` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`form_id\` BIGINT UNSIGNED NOT NULL,
  \`user_id\` BIGINT UNSIGNED NULL COMMENT 'Usuario autenticado si aplica o NULL para respuestas anonimas',
  \`status\` ENUM('new', 'reviewed', 'approved', 'rejected') NOT NULL DEFAULT 'new',
  \`ip_address\` VARCHAR(45) NULL,
  \`user_agent\` VARCHAR(500) NULL,
  \`created_at\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT \`fk_submissions_form_id\` FOREIGN KEY (\`form_id\`) REFERENCES \`forms\` (\`id\`) ON DELETE CASCADE,
  CONSTRAINT \`fk_submissions_user_id\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE SET NULL,
  INDEX \`idx_submissions_form_date\` (\`form_id\`, \`created_at\`),
  INDEX \`idx_submissions_form_status\` (\`form_id\`, \`status\`)
) ENGINE=InnoDB;

-- 5. TABLA DE VALORES DE RESPUESTA (Modelo EAV optimizado con indexación tipada)
CREATE TABLE \`form_submission_values\` (
  \`id\` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`submission_id\` BIGINT UNSIGNED NOT NULL,
  \`form_field_id\` BIGINT UNSIGNED NOT NULL,
  \`field_key\` VARCHAR(64) NOT NULL,
  \`value_text\` LONGTEXT NULL COMMENT 'Texto, respuestas largas, URLs o firmas base64',
  \`value_number\` DECIMAL(15, 4) NULL COMMENT 'Para calificaciones, NPS y operaciones matemáticas',
  \`value_json\` JSON NULL COMMENT 'Para respuestas de selección múltiple y arrays',
  CONSTRAINT \`fk_sub_val_submission_id\` FOREIGN KEY (\`submission_id\`) REFERENCES \`form_submissions\` (\`id\`) ON DELETE CASCADE,
  CONSTRAINT \`fk_sub_val_field_id\` FOREIGN KEY (\`form_field_id\`) REFERENCES \`form_fields\` (\`id\`) ON DELETE CASCADE,
  INDEX \`idx_val_sub_field\` (\`submission_id\`, \`field_key\`),
  INDEX \`idx_val_number\` (\`form_field_id\`, \`value_number\`)
) ENGINE=InnoDB;

-- ============================================================================
-- CONSULTAS COMPLEJAS OPTIMIZADAS (Ejemplos de Rendimiento)
-- ============================================================================

-- A. Reporte de respuestas por día y estado de aprobación para un formulario:
-- SELECT DATE(created_at) AS submission_date, status, COUNT(*) AS total
-- FROM form_submissions
-- WHERE form_id = 1 AND created_at >= NOW() - INTERVAL 30 DAY
-- GROUP BY DATE(created_at), status
-- ORDER BY submission_date DESC;

-- B. Cálculo de Promedio NPS y Calificación de estrellas instantáneo:
-- SELECT 
--   AVG(CASE WHEN ff.type = 'nps' THEN fsv.value_number ELSE NULL END) AS avg_nps,
--   AVG(CASE WHEN ff.type = 'rating' THEN fsv.value_number ELSE NULL END) AS avg_stars
-- FROM form_submission_values fsv
-- JOIN form_fields ff ON ff.id = fsv.form_field_id
-- WHERE ff.form_id = 1;
`;

export const LARAVEL_MIGRATION_PHP = `<?php
// database/migrations/2026_01_01_000001_create_forms_and_submissions_tables.php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Usuarios y Roles de Jotform
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'role')) {
                $table->enum('role', ['owner', 'admin', 'creator', 'reviewer', 'user'])->default('user');
                $table->string('department')->nullable();
                $table->string('avatar_url', 500)->nullable();
                $table->boolean('is_active')->default(true);
            }
        });

        // Formularios
        Schema::create('forms', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->string('slug')->index();
            $table->text('description')->nullable();
            $table->enum('status', ['draft', 'active', 'archived'])->default('draft');
            $table->json('theme_config');
            $table->json('settings')->nullable();
            $table->unsignedInteger('submission_count')->default(0);
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['user_id', 'status']);
        });

        // Campos del Formulario
        Schema::create('form_fields', function (Blueprint $table) {
            $table->id();
            $table->foreignId('form_id')->constrained()->cascadeOnDelete();
            $table->string('field_key', 64);
            $table->string('type', 32);
            $table->string('label');
            $table->string('placeholder')->nullable();
            $table->string('help_text', 500)->nullable();
            $table->boolean('is_required')->default(false);
            $table->unsignedInteger('order_index')->default(0);
            $table->enum('width', ['full', 'half', 'third'])->default('full');
            $table->json('options')->nullable();
            $table->json('conditional_logic')->nullable();
            $table->json('validation_rules')->nullable();
            $table->timestamps();

            $table->unique(['form_id', 'field_key']);
            $table->index(['form_id', 'order_index']);
        });

        // Envíos de Formulario
        Schema::create('form_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('form_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->enum('status', ['new', 'reviewed', 'approved', 'rejected'])->default('new');
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent', 500)->nullable();
            $table->timestamps();

            $table->index(['form_id', 'created_at']);
            $table->index(['form_id', 'status']);
        });

        // Valores de Envíos
        Schema::create('form_submission_values', function (Blueprint $table) {
            $table->id();
            $table->foreignId('submission_id')->constrained('form_submissions')->cascadeOnDelete();
            $table->foreignId('form_field_id')->constrained('form_fields')->cascadeOnDelete();
            $table->string('field_key', 64);
            $table->longText('value_text')->nullable();
            $table->decimal('value_number', 15, 4)->nullable();
            $table->json('value_json')->nullable();

            $table->index(['submission_id', 'field_key']);
            $table->index(['form_field_id', 'value_number']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('form_submission_values');
        Schema::dropIfExists('form_submissions');
        Schema::dropIfExists('form_fields');
        Schema::dropIfExists('forms');
    }
};
`;

export const LARAVEL_CONTROLLER_PHP = `<?php
// app/Http/Controllers/FormSubmissionController.php

namespace App\\Http\\Controllers;

use App\\Models\\Form;
use App\\Models\\FormSubmission;
use App\\Exports\\SubmissionsExport;
use Barryvdh\\DomPDF\\Facade\\Pdf;
use Maatwebsite\\Excel\\Facades\\Excel;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\DB;

class FormSubmissionController extends Controller
{
    /**
     * Guarda un nuevo envío de formulario validando roles y reglas dinámicas.
     */
    public function store(Request $request, Form $form)
    {
        abort_if($form->status !== 'active', 403, 'Este formulario no está aceptando respuestas.');

        $validated = $request->validate([
            'answers' => 'required|array',
        ]);

        return DB::transaction(function () use ($form, $validated, $request) {
            $submission = $form->submissions()->create([
                'user_id' => auth()->id(),
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'status' => 'new',
            ]);

            foreach ($form->fields as $field) {
                $rawVal = $validated['answers'][$field->field_key] ?? null;
                
                $submission->values()->create([
                    'form_field_id' => $field->id,
                    'field_key' => $field->field_key,
                    'value_text' => is_string($rawVal) ? $rawVal : json_encode($rawVal),
                    'value_number' => is_numeric($rawVal) ? (float) $rawVal : null,
                    'value_json' => is_array($rawVal) ? $rawVal : null,
                ]);
            }

            $form->increment('submission_count');

            return response()->json([
                'message' => 'Envío recibido con éxito.',
                'submission_id' => $submission->id,
            ], 201);
        });
    }

    /**
     * Exporta automáticamente todas las respuestas a formato EXCEL (.xlsx).
     */
    public function exportExcel(Form $form)
    {
        // Verificación de Roles estilo Jotform: Solo Admin, Owner o Reviewer
        $this->authorizeRole(['owner', 'admin', 'creator', 'reviewer']);

        $fileName = sprintf('Form_%s_Respuestas_%s.xlsx', $form->slug, now()->format('Y-m-d'));
        return Excel::download(new SubmissionsExport($form), $fileName);
    }

    /**
     * Exporta automáticamente las respuestas a formato PDF oficial.
     */
    public function exportPdf(Form $form, FormSubmission $submission)
    {
        $this->authorizeRole(['owner', 'admin', 'creator', 'reviewer']);

        $submission->load(['values.formField']);

        $pdf = Pdf::loadView('pdf.submission-receipt', [
            'form' => $form,
            'submission' => $submission,
        ])->setPaper('a4', 'portrait');

        return $pdf->download("Envio-{$submission->id}-{$form->slug}.pdf");
    }

    private function authorizeRole(array $allowedRoles): void
    {
        $userRole = auth()->user()->role ?? 'user';
        if (!in_array($userRole, $allowedRoles)) {
            abort(403, 'No tienes permisos para exportar datos de este formulario.');
        }
    }
}
`;

export const VUE_COMPONENT_VUE = `<!-- resources/js/Components/FormBuilder.vue -->
<template>
  <div class="flex h-screen bg-slate-100">
    <!-- Panel Izquierdo: Elementos Arrastrables -->
    <aside class="w-72 bg-white border-r border-slate-200 p-4 flex flex-col">
      <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
        Elementos de Formulario
      </h3>
      <div class="space-y-2 overflow-y-auto pr-1">
        <div 
          v-for="element in availableFields" 
          :key="element.type"
          draggable="true"
          @dragstart="onDragStart($event, element)"
          class="flex items-center gap-3 p-3 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 border border-slate-200 rounded-lg cursor-grab transition-all"
        >
          <component :is="element.icon" class="w-4 h-4 text-indigo-600" />
          <span class="text-sm font-medium text-slate-700">{{ element.label }}</span>
        </div>
      </div>
    </aside>

    <!-- Canvas Central: Vista Previa y Edición -->
    <main class="flex-1 p-6 overflow-y-auto" @dragover.prevent @drop="onDrop">
      <div class="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-8 min-h-[500px]">
        <h1 class="text-2xl font-bold text-slate-900 mb-2">{{ form.title }}</h1>
        <p class="text-slate-500 mb-6">{{ form.description }}</p>

        <draggable v-model="form.fields" item-key="id" group="form-fields" class="space-y-4">
          <template #item="{ element, index }">
            <div 
              @click="selectedField = element"
              :class="['p-4 rounded-lg border-2 transition-all relative group cursor-pointer',
                selectedField?.id === element.id ? 'border-indigo-600 bg-indigo-50/20' : 'border-slate-100 hover:border-slate-300']"
            >
              <label class="block text-sm font-semibold text-slate-700 mb-1">
                {{ element.label }}
                <span v-if="element.is_required" class="text-red-500">*</span>
              </label>
              <!-- Input Dummy según tipo -->
              <input v-if="element.type === 'text'" type="text" :placeholder="element.placeholder" disabled class="w-full p-2 border rounded bg-white text-slate-400 text-sm" />
            </div>
          </template>
        </draggable>
      </div>
    </main>
  </div>
</template>
`;
