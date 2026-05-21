import { StyleSheet } from 'react-native';
import { COLORS } from '../../../constants/colors';
import { FONTS } from '../../../constants/fonts';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: 20, paddingBottom: 120, gap: 22 },

  qrBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: COLORS.primaryContainer,
    borderRadius: 8, padding: 12,
    borderWidth: 1, borderColor: COLORS.primary,
  },
  qrIcon: {
    width: 36, height: 36, borderRadius: 8,
    backgroundColor: COLORS.background,
    alignItems: 'center', justifyContent: 'center',
  },
  qrTitle: { fontSize: 13, fontFamily: FONTS.family.bodySemiBold, color: COLORS.primary },
  qrSub: { fontSize: 11, color: COLORS.onPrimaryContainer, marginTop: 2 },

  field: { gap: 8 },
  label: { fontSize: 13, fontFamily: FONTS.family.bodyMedium, color: COLORS.onSurfaceVariant },
  input: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderWidth: 1, borderColor: COLORS.outlineVariant,
    borderRadius: 8, paddingHorizontal: 16, paddingVertical: 13,
    color: COLORS.onSurface, fontSize: 14,
  },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surfaceContainerLow,
    borderWidth: 1, borderColor: COLORS.outlineVariant,
    borderRadius: 8,
  },
  qrInlineBtn: {
    paddingHorizontal: 12, paddingVertical: 12,
    borderLeftWidth: 1, borderLeftColor: COLORS.outlineVariant,
  },

  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: -10 },
  chip: {
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 4, backgroundColor: COLORS.surfaceContainerHigh,
    borderWidth: 1, borderColor: COLORS.outlineVariant,
  },
  chipText: { fontSize: 11, fontFamily: FONTS.family.bodyMedium, color: COLORS.onSurface },

  textarea: { minHeight: 110, paddingTop: 13 },
  deptGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  deptBtn: {
    paddingHorizontal: 14, paddingVertical: 9,
    borderRadius: 6, borderWidth: 1, borderColor: COLORS.outlineVariant,
  },
  deptBtnActive: { backgroundColor: COLORS.surfaceContainerHigh, borderColor: COLORS.outline },
  deptText: { fontSize: 13, color: COLORS.onSurfaceVariant, fontFamily: FONTS.family.bodyMedium },
  deptTextActive: { color: COLORS.onSurface, fontFamily: FONTS.family.bodySemiBold },

  photoBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 14, paddingHorizontal: 16,
    borderRadius: 8, borderWidth: 1, borderColor: COLORS.outlineVariant,
    borderStyle: 'dashed',
  },
  photoBtnText: { fontSize: 13, color: COLORS.onSurfaceVariant },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 20, paddingBottom: 36,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1, borderTopColor: COLORS.outlineVariant,
  },
  submitBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: COLORS.primary, borderRadius: 8, paddingVertical: 15,
  },
  submitText: { fontSize: 12, fontFamily: FONTS.family.monoSemiBold, color: COLORS.onPrimary, textTransform: 'uppercase', letterSpacing: FONTS.tracking.caps },
});
