import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { FONTS } from '../../constants/fonts';

export const styles = StyleSheet.create({
  // Indicador flotante de "sin conexión" — pegado abajo, sobre el contenido.
  banner: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 90,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: COLORS.primaryDim,
    zIndex: 1000,
  },
  bannerText: {
    fontSize: 12,
    fontFamily: FONTS.family.bodyMedium,
    color: COLORS.onPrimary,
    textAlign: 'center',
  },

  // Modal "¿Subir incidencia?"
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 26, 46, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 8,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontFamily: FONTS.family.bodySemiBold,
    color: COLORS.onSurface,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: FONTS.family.body,
    color: COLORS.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 19,
  },

  actions: { flexDirection: 'row', gap: 10, marginTop: 16, alignSelf: 'stretch' },
  btnSecondary: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.outline,
  },
  btnSecondaryText: {
    fontSize: 13,
    fontFamily: FONTS.family.bodyMedium,
    color: COLORS.onSurface,
  },
  btnPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 13,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
  },
  btnPrimaryText: {
    fontSize: 13,
    fontFamily: FONTS.family.bodySemiBold,
    color: COLORS.onPrimary,
  },
});
