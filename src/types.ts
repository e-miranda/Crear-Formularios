export type FieldType =
  | 'text'
  | 'textarea'
  | 'email'
  | 'number'
  | 'phone'
  | 'date'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'rating'
  | 'nps'
  | 'file'
  | 'signature'
  | 'heading'
  | 'divider'
  | 'terms';

export interface FieldOption {
  id: string;
  label: string;
  value: string;
}

export interface ConditionalRule {
  id: string;
  fieldId: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'is_empty' | 'is_not_empty';
  value: string;
  action: 'show' | 'hide';
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  helpText?: string;
  required: boolean;
  defaultValue?: string | number | boolean;
  options?: FieldOption[];
  min?: number;
  max?: number;
  step?: number;
  width?: 'full' | 'half' | 'third';
  conditionalRules?: ConditionalRule[];
  validationRegex?: string;
  termsText?: string;
}

export interface FormTheme {
  primaryColor: string;
  backgroundColor: string;
  cardColor: string;
  textColor: string;
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
  fontFamily: 'sans' | 'serif' | 'mono';
  bannerImage?: string;
  submitButtonText: string;
  thankYouTitle: string;
  thankYouMessage: string;
}

export interface Form {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'draft' | 'archived';
  fields: FormField[];
  theme: FormTheme;
  createdAt: string;
  updatedAt: string;
  creatorId: string;
  creatorName: string;
  submissionCount: number;
}

export interface FormSubmission {
  id: string;
  formId: string;
  formTitle: string;
  data: Record<string, any>;
  createdAt: string;
  status: 'new' | 'reviewed' | 'approved' | 'rejected';
  ipAddress?: string;
}

export type JotformRole = string;

export interface AppPermission {
  key: string;
  name: string;
  category: 'Formularios' | 'Respuestas' | 'Seguridad y Roles' | 'Sistema';
  description: string;
}

export interface RoleDefinition {
  id: string;
  name: string;
  description: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  isSystem?: boolean;
  permissions: string[];
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  department: string;
  status: 'active' | 'inactive';
}
