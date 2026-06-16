/**
 * Índice de Servicios
 *
 * Exporta todos los servicios de forma centralizada
 */

export { authService } from './authService';
export { incidentService } from './incidentService';
export { offlineIncidentService } from './offlineIncidentService';
export { userService } from './userService';
export { departmentService } from './departmentService';

// Re-exportar tipos comunes
export type {
  LoginRequest,
  RegisterRequest,
  UserResponse,
  AuthResponse
} from './authService';

export type {
  IncidentRequest,
  UpdateIncidentRequest,
  IncidentResponse
} from './incidentService';

export type {
  LocalIncident,
  NewLocalIncident,
  LocalSyncStatus,
  FlushResult
} from './offlineIncidentService';

export type {
  UpdateUserRequest
} from './userService';

export type {
  DepartmentRequest,
  DepartmentResponse
} from './departmentService';
