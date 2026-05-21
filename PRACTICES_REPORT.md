# OPERO — Reporte de alineación con prácticas de cátedra

**Fecha:** 15/05/2026
**Materia:** Desarrollo de Aplicaciones I — UADE
**Base de referencia:** Clases 7 y 8
**Repositorio:** https://github.com/solucionesdorvia/OperoFrontend

---

## 1. Convenciones aplicadas

### 1.1 Constantes — Clase 7

Todos los valores reutilizables están centralizados en la carpeta **`constants/`** en la raíz del proyecto, exportados en MAYÚSCULAS (convención JS para globals inmutables):

```
constants/
├── colors.ts   → export const COLORS = { ... }
├── fonts.ts    → export const FONTS  = { family, size, lineHeight, tracking }
└── api.ts      → export const API_URL, API_TIMEOUT_MS
```

**Por qué:** cualquier cambio de paleta, fuente o endpoint se hace en un solo lugar. Si un color aparece en 20 componentes y se decide cambiarlo, basta tocar `constants/colors.ts`. Sin estos archivos centralizados, habría que buscar y reemplazar `#1E3A5F` en todo el código.

**Cómo se usa:**

```ts
import { COLORS } from '../../constants/colors';
import { FONTS } from '../../constants/fonts';

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    fontFamily: FONTS.family.monoSemiBold,
  },
});
```

**Comprobación:** `grep -rn "#[0-9A-Fa-f]\{6\}" src/` devuelve 0 hex hardcodeados fuera de `constants/colors.ts`.

---

### 1.2 Componentes y estilos — Clase 7

Cada componente o pantalla con estilos tiene **su archivo `.styles.ts` pareja** al lado:

```
src/components/
├── IncidentCard.tsx
├── IncidentCard.styles.ts      ← export const styles = StyleSheet.create({...})
├── StatusBadge.tsx
├── StatusBadge.styles.ts
├── TopAppBar.tsx
└── TopAppBar.styles.ts

src/screens/student/
├── HomeScreen.tsx
├── HomeScreen.styles.ts
├── MyIncidentsScreen.tsx
├── MyIncidentsScreen.styles.ts
└── ... (uno por screen)
```

**Total:** 25 archivos `.styles.ts` (3 componentes + 21 screens + 1 navegador).

**Por qué:**
- **Separación de responsabilidades:** el `.tsx` describe estructura y comportamiento (JSX, hooks, lógica), el `.styles.ts` describe presentación.
- **Legibilidad:** los archivos `.tsx` quedan más cortos y centrados en lo importante.
- **Estilos reutilizables:** si en el futuro se necesita compartir un set de estilos entre dos componentes, ya están en un archivo separado importable.

**Patrón en cada `.styles.ts`:**

```ts
import { StyleSheet } from 'react-native';
import { COLORS } from '../../../constants/colors';
import { FONTS } from '../../../constants/fonts';

export const styles = StyleSheet.create({
  container: { /* ... */ },
  title:     { /* ... */ },
});
```

Y en el `.tsx`:

```tsx
import { styles } from './HomeScreen.styles';
// ...
<View style={styles.container}>
  <Text style={styles.title}>...</Text>
</View>
```

**Estilos inline:** se permiten solo para layout helpers de **1 propiedad** como `style={{ flex: 1 }}`. Cualquier cosa con 3+ propiedades va al `.styles.ts`.

---

### 1.3 Props tipadas con `type` — Clase 7

Todos los componentes declaran sus props con `type` (no `interface`), siguiendo el patrón `<NombreComponente>Props`:

```tsx
// src/components/IncidentCard.tsx
type IncidentCardProps = {
  title: string;
  location: string;
  status: 'ABIERTO' | 'EN PROCESO' | 'FINALIZADO' | 'PENDIENTE';
  time: string;
  onPress?: () => void;
  dimmed?: boolean;
};

export default function IncidentCard({ title, location, status, time, onPress, dimmed }: IncidentCardProps) {
  // ...
}
```

**Por qué `type` y no `interface`:**
- Para describir la forma de un objeto en TypeScript son equivalentes en 99% de los casos.
- `type` es más flexible: permite uniones (`type Status = 'A' | 'B'`), intersecciones, tuplas.
- La consistencia importa: el equipo elige uno y lo mantiene. Acá se eligió `type`.

**Comprobación:** `grep -rn "^interface .*Props" src/` devuelve 0.

**Patrón en todas las screens:** además del tipo de props, hay tipos centralizados de navegación (ver sección 1.5).

---

### 1.4 Iconografía — Clase 7

**Toda la app usa `@expo/vector-icons`** — específicamente `MaterialIcons`. Cero dependencias de `lucide-react-native`, `phosphor-react-native` o SVG custom para íconos.

```tsx
import { MaterialIcons } from '@expo/vector-icons';

<MaterialIcons name="qr-code-scanner" size={26} color={COLORS.primary} />
```

**Por qué:** `@expo/vector-icons` es la librería oficial recomendada por Expo, viene pre-instalada, y agrupa las principales colecciones (Material, Ionicons, FontAwesome, etc.) bajo una misma API.

**Comprobación:** `grep -rn "from 'lucide-react-native'\|from 'phosphor-react-native'" src/` devuelve 0.

---

### 1.5 Tipado de navegación

La carpeta **`src/types/`** centraliza los tipos relacionados con navegación, evitando el `navigation: any` que abunda en proyectos sin disciplina TS:

```
src/types/
└── navigation.ts
```

Define:
- **`RootStackParamList`** — todas las rutas del Stack raíz y sus params.
- **`StudentTabParamList`**, **`ManagerTabParamList`**, **`MaintenanceTabParamList`** — un Param-list por cada grupo de tabs.
- **Helpers** `RootStackScreenProps<T>`, `StudentTabScreenProps<T>`, etc. — un tipo por kind de screen.

Cada screen declara su tipo propio y lo aplica:

```tsx
import type { StudentTabScreenProps } from '../../types/navigation';

type HomeScreenProps = StudentTabScreenProps<'StudentHome'>;

export default function HomeScreen({ navigation }: HomeScreenProps) {
  // navigation.navigate('IncidentDetail', { incident: ... });  ← typecheckeado
}
```

**Beneficio concreto:**
- Si llamás `navigation.navigate('IncidnetDetail')` (con typo), TypeScript te avisa antes de compilar.
- Si pasás params equivocados (ej. `navigation.navigate('IncidentDetail', { wrong: 'field' })`), TypeScript te avisa.
- Si renombrás una ruta, el typechecker te lista todos los archivos que rompió.

**Comprobación:** `npx tsc --noEmit` compila sin errores.

---

### 1.6 Semántica de navegación: `push` vs `replace`

**`navigation.replace(...)`** reemplaza la pantalla actual en el historial — el botón "atrás" del sistema **no** te trae de vuelta.
**`navigation.navigate(...)`** apila — el botón "atrás" te lleva a la pantalla anterior.

Aplicado correctamente en:

| Acción | Método | Razón |
|---|---|---|
| Post-login exitoso → ir a tabs | `replace('StudentTabs')` | El usuario NO debería poder volver al login con el back físico |
| Post-logout → ir a Login | `replace('Login')` | El usuario NO debería poder volver a la sesión cerrada con back |
| Abrir detalle de incidencia | `navigate('IncidentDetail', {...})` | El back debe volver a la lista |
| Abrir form de nueva incidencia | `navigate('CreateIncident')` | El back debe volver a Home |

**Archivos afectados:**
- [`src/screens/auth/LoginScreen.tsx:96`](src/screens/auth/LoginScreen.tsx)
- [`src/screens/student/ProfileScreen.tsx:76`](src/screens/student/ProfileScreen.tsx)
- [`src/screens/manager/ManagerProfileScreen.tsx:93`](src/screens/manager/ManagerProfileScreen.tsx)
- [`src/screens/maintenance/MaintenanceProfileScreen.tsx:96`](src/screens/maintenance/MaintenanceProfileScreen.tsx)

---

## 2. Aclaración técnica importante — Clase 8

**El proyecto usa React Navigation v7, NO Expo Router.**

| Punto Clase 8 | Aplicado | Comentario |
|---|---|---|
| `"main": "expo-router/entry"` en `package.json` | ❌ | Sigue siendo `index.ts` (entry de React Navigation) |
| Carpeta `app/` con file-based routing | ❌ | El proyecto usa carpeta `src/screens/` |
| `_layout.tsx` por carpeta | ❌ | Se usa `AppNavigator.tsx` con `<Stack.Navigator>` |
| Route Groups `(auth)`, `(tabs)` | ❌ | Agrupación lógica vía carpetas `src/screens/auth/`, `src/screens/student/` |
| `router.push` / `router.replace` | ❌ | Se usa `navigation.navigate` / `navigation.replace` (equivalente semántico) |
| Rutas dinámicas `[id].tsx` | ❌ | Params se pasan en el segundo argumento de `navigation.navigate` |
| `<Redirect />` declarativo | ❌ | Redirects imperativos con `navigation.replace` |

**¿Por qué no se migró?**

La migración de React Navigation → Expo Router implica:
1. Reestructurar 21 screens en `app/` con file-based routing.
2. Recrear el `CustomTabBar` (con el FAB central de scan QR) en `_layout.tsx` de tabs.
3. Traducir las 45 llamadas a `navigation.*` a `router.*`.
4. Reconfigurar deep links / route params.
5. Refactorizar el sistema de tabs anidados dentro del Stack raíz.

Es **una sesión dedicada** de refactoring, no algo que se puede hacer al pasar sin alto riesgo de romper algo sutil. El proyecto se inició con el patrón React Navigation antes de ver la Clase 8, y la migración queda como **deuda técnica documentada** (ver sección 4).

**Lo importante:** los conceptos de Clase 8 (semántica de `push` vs `replace`, tipado de rutas, separación de stack / tabs, navegación centralizada en un layout) **sí están aplicados**, pero con la API de React Navigation. La semántica es equivalente:

| Expo Router | React Navigation |
|---|---|
| `router.push('/profile')` | `navigation.navigate('Profile')` |
| `router.replace('/(tabs)')` | `navigation.replace('Tabs')` |
| `router.back()` | `navigation.goBack()` |
| `useLocalSearchParams()` | `route.params` |
| `(auth)/_layout.tsx` | `<Stack.Navigator>` con grupo de screens |

---

## 3. Cambios aplicados en esta auditoría

### 3.1 Creación de `constants/` raíz

**Archivos nuevos:**
- `constants/colors.ts` — paleta `COLORS` completa (light theme institucional).
- `constants/fonts.ts` — tokens tipográficos `FONTS` (familias IBM Plex, sizes, lineHeights, tracking).
- `constants/api.ts` — `API_URL` placeholder y `API_TIMEOUT_MS`.

**Archivos eliminados:** `src/theme/colors.ts`, `src/theme/typography.ts` (reemplazados por los de arriba).

**Imports migrados:** 26 archivos refactorizados. Convención de naming actualizada (`colors` → `COLORS`, `typography.fontFamily.X` → `FONTS.family.X`).

### 3.2 Creación de `src/types/navigation.ts`

**Archivo nuevo:** define `RootStackParamList`, `StudentTabParamList`, `ManagerTabParamList`, `MaintenanceTabParamList` y los helpers `RootStackScreenProps<T>`, `<Kind>TabScreenProps<T>`.

**Impacto:** 22 screens dejaron de usar `({ navigation }: any)` y ahora declaran su tipo propio derivado de los helpers centralizados.

### 3.3 Split de estilos a archivos `.styles.ts`

**Archivos nuevos:** 25 archivos `.styles.ts` (uno por componente y por screen).

**Impacto:** Los archivos `.tsx` perdieron ~50% de líneas en promedio. La carga cognitiva al leer una screen bajó significativamente.

### 3.4 Conversión `interface` → `type`

- `TopAppBarProps`, `IncidentCardProps`: `interface` → `type`.
- `StatusBadgeProps`: extraído del inline `{ status }: { status: Status }` a un tipo nombrado.

### 3.5 Corrección de semántica `navigate` → `replace`

Fix de bug de UX en:
- `LoginScreen` post-autenticación.
- 3 Profile screens en flow de logout.

---

## 4. Deuda técnica detectada (NO resuelta)

### 4.1 Migración a Expo Router

Detallada en sección 2. Trabajo grande, planificado para una sesión dedicada cuando el resto del proyecto esté más estable.

### 4.2 Mock data hardcodeada en screens

Cada screen tiene su array de datos mock (`const incidentes = [{...}, ...]`) hardcodeado al tope del archivo. Idealmente:

- Moverlos a `src/mocks/` o `src/data/`.
- Reemplazarlos por llamadas reales a la API una vez que el backend Spring esté en aire.

Hoy convive con el desarrollo paralelo del back; cuando el back tenga endpoints estables, se reemplaza.

### 4.3 Componentización profunda

Hay patrones que se repiten inline en varias screens y podrían ser componentes reutilizables:

| Patrón | Apariciones |
|---|---|
| Stats bar (3 stats con divisores) | 7 |
| Filter chips | 4 |
| Section header con "Ver todas" | 5 |
| Primary button | 9 |
| Menu item (Profile screens) | 3 × ~5 |
| Logout button | 3 |

Refactorizar suma ~10 componentes nuevos pero queda fuera del alcance de esta auditoría.

### 4.4 Tipos de dominio (`Incident`, `Task`, `User`)

Hoy los tipos `Incident` y `Task` en `src/types/navigation.ts` están como `any` con un comentario `// TODO`. Esperan la definición del schema del backend Spring para tener interfaces correctas.

### 4.5 Integración con backend

`constants/api.ts` tiene `API_URL = ''`. Cuando el backend Spring esté operativo en `:8080`, se completa con la lógica platform-aware (iOS simulator usa `localhost`, Android emulator usa `10.0.2.2`, físico usa la IP LAN del dev).

---

## 5. Comandos útiles

### Setup inicial después de clonar

```bash
git clone https://github.com/solucionesdorvia/OperoFrontend.git
cd OperoFrontend
npm install
```

### Correr en Expo Go

```bash
npx expo start --lan --clear    # mismo WiFi entre Mac y celu
npx expo start --tunnel --clear # cualquier red (más lento, usa ngrok)
```

### Validar typecheck

```bash
npx tsc --noEmit
```

Debe devolver sin output (cero errores).

### Validar bundle

```bash
npx expo export --platform ios --output-dir /tmp/out
```

Debe terminar con `Exported: /tmp/out`.

---

## 6. Estructura final del repo

```
OperoFrontend/
├── App.tsx                          ← entry point, useFonts + SplashScreen
├── app.json                         ← Expo config (light theme, plugins)
├── package.json                     ← deps (Expo 54, RN 0.81, RNav v7, IBM Plex)
├── index.ts                         ← registerRootComponent
├── tsconfig.json
│
├── assets/                          ← iconos, splash, logo
│
├── constants/                       ← Clase 7: globals inmutables
│   ├── api.ts
│   ├── colors.ts                    ← COLORS
│   └── fonts.ts                     ← FONTS
│
├── design/                          ← mockups HTML (referencia interna)
│
└── src/
    ├── components/                  ← Componentes reutilizables (3)
    │   ├── IncidentCard.tsx
    │   ├── IncidentCard.styles.ts
    │   ├── StatusBadge.tsx
    │   ├── StatusBadge.styles.ts
    │   ├── TopAppBar.tsx
    │   └── TopAppBar.styles.ts
    │
    ├── navigation/                  ← AppNavigator + tabs custom
    │   ├── AppNavigator.tsx
    │   └── AppNavigator.styles.ts
    │
    ├── screens/                     ← 21 screens organizadas por rol
    │   ├── auth/        (3)         ← Onboarding, Login, Register
    │   ├── student/     (7)         ← Home, MyIncidents, Detail, Create, ScanQR, Notifications, Profile
    │   ├── manager/     (6)         ← Dashboard, IncidentsList, Detail, MyTeam, DepartmentSettings, Profile
    │   ├── maintenance/ (4)         ← Home, History, Detail, Profile
    │   └── common/      (1)         ← EditProfile
    │
    └── types/
        └── navigation.ts            ← RootStackParamList + helpers
```
