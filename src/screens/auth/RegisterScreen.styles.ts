import { StyleSheet } from 'react-native';
import { COLORS } from '../../../constants/colors';
import { FONTS } from '../../../constants/fonts';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flexGrow: 1, padding: 28, gap: 32 },
  header: { gap: 8, paddingTop: 8 },
  logo: { width: 36, height: 36, tintColor: COLORS.text },
  title: { fontSize: FONTS.size['2xl'], fontFamily: FONTS.family.display, color: COLORS.onSurface, letterSpacing: -0.3 },
  sub: { fontSize: 13, fontFamily: FONTS.family.mono, color: COLORS.textMuted },
  form: { gap: 20 },
  field: { gap: 8 },
  label: { fontSize: 13, fontFamily: FONTS.family.bodyMedium, color: COLORS.onSurfaceVariant },
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
  loginRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  loginText: { fontSize: 13, color: COLORS.onSurfaceVariant },
  loginLink: { fontSize: 13, fontFamily: FONTS.family.bodySemiBold, color: COLORS.primary },
});
