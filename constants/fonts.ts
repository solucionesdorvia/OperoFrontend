// IBM Plex Sans + Mono · familias, tamaños, lineHeights y letterSpacing centralizados.
// Convención: FONTS en mayúsculas.

export const FONTS = {
  family: {
    display:       'IBMPlexSans_600SemiBold',
    displayItalic: 'IBMPlexSans_600SemiBold_Italic',

    body:          'IBMPlexSans_400Regular',
    bodyLight:     'IBMPlexSans_300Light',
    bodyMedium:    'IBMPlexSans_500Medium',
    bodySemiBold:  'IBMPlexSans_600SemiBold',
    bodyBold:      'IBMPlexSans_700Bold',

    mono:          'IBMPlexMono_400Regular',
    monoMedium:    'IBMPlexMono_500Medium',
    monoSemiBold:  'IBMPlexMono_600SemiBold',
    monoBold:      'IBMPlexMono_700Bold',
  },
  size: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 16,
    lg: 18,
    xl: 22,
    '2xl': 28,
    '3xl': 36,
    '4xl': 48,
    hero: 56,
  },
  lineHeight: {
    tight: 1.15,
    snug: 1.3,
    normal: 1.5,
    relaxed: 1.7,
  },
  tracking: {
    label: 1.2,
    caps:  1.5,
    wide:  2,
  },
} as const;
