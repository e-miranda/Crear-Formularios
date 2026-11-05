import React, { useState, useEffect, useMemo } from 'react';
import { Form, FormSubmission, AppUser, RoleDefinition } from './types';
import { INITIAL_FORMS, INITIAL_SUBMISSIONS, INITIAL_USERS, INITIAL_ROLES } from './mockData';
import { Navbar } from './components/Navbar';
import { AdminDashboard } from './components/AdminDashboard';
import { FormBuilder } from './components/FormBuilder/FormBuilder';
import { SubmissionsView } from './components/SubmissionsView';
import { LaravelMySQLView } from './components/LaravelMySQLView';
import { RolesPermissionsManager } from './components/RolesPermissionsManager';

export default function App() {
  // Local storage persistence with safe fallback
  const [forms, setForms] = useState<Form[]>(() => {
    try {
      const saved = localStorage.getItem('formcraft_forms');
      return saved ? JSON.parse(saved) : INITIAL_FORMS;
    } catch {
      return INITIAL_FORMS;
    }
  });

  const [submissions, setSubmissions] = useState<FormSubmission[]>(() => {
    try {
      const saved = localStorage.getItem('formcraft_submissions');
      return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
    } catch {
      return INITIAL_SUBMISSIONS;
    }
  });

  const [roles, setRoles] = useState<RoleDefinition[]>(() => {
    try {
      const saved = localStorage.getItem('formcraft_roles');
      return saved ? JSON.parse(saved) : INITIAL_ROLES;
    } catch {
      return INITIAL_ROLES;
    }
  });

  const [users, setUsers] = useState<AppUser[]>(() => {
    try {
      const saved = localStorage.getItem('formcraft_users');
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState<AppUser>(() => {
    return users[0] || INITIAL_USERS[0];
  });

  const [currentTab, setCurrentTab] = useState<
    'admin' | 'builder' | 'submissions' | 'templates' | 'laravel' | 'roles'
  >('admin');

  const [activeFormId, setActiveFormId] = useState<string>(forms[0]?.id || 'form-1');

  // Compute active user permissions
  const userPermissions = useMemo<string[]>(() => {
    const userRole = (roles || []).find((r) => r.id === currentUser?.role);
    if (userRole) {
      return userRole.permissions;
    }
    // Fallback: if role is owner give all, else give basic
    if (currentUser?.role === 'owner') {
      return [
        'forms.view',
        'forms.create',
        'forms.edit',
        'forms.delete',
        'submissions.view',
        'submissions.export_excel',
        'submissions.export_pdf',
        'submissions.change_status',
        'users.manage',
        'roles.manage',
        'database.view',
      ];
    }
    return ['forms.view', 'submissions.view'];
  }, [roles, currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('formcraft_forms', JSON.stringify(forms));
    } catch (e) {
      console.error(e);
    }
  }, [forms]);

  useEffect(() => {
    try {
      localStorage.setItem('formcraft_submissions', JSON.stringify(submissions));
    } catch (e) {
      console.error(e);
    }
  }, [submissions]);

  useEffect(() => {
    try {
      localStorage.setItem('formcraft_roles', JSON.stringify(roles));
    } catch (e) {
      console.error(e);
    }
  }, [roles]);

  useEffect(() => {
    try {
      localStorage.setItem('formcraft_users', JSON.stringify(users));
    } catch (e) {
      console.error(e);
    }
  }, [users]);

  const activeForm = forms.find((f) => f.id === activeFormId) || forms[0] || INITIAL_FORMS[0];

  // Handle switching tabs with permission guard
  const handleSelectTab = (
    tab: 'admin' | 'builder' | 'submissions' | 'templates' | 'laravel' | 'roles'
  ) => {
    if (tab === 'builder' && !userPermissions.includes('forms.edit') && !userPermissions.includes('forms.create')) {
      alert('Tu rol actual no tiene permisos para editar la estructura del formulario.');
      return;
    }
    if (tab === 'roles' && !userPermissions.includes('roles.manage')) {
      alert('Tu rol actual no tiene permisos para administrar roles.');
      return;
    }
    setCurrentTab(tab);
  };

  // Create new blank form
  const handleCreateNewForm = () => {
    if (!userPermissions.includes('forms.create')) {
      alert('Tu rol actual no tiene permisos para crear nuevos formularios.');
      return;
    }
    const newId = `form-${Date.now()}`;
    const newForm: Form = {
      id: newId,
      title: 'Nuevo Formulario Dinámico',
      description: 'Describe el propósito de este formulario aquí...',
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      creatorId: currentUser.id,
      creatorName: currentUser.name,
      submissionCount: 0,
      theme: {
        primaryColor: '#0f172a',
        backgroundColor: '#f8fafc',
        cardColor: '#ffffff',
        textColor: '#0f172a',
        borderRadius: 'md',
        fontFamily: 'sans',
        submitButtonText: 'Enviar Formulario',
        thankYouTitle: '¡Formulario Enviado con Éxito!',
        thankYouMessage: 'Hemos registrado tus respuestas de forma segura.',
      },
      fields: [
        {
          id: `f-${Date.now()}-1`,
          type: 'text',
          label: 'Nombre y Apellido',
          placeholder: 'Ej. Ana Morales',
          required: true,
          width: 'half',
        },
        {
          id: `f-${Date.now()}-2`,
          type: 'email',
          label: 'Correo Electrónico',
          placeholder: 'correo@ejemplo.com',
          required: true,
          width: 'half',
        },
        {
          id: `f-${Date.now()}-3`,
          type: 'textarea',
          label: 'Mensaje o Solicitud',
          placeholder: 'Escriba aquí los detalles...',
          required: false,
          width: 'full',
        },
      ],
    };

    setForms([newForm, ...forms]);
    setActiveFormId(newId);
    setCurrentTab('builder');
  };

  // Handle saving form from builder
  const handleSaveForm = (updatedForm: Form) => {
    setForms((prev) =>
      prev.map((f) => (f.id === updatedForm.id ? updatedForm : f))
    );
  };

  // Handle duplicating a form
  const handleDuplicateForm = (formToClone: Form) => {
    const clonedId = `form-${Date.now()}`;
    const clonedForm: Form = {
      ...formToClone,
      id: clonedId,
      title: `${formToClone.title} (Copia)`,
      status: 'draft',
      submissionCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      creatorId: currentUser.id,
      creatorName: currentUser.name,
    };
    setForms([clonedForm, ...forms]);
    setActiveFormId(clonedId);
  };

  // Handle deleting a form
  const handleDeleteForm = (formId: string) => {
    if (forms.length <= 1) {
      alert('Debe existir al menos un formulario en el sistema.');
      return;
    }
    if (confirm('¿Estás seguro de que deseas eliminar este formulario y sus respuestas asociadas?')) {
      setForms((prev) => prev.filter((f) => f.id !== formId));
      setSubmissions((prev) => prev.filter((s) => s.formId !== formId));
      if (activeFormId === formId) {
        const remaining = forms.filter((f) => f.id !== formId);
        setActiveFormId(remaining[0]?.id || '');
      }
    }
  };

  // Handle creating form from template
  const handleSelectTemplate = (templateType: string) => {
    let title = 'Formulario desde Plantilla';
    let desc = 'Formulario generado automáticamente a partir de plantilla.';
    let primaryColor = '#0f172a';
    let sampleFields = activeForm.fields;

    if (templateType.includes('customer-feedback')) {
      title = 'Encuesta de Satisfacción de Clientes (NPS)';
      desc = 'Mide el nivel de recomendación, satisfacción de soporte y comentarios.';
      primaryColor = '#0f172a';
    } else if (templateType.includes('job-application')) {
      title = 'Postulación de Empleo con CV y Firma';
      desc = 'Recepción de datos de contacto, años de experiencia, CV en PDF y firma digital.';
      primaryColor = '#0f172a';
    } else if (templateType.includes('event-registration')) {
      title = 'Registro a Conferencia de Tecnología';
      desc = 'Inscripción a talleres especializados y confirmación de asistencia.';
      primaryColor = '#0f172a';
    } else if (templateType.includes('technical-support')) {
      title = 'Solicitud de Soporte Técnico y Reporte de Fallas';
      desc = 'Levantamiento de tickets con asignación de severidad.';
      primaryColor = '#0f172a';
    }

    const newId = `form-${Date.now()}`;
    const newForm: Form = {
      id: newId,
      title,
      description: desc,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      creatorId: currentUser.id,
      creatorName: currentUser.name,
      submissionCount: 0,
      theme: {
        primaryColor,
        backgroundColor: '#f8fafc',
        cardColor: '#ffffff',
        textColor: '#0f172a',
        borderRadius: 'md',
        fontFamily: 'sans',
        submitButtonText: 'Enviar Formulario',
        thankYouTitle: '¡Muchas gracias!',
        thankYouMessage: 'Tus respuestas han sido recibidas exitosamente.',
      },
      fields: sampleFields,
    };

    setForms([newForm, ...forms]);
    setActiveFormId(newId);
    setCurrentTab('builder');
  };

  // Handle new submission from preview simulator
  const handleNewSubmission = (submission: FormSubmission) => {
    setSubmissions([submission, ...submissions]);
    setForms((prev) =>
      prev.map((f) =>
        f.id === submission.formId
          ? { ...f, submissionCount: f.submissionCount + 1 }
          : f
      )
    );
  };

  // Handle submission status change
  const handleUpdateSubmissionStatus = (
    submissionId: string,
    status: FormSubmission['status']
  ) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === submissionId ? { ...s, status } : s))
    );
  };

  // Role CRUD handlers
  const handleSaveRole = (updatedRole: RoleDefinition) => {
    setRoles((prev) => {
      const exists = prev.some((r) => r.id === updatedRole.id);
      if (exists) {
        return prev.map((r) => (r.id === updatedRole.id ? updatedRole : r));
      }
      return [...prev, updatedRole];
    });
  };

  const handleDeleteRole = (roleId: string) => {
    setRoles((prev) => prev.filter((r) => r.id !== roleId));
  };

  // User CRUD handlers
  const handleSaveUser = (updatedUser: AppUser) => {
    setUsers((prev) => {
      const exists = prev.some((u) => u.id === updatedUser.id);
      if (exists) {
        return prev.map((u) => (u.id === updatedUser.id ? updatedUser : u));
      }
      return [...prev, updatedUser];
    });
    if (currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (users.length <= 1) {
      alert('Debe existir al menos un usuario en la plataforma.');
      return;
    }
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    if (currentUser.id === userId) {
      const remaining = users.filter((u) => u.id !== userId);
      setCurrentUser(remaining[0]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Navigation Bar with Role Switcher */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        currentUser={currentUser}
        availableUsers={users}
        roles={roles}
        onSwitchUser={setCurrentUser}
        onNewForm={handleCreateNewForm}
        userPermissions={userPermissions}
      />

      {/* Main Content Areas */}
      <main className="flex-1">
        {currentTab === 'admin' && (
          <AdminDashboard
            forms={forms}
            submissions={submissions}
            users={users}
            currentUser={currentUser}
            roles={roles}
            userPermissions={userPermissions}
            onEditForm={(formId) => {
              setActiveFormId(formId);
              setCurrentTab('builder');
            }}
            onViewSubmissions={(formId) => {
              setActiveFormId(formId);
              setCurrentTab('submissions');
            }}
            onNewForm={handleCreateNewForm}
            onDuplicateForm={handleDuplicateForm}
            onDeleteForm={handleDeleteForm}
            onSelectTemplate={handleSelectTemplate}
            onNewSubmission={handleNewSubmission}
            onOpenRolesTab={() => setCurrentTab('roles')}
          />
        )}

        {currentTab === 'builder' && (
          <FormBuilder
            form={activeForm}
            onSaveForm={handleSaveForm}
            onBackToDashboard={() => setCurrentTab('admin')}
            readOnly={!userPermissions.includes('forms.edit')}
          />
        )}

        {currentTab === 'submissions' && (
          <SubmissionsView
            forms={forms}
            submissions={submissions}
            selectedFormId={activeFormId}
            userPermissions={userPermissions}
            onSelectFormId={setActiveFormId}
            onUpdateSubmissionStatus={handleUpdateSubmissionStatus}
          />
        )}

        {currentTab === 'templates' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <AdminDashboard
              forms={forms}
              submissions={submissions}
              users={users}
              currentUser={currentUser}
              roles={roles}
              userPermissions={userPermissions}
              onEditForm={(formId) => {
                setActiveFormId(formId);
                setCurrentTab('builder');
              }}
              onViewSubmissions={(formId) => {
                setActiveFormId(formId);
                setCurrentTab('submissions');
              }}
              onNewForm={handleCreateNewForm}
              onDuplicateForm={handleDuplicateForm}
              onDeleteForm={handleDeleteForm}
              onSelectTemplate={handleSelectTemplate}
              onNewSubmission={handleNewSubmission}
              onOpenRolesTab={() => setCurrentTab('roles')}
            />
          </div>
        )}

        {currentTab === 'laravel' && <LaravelMySQLView />}

        {currentTab === 'roles' && (
          <RolesPermissionsManager
            roles={roles}
            users={users}
            currentUser={currentUser}
            onSaveRole={handleSaveRole}
            onDeleteRole={handleDeleteRole}
            onSaveUser={handleSaveUser}
            onDeleteUser={handleDeleteUser}
          />
        )}
      </main>
    </div>
  );
}
