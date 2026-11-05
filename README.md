# FormCraft Enterprise — Plataforma Empresarial de Formularios Dinámicos

FormCraft Enterprise es una plataforma corporativa para el diseño, recopilación, gestión y auditoría de formularios dinámicos con soporte para control de accesos basado en roles (RBAC), exportación de datos a Excel (.xlsx), firmas digitales, y backend con Laravel 13 y MySQL.

---

## 🚀 Guía Rápida: Cómo Publicar este Proyecto en GitHub

Sigue estos sencillos pasos para subir tu código a GitHub y tenerlo publicado en internet:

### Paso 1: Crear un nuevo repositorio en GitHub
1. Inicia sesión en tu cuenta de [GitHub](https://github.com/).
2. Haz clic en el botón verde **"New"** (o en el ícono `+` en la esquina superior derecha y selecciona **New repository**).
3. Asigna un nombre al repositorio, por ejemplo: `formcraft-enterprise`.
4. Elige si deseas que sea **Público** (recomendado para usar GitHub Pages gratis) o **Privado**.
5. **No marques** las opciones de "Add a README file" ni ".gitignore" (el proyecto ya los incluye).
6. Haz clic en **Create repository**.

---

### Paso 2: Subir el código desde tu terminal (Git)

Abre la terminal en la carpeta del proyecto y ejecuta los siguientes comandos:

```bash
# 1. Inicializar el repositorio Git local
git init

# 2. Agregar todos los archivos al control de versiones
git add .

# 3. Crear el primer commit
git commit -m "feat: publicación inicial de FormCraft Enterprise"

# 4. Asegurarse de estar en la rama principal 'main'
git branch -M main

# 5. Conectar con tu repositorio en GitHub (reemplaza TU_USUARIO y TU_REPOSITORIO)
git remote add origin https://github.com/TU_USUARIO/formcraft-enterprise.git

# 6. Subir el código a GitHub
git push -u origin main
```

---

### Paso 3: Activar Publicación Gratuita con GitHub Pages

El proyecto incluye el flujo automatizado `.github/workflows/deploy.yml`. Para que GitHub publique tu app automáticamente:

1. En tu repositorio de GitHub, dirígete a la pestaña **Settings** (Configuración).
2. En la barra lateral izquierda, haz clic en **Pages**.
3. En la sección **Build and deployment**:
   - En **Source**, selecciona **GitHub Actions**.
4. ¡Listo! En 1 a 2 minutos, la acción de GitHub compilará el proyecto y te entregará tu URL pública gratuita:
   `https://TU_USUARIO.github.io/formcraft-enterprise/`

---

### Alternativa: Publicación con 1 Clic en Vercel o Netlify

Si prefieres usar Vercel o Netlify (ambos 100% gratuitos y ultrarrápidos):

- **Vercel**:
  1. Entra a [vercel.com](https://vercel.com/) e inicia sesión con tu cuenta de GitHub.
  2. Haz clic en **"Add New..."** > **"Project"**.
  3. Selecciona tu repositorio `formcraft-enterprise` y haz clic en **Deploy**.
  4. Vercel detectará Vite y React automáticamente.

- **Netlify**:
  1. Entra a [netlify.com](https://www.netlify.com/) e inicia sesión con GitHub.
  2. Selecciona **"Add new site"** > **"Import an existing project"**.
  3. Selecciona tu repositorio y haz clic en **Deploy site**.

---

## 🛠️ Ejecución Local y Desarrollo

Para ejecutar y probar la aplicación en tu máquina local:

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar el servidor de desarrollo en http://localhost:3000
npm run dev

# 3. Compilar para producción (genera la carpeta dist/)
npm run build

# 4. Previsualizar la compilación de producción localmente
npm run preview
```

---

## 📦 Características Principales

- **Constructor Visual de Formularios**:
  - Campos de texto, números, correo, teléfono, fechas, selección simple y múltiple.
  - Firma digital integrada con canvas interactivo.
  - Carga y validación de archivos.
  - Personalización de paleta corporativa y temas visuales.
- **Gestión de Respuestas y Envíos**:
  - Filtro por estado (*Nuevo, En Revisión, Aprobado, Rechazado*).
  - Búsqueda en tiempo real sobre los datos enviados.
  - Exportación con un solo clic a **Excel (.xlsx)** estructurado.
- **Seguridad y Control de Acceso (RBAC)**:
  - Matriz granular de permisos por roles (*Owner, Admin, Editor, Reviewer, User*).
  - Asignación de roles y estados de colaboradores.
- **Arquitectura de Base de Datos y Backend**:
  - Esquema relacional MySQL normalizado (tablas `forms`, `form_fields`, `submissions`, `submission_values`, `roles`, `permissions`, `users`).
  - Migraciones y controladores listos para Laravel 13.
