import { StyleSheet } from 'react-native';
import { COLORS } from '../../../constants/colors';
import { FONTS } from '../../../constants/fonts';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 28, gap: 36 },

  brand: { alignItems: 'center', gap: 12 },
  logo: { width: 96, height: 96, tintColor: COLORS.text },
  wordmark: {
    fontSize: FONTS.size['2xl'], fontFamily: FONTS.family.monoBold, color: COLORS.primary,
    letterSpacing: FONTS.tracking.wide, textAlign: 'center', textTransform: 'uppercase',
  },
  tagline: {
    fontSize: 11, fontFamily: FONTS.family.mono, color: COLORS.textMuted,
    marginTop: -2, textAlign: 'center', letterSpacing: FONTS.tracking.label, textTransform: 'uppercase',
  },

  segmented: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 8,
    padding: 3,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
  },
  segment: {
    flex: 1, alignItems: 'center', paddingVertical: 9, borderRadius: 6,
  },
  segmentActive: { backgroundColor: COLORS.surfaceContainerHigh },
  segmentText: { fontSize: 13, fontFamily: FONTS.family.bodyMedium, color: COLORS.onSurfaceVariant },
  segmentTextActive: { color: COLORS.onSurface, fontFamily: FONTS.family.bodySemiBold },

  form: { gap: 20 },
  field: { gap: 8 },
  label: { fontSize: 13, fontFamily: FONTS.family.bodyMedium, color: COLORS.onSurfaceVariant },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  forgot: { fontSize: 12, color: COLORS.primary },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
  },
  input: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: COLORS.onSurface,
    fontSize: 14,
  },
  eyeBtn: { paddingHorizontal: 14 },

  submitBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 4,
  },
  submitText: { fontSize: 12, fontFamily: FONTS.family.monoSemiBold, color: COLORS.onPrimary, textTransform: 'uppercase', letterSpacing: FONTS.tracking.caps },

  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText: { fontSize: 13, color: COLORS.onSurfaceVariant },
  footerLink: { fontSize: 13, fontFamily: FONTS.family.bodySemiBold, color: COLORS.primary },
});
