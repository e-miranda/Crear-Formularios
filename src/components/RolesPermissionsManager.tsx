import React, { useState } from 'react';
import { 
  Shield, 
  ShieldCheck, 
  Plus, 
  Edit3, 
  Trash2, 
  Users, 
  Lock, 
  CheckSquare, 
  Square, 
  AlertCircle,
  X,
  Check,
  UserPlus,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { AppUser, RoleDefinition, AppPermission } from '../types';
import { ALL_PERMISSIONS } from '../mockData';

interface RolesPermissionsManagerProps {
  roles: RoleDefinition[];
  users: AppUser[];
  currentUser: AppUser;
  onSaveRole: (role: RoleDefinition) => void;
  onDeleteRole: (roleId: string) => void;
  onSaveUser: (user: AppUser) => void;
  onDeleteUser: (userId: string) => void;
}

export const RolesPermissionsManager: React.FC<RolesPermissionsManagerProps> = ({
  roles,
  users,
  currentUser,
  onSaveRole,
  onDeleteRole,
  onSaveUser,
  onDeleteUser,
}) => {
  const [activeSubtab, setActiveSubtab] = useState<'roles' | 'matrix' | 'users'>('roles');
  const [selectedRoleId, setSelectedRoleId] = useState<string>(roles[0]?.id || 'owner');

  // Role Edit/Create Modal
  const [editingRole, setEditingRole] = useState<RoleDefinition | null>(null);
  const [isNewRole, setIsNewRole] = useState(false);

  // User Edit/Create Modal
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);

  const selectedRole = roles.find((r) => r.id === selectedRoleId) || roles[0];

  // Group permissions by category
  const categories = Array.from(new Set(ALL_PERMISSIONS.map((p) => p.category)));

  // Handlers for Role CRUD
  const handleOpenNewRole = () => {
    const newRole: RoleDefinition = {
      id: `role-custom-${Date.now()}`,
      name: 'Nuevo Rol Personalizado',
      description: 'Describe las responsabilidades y alcance de este rol...',
      badgeBg: 'bg-slate-100',
      badgeText: 'text-slate-800',
      badgeBorder: 'border-slate-300',
      isSystem: false,
      permissions: ['forms.view', 'submissions.view'],
    };
    setEditingRole(newRole);
    setIsNewRole(true);
  };

  const handleOpenEditRole = (role: RoleDefinition) => {
    setEditingRole({ ...role });
    setIsNewRole(false);
  };

  const handleSaveRoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRole) return;
    onSaveRole(editingRole);
    setSelectedRoleId(editingRole.id);
    setEditingRole(null);
  };

  // Handlers for Permission Toggling in the matrix
  const handleTogglePermission = (roleId: string, permKey: string) => {
    const target = roles.find((r) => r.id === roleId);
    if (!target) return;
    // Don't allow removing permissions from system 'owner'
    if (target.id === 'owner' && target.permissions.includes(permKey)) {
      alert('El rol Propietario (Owner) debe mantener todos los privilegios del sistema.');
      return;
    }

    const hasPerm = target.permissions.includes(permKey);
    const updatedPermissions = hasPerm
      ? target.permissions.filter((p) => p !== permKey)
      : [...target.permissions, permKey];

    onSaveRole({
      ...target,
      permissions: updatedPermissions,
    });
  };

  const handleToggleCategoryForRole = (roleId: string, category: string) => {
    const target = roles.find((r) => r.id === roleId);
    if (!target) return;
    if (target.id === 'owner') return;

    const catPerms = ALL_PERMISSIONS.filter((p) => p.category === category).map((p) => p.key);
    const allActive = catPerms.every((k) => target.permissions.includes(k));

    let newPerms: string[];
    if (allActive) {
      newPerms = target.permissions.filter((k) => !catPerms.includes(k));
    } else {
      newPerms = Array.from(new Set([...target.permissions, ...catPerms]));
    }

    onSaveRole({
      ...target,
      permissions: newPerms,
    });
  };

  // Handlers for User CRUD
  const handleOpenNewUser = () => {
    const newUser: AppUser = {
      id: `usr-${Date.now()}`,
      name: '',
      email: '',
      department: 'Operaciones',
      role: roles[0]?.id || 'admin',
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    };
    setEditingUser(newUser);
    setIsNewUser(true);
  };

  const handleOpenEditUser = (user: AppUser) => {
    setEditingUser({ ...user });
    setIsNewUser(false);
  };

  const handleSaveUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !editingUser.name || !editingUser.email) {
      alert('Por favor completa el nombre y correo del usuario.');
      return;
    }
    onSaveUser(editingUser);
    setEditingUser(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header Banner - Clean Executive Slate Style (No Gradients) */}
      <div className="bg-slate-900 text-white p-6 rounded-xl border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-slate-800 border border-slate-700">
                <Shield className="w-4 h-4 text-slate-200" />
              </span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Módulo de Seguridad y Control de Acceso (RBAC)
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              Administración de Roles, Permisos y Accesos
            </h1>
            <p className="text-xs text-slate-400 max-w-3xl">
              Configura permisos granulares para cada perfil de usuario. Las restricciones se aplican de forma inmediata en toda la plataforma y se corresponden con las políticas de Laravel 13 y MySQL.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenNewRole}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white text-slate-900 rounded-md text-xs font-semibold hover:bg-slate-100 transition-colors border border-white"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nuevo Rol</span>
            </button>

            <button
              onClick={handleOpenNewUser}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 text-slate-200 rounded-md text-xs font-semibold hover:bg-slate-700 transition-colors border border-slate-700"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Nuevo Usuario</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Subtabs */}
      <div className="flex border-b border-slate-200 bg-white px-4 rounded-t-xl">
        <button
          onClick={() => setActiveSubtab('roles')}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors ${
            activeSubtab === 'roles'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Roles del Sistema ({roles.length})
        </button>

        <button
          onClick={() => setActiveSubtab('matrix')}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors ${
            activeSubtab === 'matrix'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Lock className="w-4 h-4" />
          Matriz de Permisos Granulares
        </button>

        <button
          onClick={() => setActiveSubtab('users')}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors ${
            activeSubtab === 'users'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          Usuarios y Asignación de Perfiles ({users.length})
        </button>
      </div>

      {/* Subtab 1: Roles List & Overview */}
      {activeSubtab === 'roles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map((role) => {
            const usersWithRole = users.filter((u) => u.role === role.id);
            return (
              <div
                key={role.id}
                className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between hover:border-slate-300 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 border border-slate-200 font-semibold text-xs">
                        {role.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{role.name}</h3>
                        <span className="text-[10px] text-slate-400 font-mono">ID: {role.id}</span>
                      </div>
                    </div>

                    {role.isSystem ? (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        Sistema
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                        Personalizado
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 mt-3 leading-relaxed min-h-[36px]">
                    {role.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Permisos Activos</span>
                      <span className="font-semibold text-slate-800">
                        {role.permissions.length} de {ALL_PERMISSIONS.length}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Usuarios Asignados</span>
                      <span className="font-semibold text-slate-800">
                        {usersWithRole.length} miembros
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setSelectedRoleId(role.id);
                      setActiveSubtab('matrix');
                    }}
                    className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1"
                  >
                    <span>Configurar Permisos</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditRole(role)}
                      className="p-1.5 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                      title="Editar Datos del Rol"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    {!role.isSystem && (
                      <button
                        onClick={() => {
                          if (confirm(`¿Eliminar el rol "${role.name}"? Los usuarios asociados deberán ser reasignados.`)) {
                            onDeleteRole(role.id);
                          }
                        }}
                        className="p-1.5 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Eliminar Rol"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Subtab 2: Granular Permissions Matrix */}
      {activeSubtab === 'matrix' && (
        <div className="space-y-4">
          {/* Role selector pill bar */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-3 overflow-x-auto">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-500 mr-2 whitespace-nowrap">
                Editar Rol:
              </span>
              {roles.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedRoleId(r.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                    selectedRoleId === r.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {r.name} ({r.permissions.length})
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-500 whitespace-nowrap hidden sm:block">
              Total: <strong className="text-slate-900">{selectedRole.permissions.length}</strong> permisos autorizados
            </div>
          </div>

          {/* Matrix by Category */}
          <div className="space-y-4">
            {categories.map((cat) => {
              const categoryPerms = ALL_PERMISSIONS.filter((p) => p.category === cat);
              const allChecked = categoryPerms.every((p) => selectedRole.permissions.includes(p.key));
              const someChecked = categoryPerms.some((p) => selectedRole.permissions.includes(p.key));

              return (
                <div key={cat} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs uppercase tracking-wider text-slate-700">
                        {cat}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        ({categoryPerms.filter((p) => selectedRole.permissions.includes(p.key)).length} de {categoryPerms.length})
                      </span>
                    </div>

                    {selectedRole.id !== 'owner' && (
                      <button
                        onClick={() => handleToggleCategoryForRole(selectedRole.id, cat)}
                        className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                      >
                        {allChecked ? 'Desmarcar todos' : 'Marcar todos'}
                      </button>
                    )}
                  </div>

                  <div className="divide-y divide-slate-100">
                    {categoryPerms.map((perm) => {
                      const isGranted = selectedRole.permissions.includes(perm.key);
                      const isOwnerDisabled = selectedRole.id === 'owner';

                      return (
                        <div
                          key={perm.key}
                          onClick={() => {
                            if (!isOwnerDisabled) {
                              handleTogglePermission(selectedRole.id, perm.key);
                            }
                          }}
                          className={`p-3.5 flex items-start gap-3 transition-colors ${
                            isOwnerDisabled
                              ? 'cursor-not-allowed bg-slate-50/40'
                              : 'cursor-pointer hover:bg-slate-50/80'
                          }`}
                        >
                          <div className="mt-0.5 text-slate-700">
                            {isGranted ? (
                              <CheckSquare className="w-4 h-4 text-slate-900" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-300" />
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900">{perm.name}</span>
                              <code className="text-[10px] text-slate-400 font-mono bg-slate-100 px-1.5 py-0.2 rounded">
                                {perm.key}
                              </code>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                              {perm.description}
                            </p>
                          </div>

                          <div className="shrink-0">
                            {isGranted ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                <Check className="w-3 h-3" /> Permitido
                              </span>
                            ) : (
                              <span className="text-[11px] font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                                Denegado
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Subtab 3: Users & Profiles Assignment Table */}
      {activeSubtab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Administra los miembros del equipo y asígnales roles con sus respectivos privilegios.
            </p>

            <button
              onClick={handleOpenNewUser}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-md text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Añadir Miembro</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Usuario</th>
                    <th className="py-3 px-4">Departamento</th>
                    <th className="py-3 px-4">Rol Asignado</th>
                    <th className="py-3 px-4">Estado</th>
                    <th className="py-3 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => {
                    const uRole = roles.find((r) => r.id === u.role) || {
                      name: u.role,
                      badgeBg: 'bg-slate-100',
                      badgeText: 'text-slate-800',
                      badgeBorder: 'border-slate-200',
                    };

                    return (
                      <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={u.avatar}
                              alt={u.name}
                              className="w-8 h-8 rounded-full object-cover border border-slate-200"
                            />
                            <div>
                              <div className="font-bold text-slate-900">{u.name}</div>
                              <div className="text-slate-400 text-[11px]">{u.email}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-medium text-slate-700">
                          {u.department}
                        </td>

                        <td className="py-3.5 px-4">
                          <select
                            value={u.role}
                            onChange={(e) => {
                              onSaveUser({ ...u, role: e.target.value });
                            }}
                            className="text-xs font-semibold px-2 py-1 bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-slate-900 cursor-pointer"
                          >
                            {roles.map((r) => (
                              <option key={r.id} value={r.id}>
                                {r.name}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => {
                              onSaveUser({
                                ...u,
                                status: u.status === 'active' ? 'inactive' : 'active',
                              });
                            }}
                            className={`text-[11px] font-semibold px-2 py-0.5 rounded border transition-colors ${
                              u.status === 'active'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-slate-100 text-slate-500 border-slate-200'
                            }`}
                          >
                            {u.status === 'active' ? 'Activo' : 'Suspendido'}
                          </button>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleOpenEditUser(u)}
                              className="p-1.5 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                              title="Editar Usuario"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            {users.length > 1 && (
                              <button
                                onClick={() => {
                                  if (confirm(`¿Eliminar al usuario ${u.name}?`)) {
                                    onDeleteUser(u.id);
                                  }
                                }}
                                className="p-1.5 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                title="Eliminar Usuario"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit or Create Role */}
      {editingRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                {isNewRole ? 'Crear Nuevo Rol' : `Editar Rol: ${editingRole.name}`}
              </h3>
              <button
                onClick={() => setEditingRole(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRoleSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Nombre del Rol
                </label>
                <input
                  type="text"
                  required
                  value={editingRole.name}
                  onChange={(e) => setEditingRole({ ...editingRole, name: e.target.value })}
                  placeholder="Ej. Coordinador de Respuestas"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-slate-900 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Descripción y Alcance
                </label>
                <textarea
                  rows={3}
                  value={editingRole.description}
                  onChange={(e) => setEditingRole({ ...editingRole, description: e.target.value })}
                  placeholder="Explica qué funciones y restricciones posee..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-slate-900 text-xs resize-none"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingRole(null)}
                  className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-slate-900 text-white rounded-md hover:bg-slate-800 font-semibold"
                >
                  Guardar Rol
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit or Create User */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                {isNewUser ? 'Añadir Nuevo Usuario' : `Editar Usuario: ${editingUser.name}`}
              </h3>
              <button
                onClick={() => setEditingUser(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUserSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  required
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  placeholder="Ej. Roberto Sánchez"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-slate-900 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  required
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  placeholder="usuario@empresa.com"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-slate-900 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Departamento / Área
                </label>
                <input
                  type="text"
                  value={editingUser.department}
                  onChange={(e) => setEditingUser({ ...editingUser, department: e.target.value })}
                  placeholder="Ej. Auditoría de Calidad"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-slate-900 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Rol de Acceso Asignado
                </label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-slate-900 text-xs bg-white"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-slate-900 text-white rounded-md hover:bg-slate-800 font-semibold"
                >
                  Guardar Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
