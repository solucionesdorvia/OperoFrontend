# Opero · Flow Map

Prototipo visual con todas las pantallas de la app móvil y sus flujos de navegación, estilo Figma. **Todo es diseño puro** (SVG vectorial), sin emojis ni imágenes externas.

## Contenido

- `flow-map.html` — Canvas interactivo con ~20 pantallas agrupadas por rol y flechas conectando los flujos.

## Cómo usarlo

### 1. Navegación en el browser

Abrí `flow-map.html` con doble click.

**Controles:**
- **Arrastrar** — mover el canvas
- **Rueda del mouse** — zoom in/out
- **Reset** — vista inicial (zoom 70%)
- **Ajustar** — zoom out completo (ve todo el mapa)
- **Inspector** — activa modo overlay: al pasar el mouse sobre cada componente se resalta con outline punteado y aparece el nombre del componente (ej: `NotificationItem`, `TabItem`, `Card`, `Chip`...). Sirve para verificar visualmente que cada pieza es un componente nombrado, igual que en Figma.

### 2. Exportar todo (nuevo)

Hay dos opciones de export a imagen PNG de alta resolución (scale 3x):

- **Botón "Exportar todo"** (toolbar arriba-izquierda) → descarga **una PNG por cada pantalla** con nombre `opero-01-onboarding.png`, `opero-02-login.png`, etc. en orden.

- **Exportar una pantalla sola** → pasá el mouse sobre cualquier pantalla y aparece un ícono de descarga en la esquina superior derecha del frame. Hace click y te la baja.

Las PNGs salen con fondo transparente, listas para pegar directo en Figma, Notion, PowerPoint, etc.

### 3. Importar a Figma (sin perder layers)

Figma no permite crear archivos desde una API externa, pero hay un plugin gratuito que importa HTML conservando capas editables:

**Plugin: [html.to.design](https://www.figma.com/community/plugin/1159123024924461424/html-to-design)**

1. Nuevo archivo en Figma.
2. `Resources → Plugins → html.to.design` (instalalo desde Community si no lo tenés).
3. Elegí **"Import from HTML file"** y seleccioná `flow-map.html`.
4. El plugin convierte cada `.screen` en un Frame editable con textos, grupos, SVGs y colores del canvas.
5. Cada componente interno llega como un **layer nombrado** en Figma (gracias a los `data-component` atributos de cada pieza): `NotificationItem`, `NotificationIcon`, `TabItem`, `Card`, `Chip`, `Title`, `Subtitle`, `Avatar`, etc.
6. En modo **Prototype** de Figma conectás los frames según los flujos (documentados abajo).

### Componentes nombrados

Cada elemento visual tiene `data-component="NombreDelComponente"` para que:

- En el browser con **Inspector ON** se vean los nombres al hacer hover
- Al importar a Figma con html.to.design cada componente sea un layer con nombre útil

Lista de componentes auto-taggeados:

| Selector | Nombre de componente |
|---|---|
| `.screen` | `Screen` |
| `.topbar` | `TopBar` |
| `.brand-row` | `Logo` |
| `.tabbar` | `TabBar` |
| `.tabbar .t` | `TabItem` |
| `.tabbar .scan` | `TabScanFAB` |
| `.card` | `Card` |
| `.chip` | `Chip` |
| `.btn-primary` | `PrimaryButton` |
| `.btn-outline` | `OutlineButton` |
| `.fab` | `FAB` |
| `.stats`, `.stats .s` | `StatsBar`, `StatItem` |
| `.avatar-sm`, `.avatar-lg` | `Avatar`, `AvatarLarge` |
| `.notif-item` | `NotificationItem` |
| `.notif-icon` | `NotificationIcon` |
| `.notif-title` | `NotificationTitle` |
| `.notif-sub` | `NotificationMeta` |
| `.viewfinder` | `QRViewfinder` |
| `.switch` | `ToggleSwitch` |
| `.tl-row`, `.tl-dot` | `TimelineStep`, `TimelineDot` |

### 4. Alternativa: import como imágenes

Si no querés usar plugin, usá la opción **"Exportar todo"** del HTML y arrastrá las PNGs resultantes a un archivo de Figma en blanco. Cada imagen queda como un frame, y las conectás en modo Prototype normalmente.

## Sistema visual

Todas las pantallas usan los mismos tokens del tema real de la app (`src/theme/colors.ts`):

| Token | Uso |
|---|---|
| `#0C1521` background | Fondo de pantalla |
| `#101C2C / #141F2E / #192536` surfaces | Cards, inputs, contenedores |
| `#BBA978` primary | Logo, CTAs, íconos activos, stats destacadas |
| `#6B94AA` secondary | Finalizado, sub-flujos |
| `#8878C0` tertiary | Rol operario de mantenimiento |
| `#B06060` error | Abierto / crítico / logout |
| `#CDD8EA` onSurface | Texto principal |
| `#78899E` onSurfaceVariant | Texto secundario |

### Íconos (todos SVG, sin emojis)

Librería propia embebida en el `<defs>` del HTML con **33 símbolos** (stroke 1.75, line style tipo Material / Lucide):

`logo`, `bell`, `search`, `settings`, `location`, `clock`, `user`, `users`, `edit`, `lock`, `help`, `logout`, `calendar`, `refresh`, `chat`, `close`, `bolt`, `building`, `camera`, `tool`, `map`, `warn`, `check`, `check-circle`, `chevron`, `chevron-down`, `plus`, `play`, `image`, `qr`, `scanner`, `home`, `assignment`, `history`, `notifs`, `dashboard`, `swap`, `engineer`, `autorenew`, `download`, `fit`, `reset`, `mouse`, `electrical`.

### Logo de Opero

```svg
<svg viewBox="0 0 24 24">
  <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2.5"/>
  <circle cx="12" cy="12" r="3" fill="currentColor"/>
</svg>
```

Concepto: anillo + punto central = *"observación / foco del reporte"*. Monocromático, escala a cualquier tamaño, hereda `currentColor`.

## Flujos documentados

### Auth
- Onboarding → Login
- Login ↔ Register
- Login → StudentTabs / ManagerTabs / MaintenanceTabs

### Alumno / Profesor
- Home ↔ MyIncidents ↔ Notifications ↔ Profile (tabs)
- Home / MyIncidents / Notifications → IncidentDetail
- Home → CreateIncident (FAB)
- ScanQR (botón central) → CreateIncident (con ubicación pre-cargada)
- IncidentDetail → Editar / Eliminar
- Profile → EditProfile / Logout

### Gerente de Departamento
- Dashboard ↔ IncidentsList ↔ MyTeam ↔ Profile (tabs)
- Dashboard/List → ManagerIncidentDetail (asignar, prioridad, depto)
- Profile → MyTeam / DepartmentSettings / EditProfile / Logout

### Empleado de Mantenimiento
- Home ↔ History ↔ Profile (tabs)
- Home / History → Detail (Iniciar/Finalizar)
- Profile → EditProfile / History / Logout

## Mapa endpoint ↔ pantalla

| Endpoint | Pantalla |
|---|---|
| `POST /api/auth/login` | `Login` |
| `POST /api/auth/register` | `Register` |
| `GET /api/auth/me` | cabecera de los Profiles |
| `POST /api/incidents` | `CreateIncident` |
| `GET /api/incidents` (+ filtros) | `MyIncidents`, `ManagerIncidentsList`, `MaintenanceHome` |
| `GET /api/incidents/{id}` | `IncidentDetail` (x3) |
| `PUT /api/incidents/{id}` | `CreateIncident` en modo edit |
| `DELETE /api/incidents/{id}` | menú en `IncidentDetail` |
| `PATCH /api/incidents/{id}/status` | botones de `MaintenanceDetail` |
| `PATCH /api/incidents/{id}/assign` / `priority` / `department` | selectores en `ManagerIncidentDetail` |
| `GET /api/incidents/{id}/history` | timeline "Seguimiento" en `IncidentDetail` |
| `GET /api/users/me` | Profiles |
| `PUT /api/users/me` | `EditProfile` |
| `GET /api/users?departmentId` | `MyTeam` |
| `GET /api/departments` | grid en `CreateIncident` |
| `PUT /api/departments/{id}` | `DepartmentSettings` |

## Flujo vivo (app real)

```bash
cd frontend
npm install     # si hace falta
npx expo start  # escaneá el QR con Expo Go o abrí en web
```

Es el prototipo más fiel — navegación real entre pantallas con datos mock.
