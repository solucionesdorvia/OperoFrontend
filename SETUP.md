# Setup Frontend - Opero

## Cambios Realizados

Se ha completado la integración con el backend:

1. ✅ Dependencias agregadas (axios, async-storage)
2. ✅ Servicios API creados
3. ✅ Context de autenticación implementado
4. ✅ LoginScreen y RegisterScreen integrados
5. ✅ Configuración de URL por plataforma

## Instalación

```bash
# IMPORTANTE: Ejecutar primero para instalar las nuevas dependencias
npm install
```

## Configuración de URL del Backend

Editar `src/config/api.config.ts` si es necesario:

### Emulador Android
Ya configurado: `http://10.0.2.2:8080`

### Emulador iOS
Ya configurado: `http://localhost:8080`

### Dispositivo Físico (mismo WiFi)
Cambiar a tu IP local:

```typescript
// En src/config/api.config.ts, línea ~30
if (Platform.OS === 'ios') {
  return 'http://TU_IP_LOCAL:8080'; // Ejemplo: http://192.168.1.100:8080
}
```

**Encontrar tu IP:**
```bash
# macOS/Linux
ifconfig | grep "inet " | grep -v 127.0.0.1

# Windows
ipconfig
```

## Iniciar la App

```bash
npm start
```

Luego:
- **Presionar `a`**: Emulador Android
- **Presionar `i`**: Simulador iOS  
- **Presionar `w`**: Navegador Web
- **Escanear QR**: Dispositivo físico con Expo Go

## Probar la Integración

### 1. Verificar Conexión

Al abrir la app, deberías ver en la consola:
```
[API Config] Base URL: http://10.0.2.2:8080
[API Config] Platform: android
```

### 2. Registrar Usuario

1. Ir a "Registrarse"
2. Completar:
   - Nombre completo
   - Email (ej: `alumno@uade.edu.ar`)
   - Contraseña (min. 8 caracteres)
   - Rol (Alumno/Manager/Operador)
   - Departamento (si es Manager u Operador)
3. Presionar "Crear cuenta"

### 3. Iniciar Sesión

1. Usar las credenciales creadas
2. La app navegará automáticamente según el rol:
   - USER → StudentTabs
   - MANAGER → ManagerTabs
   - WORKER → MaintenanceTabs

### 4. Verificar Persistencia

1. Cerrar la app completamente
2. Volver a abrir
3. Debería mantener la sesión

## Estructura de Archivos Nuevos

```
src/
├── config/
│   └── api.config.ts          # Configuración de URLs
├── context/
│   └── AuthContext.tsx        # Context de autenticación
└── services/
    ├── api.ts                 # Cliente HTTP base
    ├── authService.ts         # Autenticación
    ├── incidentService.ts     # Incidentes
    ├── userService.ts         # Usuarios
    ├── departmentService.ts   # Departamentos
    └── index.ts               # Re-exportaciones
```

## Troubleshooting

### Error: "Network Error"

**Soluciones:**
1. Verificar que el backend esté corriendo: http://localhost:8080/swagger-ui.html
2. Verificar URL en `src/config/api.config.ts`
3. Si Android emulador, usar `10.0.2.2` en vez de `localhost`
4. Si dispositivo físico, usar IP local de tu computadora

### Error: "Cannot connect"

1. Verificar firewall (puerto 8080 debe estar abierto)
2. Verificar que estés en el mismo WiFi (si usas dispositivo físico)
3. Reiniciar Expo: `npm start --clear`

### App se queda en loading

1. Verificar consola para errores
2. Limpiar AsyncStorage:
   ```typescript
   // En consola de desarrollo
   AsyncStorage.clear();
   ```
3. Reiniciar app completamente

## Servicios Disponibles

### authService
```typescript
import { authService } from './services';

// Login
await authService.login(email, password);

// Register
await authService.register(fullName, email, password, roleId, departmentId);

// Logout
await authService.logout();

// Obtener usuario actual
const user = await authService.me();
```

### incidentService
```typescript
import { incidentService } from './services';

// Listar todos
const incidents = await incidentService.getAll();

// Obtener por ID
const incident = await incidentService.getById(id);

// Crear
const newIncident = await incidentService.create({
  title: 'Título',
  description: 'Descripción',
  departmentId: 1
});

// Actualizar status
await incidentService.updateStatus(id, 'IN_PROGRESS');

// Asignar worker (solo MANAGER)
await incidentService.assignWorker(incidentId, workerId);
```

### userService
```typescript
import { userService } from './services';

// Obtener mi perfil
const myProfile = await userService.getMe();

// Actualizar mi perfil
await userService.updateMe({
  fullName: 'Nuevo Nombre',
  password: 'nuevaPassword'
});

// Listar usuarios (solo MANAGER)
const users = await userService.getAll();
```

### departmentService
```typescript
import { departmentService } from './services';

// Listar departamentos
const departments = await departmentService.getAll();

// Crear departamento (solo MANAGER)
await departmentService.create({
  name: 'IT',
  description: 'Soporte técnico'
});
```

## Usar el AuthContext

```typescript
import { useAuth } from '../context/AuthContext';

function MiComponente() {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <Text>No autenticado</Text>;
  }

  return (
    <View>
      <Text>Hola, {user?.fullName}</Text>
      <Text>Rol: {user?.role.name}</Text>
      <Button title="Cerrar sesión" onPress={logout} />
    </View>
  );
}
```

## Próximos Pasos

1. **Implementar pantallas de incidentes:**
   - Listar incidentes (usar `incidentService.getAll()`)
   - Crear nuevo incidente
   - Ver detalle de incidente
   - Actualizar status

2. **Agregar manejo de errores:**
   - Toasts/Snackbars para feedback
   - Loading states
   - Error boundaries

3. **Optimizaciones:**
   - Caché local de datos
   - Pull-to-refresh
   - Paginación

## Documentación Completa

Ver: `../CONEXION_BACKEND_FRONTEND.md` para documentación detallada completa.

---

**Última actualización:** 2026-05-21
