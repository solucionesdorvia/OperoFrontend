// Paleta institucional — Academic Operations · light theme · navy primary.
// Convención: COLORS en mayúsculas, valores reutilizables centralizados.

const palette = {
  bg:            '#FFFFFF',
  bgLow:         '#F4F7FB',
  surface:       '#FFFFFF',
  surfaceHigh:   '#F4F7FB',
  surfaceHigher: '#EEF2F7',

  primary:       '#1E3A5F',
  primaryDim:    '#0F1A2E',
  primaryHigh:   '#2D5489',

  text:          '#0F1A2E',
  textMuted:     '#5A6478',
  textInverse:   '#FFFFFF',

  success:       '#0F8C7E',
  successDim:    '#0A6E64',
  warning:       '#B45309',
  warningDim:    '#8C4108',
  danger:        '#B91C1C',
  dangerDim:     '#911616',
  info:          '#5A4FCF',
  infoDim:       '#46399E',

  outline:        '#DDE3EB',
  outlineSubtle:  '#EEF2F7',
  outlineStrong:  '#C5CFDD',

  primaryTint:   '#EEF2F7',
  successTint:   '#E6F4F2',
  warningTint:   '#FDF1E1',
  dangerTint:    '#FEE2E2',
  infoTint:      '#ECE9FA',
} as const;

export const COLORS = {
  // M3 legacy API (preservada — los componentes pueden seguir usando estos nombres)
  background:              palette.bg,
  surface:                 palette.bg,
  surfaceContainerLowest:  palette.bg,
  surfaceContainerLow:     palette.surfaceHigh,
  surfaceContainer:        palette.surfaceHigh,
  surfaceContainerHigh:    palette.surfaceHigher,
  surfaceContainerHighest: palette.surfaceHigher,
  surfaceBright:           palette.bg,
  surfaceVariant:          palette.surfaceHigh,
  surfaceDim:              palette.surfaceHigh,

  primary:              palette.primary,
  primaryContainer:     palette.primaryTint,
  primaryFixedDim:      palette.primaryDim,
  onPrimary:            palette.textInverse,
  onPrimaryContainer:   palette.primary,

  onSurface:            palette.text,
  onBackground:         palette.text,
  onSurfaceVariant:     palette.textMuted,

  secondary:            palette.primaryDim,
  secondaryContainer:   palette.surfaceHigher,
  onSecondary:          palette.textInverse,
  onSecondaryContainer: palette.primary,

  error:                palette.danger,
  errorContainer:       palette.dangerTint,
  onError:              palette.textInverse,
  onErrorContainer:     palette.danger,

  outline:              palette.outline,
  outlineVariant:       palette.outlineSubtle,

  tertiary:             palette.info,
  tertiaryContainer:    palette.infoTint,
  onTertiary:           palette.textInverse,
  inverseSurface:       palette.text,
  inverseOnSurface:     palette.textInverse,
  inversePrimary:       palette.primaryHigh,

  // Tokens semánticos
  bg:            palette.bg,
  bgLow:         palette.bgLow,
  surfaceHigh:   palette.surfaceHigh,
  surfaceHigher: palette.surfaceHigher,

  primaryDim:    palette.primaryDim,
  primaryHigh:   palette.primaryHigh,
  primaryTint:   palette.primaryTint,

  text:          palette.text,
  textMuted:     palette.textMuted,
  textInverse:   palette.textInverse,

  success:       palette.success,
  successDim:    palette.successDim,
  successTint:   palette.successTint,
  warning:       palette.warning,
  warningDim:    palette.warningDim,
  warningTint:   palette.warningTint,
  danger:        palette.danger,
  dangerDim:     palette.dangerDim,
  dangerTint:    palette.dangerTint,
  info:          palette.info,
  infoDim:       palette.infoDim,
  infoTint:      palette.infoTint,

  outlineSubtle: palette.outlineSubtle,
  outlineStrong: palette.outlineStrong,

  // Estados de incidencias
  statusOpen:         palette.warning,
  statusInProgress:   palette.primary,
  statusResolved:     palette.success,
  statusClosed:       palette.textMuted,
  statusCritical:     palette.danger,
} as const;

export type ColorToken = keyof typeof COLORS;
