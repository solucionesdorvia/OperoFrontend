// Tipos centralizados para React Navigation.
// Cada Param-list describe las rutas de un navigator y los params que recibe cada una.
// Un cambio acá rompe la build de cualquier screen que use una ruta inexistente
// o le pase params mal formados — el typecheck es la red de seguridad.

import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { IncidentResponse } from '../services/incidentService';

// ===== Params de pantallas que reciben datos =====

// Usamos IncidentResponse del servicio como tipo estándar para incidencias
export type Incident = IncidentResponse;

export interface Task {
  id?: number | string | null;
  code?: string | null;
  title?: string | null;
  description?: string | null;
  location?: string | null;
  priority?: string | null;
  time?: string | null;
}

export type IncidentDetailParams = { incident?: Incident };
export type ManagerIncidentDetailParams = { incident?: Incident };
export type MaintenanceDetailParams = { task?: Task };
export type CreateIncidentParams = {
  prefill?: {
    code?: string;
    location?: string;
    building?: string;
    floor?: string;
    room?: string;
    department?: string;
  };
  mode?: 'edit';
  incident?: Incident;
};

// ===== Tabs (alumno, manager, mantenimiento) =====

export type StudentTabParamList = {
  StudentHome: undefined;
  StudentIncidents: undefined;
};

export type ManagerTabParamList = {
  ManagerHome: undefined;
  ManagerIncidents: undefined;
  ManagerMyTeam: undefined;
  ManagerProfile: undefined;
};

export type MaintenanceTabParamList = {
  MaintenanceHomeTab: undefined;
  MaintenanceHistory: undefined;
  MaintenanceProfile: undefined;
};

// ===== Stack raíz =====

export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;

  StudentTabs: NavigatorScreenParams<StudentTabParamList> | undefined;
  ManagerTabs: NavigatorScreenParams<ManagerTabParamList> | undefined;
  MaintenanceTabs: NavigatorScreenParams<MaintenanceTabParamList> | undefined;

  IncidentDetail: IncidentDetailParams | undefined;
  CreateIncident: CreateIncidentParams | undefined;
  ScanQR: undefined;

  // Notificaciones y Perfil del alumno: ahora viven en el stack, accedidas
  // desde los íconos arriba a la derecha del TopAppBar (no son tabs).
  StudentNotifications: undefined;
  StudentProfile: undefined;

  ManagerIncidentDetail: ManagerIncidentDetailParams | undefined;
  DepartmentSettings: undefined;

  MaintenanceDetail: MaintenanceDetailParams | undefined;

  EditProfile: undefined;
};

// ===== Helpers para tipar props de screens =====

// Stack-only screens (Login, Register, Onboarding, IncidentDetail, etc.)
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

// Tab screens — necesitan acceso al stack padre para navegar a rutas como IncidentDetail
export type StudentTabScreenProps<T extends keyof StudentTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<StudentTabParamList, T>,
    NativeStackScreenProps<RootStackParamList>
  >;

export type ManagerTabScreenProps<T extends keyof ManagerTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<ManagerTabParamList, T>,
    NativeStackScreenProps<RootStackParamList>
  >;

export type MaintenanceTabScreenProps<T extends keyof MaintenanceTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MaintenanceTabParamList, T>,
    NativeStackScreenProps<RootStackParamList>
  >;

// Override global de React Navigation para que `useNavigation()` herede los tipos
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface RootParamList extends RootStackParamList {}
  }
}
