import React from 'react';
import { 
  FileText, 
  LayoutDashboard, 
  Layers, 
  TableProperties, 
  Database, 
  Plus, 
  UserCheck, 
  ChevronDown,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { AppUser, RoleDefinition } from '../types';

interface NavbarProps {
  currentTab: 'admin' | 'builder' | 'submissions' | 'templates' | 'laravel' | 'roles';
  onSelectTab: (tab: 'admin' | 'builder' | 'submissions' | 'templates' | 'laravel' | 'roles') => void;
  currentUser: AppUser;
  availableUsers: AppUser[];
  roles: RoleDefinition[];
  onSwitchUser: (user: AppUser) => void;
  onNewForm: () => void;
  userPermissions: string[];
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  availableUsers = [],
  roles = [],
  onSwitchUser,
  onNewForm,
  userPermissions = [],
}) => {
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);

  const currentRole = (roles || []).find((r) => r.id === currentUser?.role) || {
    id: currentUser?.role || 'user',
    name: currentUser?.role || 'Usuario',
    description: 'Rol de usuario',
    badgeBg: 'bg-slate-100',
    badgeText: 'text-slate-800',
    badgeBorder: 'border-slate-300',
    permissions: [],
  };

  const canCreateForm = (userPermissions || []).includes('forms.create');
  const canEditForm = (userPermissions || []).includes('forms.edit');
  const canViewSubmissions = (userPermissions || []).includes('submissions.view');
  const canManageRoles = (userPermissions || []).includes('roles.manage');
  const canViewDatabase = (userPermissions || []).includes('database.view');

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <div 
            onClick={() => onSelectTab('admin')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white border border-slate-800 transition-colors">
              <Layers className="w-5 h-5 text-slate-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-base tracking-tight">FormCraft</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">Plataforma Empresarial de Formularios</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => onSelectTab('admin')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-colors ${
                currentTab === 'admin'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Formularios
            </button>

            {canEditForm && (
              <button
                onClick={() => onSelectTab('builder')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-colors ${
                  currentTab === 'builder'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Constructor
              </button>
            )}

            {canViewSubmissions && (
              <button
                onClick={() => onSelectTab('submissions')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-colors ${
                  currentTab === 'submissions'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <TableProperties className="w-3.5 h-3.5" />
                Respuestas
              </button>
            )}

            <button
              onClick={() => onSelectTab('templates')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-colors ${
                currentTab === 'templates'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-500" />
              Plantillas
            </button>

            {canManageRoles && (
              <button
                onClick={() => onSelectTab('roles')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-colors ${
                  currentTab === 'roles'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
                Roles y Permisos
              </button>
            )}

            {canViewDatabase && (
              <button
                onClick={() => onSelectTab('laravel')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-colors ${
                  currentTab === 'laravel'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Database className="w-3.5 h-3.5 text-slate-600" />
                MySQL & Laravel 13
              </button>
            )}
          </nav>
        </div>

        {/* Right side: Role selector & New Form CTA */}
        <div className="flex items-center gap-3">
          {canCreateForm && (
            <button
              onClick={onNewForm}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold transition-colors border border-slate-900"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Nuevo Formulario</span>
            </button>
          )}

          {/* Role & User Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50 transition-colors text-left"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-6 h-6 rounded-full object-cover border border-slate-300"
              />
              <div className="hidden lg:block">
                <div className="text-xs font-semibold text-slate-900 leading-tight">
                  {currentUser.name}
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span
                    className={`inline-block text-[10px] font-semibold px-1.5 py-0.2 rounded border ${currentRole.badgeBg} ${currentRole.badgeText} ${currentRole.badgeBorder}`}
                  >
                    {currentRole.name.split(' ')[0]}
                  </span>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </button>

            {/* Dropdown Menu */}
            {userDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setUserDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Control de Acceso (RBAC)
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Cambia de usuario para simular accesos y permisos.
                    </p>
                  </div>

                  <div className="py-1 max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {availableUsers.map((user) => {
                      const isSelected = user.id === currentUser.id;
                      const uRole = roles.find((r) => r.id === user.role) || {
                        name: user.role,
                        description: '',
                        badgeBg: 'bg-slate-100',
                        badgeText: 'text-slate-800',
                        badgeBorder: 'border-slate-200',
                      };
                      return (
                        <button
                          key={user.id}
                          onClick={() => {
                            onSwitchUser(user);
                            setUserDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 flex items-start gap-3 hover:bg-slate-50 transition-colors ${
                            isSelected ? 'bg-slate-100/60' : ''
                          }`}
                        >
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-7 h-7 rounded-full object-cover border border-slate-200 mt-0.5"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-900">
                                {user.name}
                              </span>
                              {isSelected && (
                                <UserCheck className="w-3.5 h-3.5 text-slate-900" />
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span
                                className={`text-[10px] font-medium px-1.5 py-0.2 rounded border ${uRole.badgeBg} ${uRole.badgeText} ${uRole.badgeBorder}`}
                              >
                                {uRole.name}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                              {user.department} • {user.email}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="px-4 py-2 border-t border-slate-100 bg-slate-50 text-[11px] text-slate-600 rounded-b-lg">
                    <span className="font-semibold text-slate-800">Rol activo:</span> {currentRole.name}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
