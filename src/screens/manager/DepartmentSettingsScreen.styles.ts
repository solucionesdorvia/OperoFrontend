import { StyleSheet } from 'react-native';
import { COLORS } from '../../../constants/colors';
import { FONTS } from '../../../constants/fonts';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: 20, paddingBottom: 120, gap: 24 },

  hero: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 8, borderWidth: 1, borderColor: COLORS.outlineVariant,
    padding: 16,
  },
  heroIcon: {
    width: 46, height: 46, borderRadius: 10,
    backgroundColor: COLORS.primaryContainer,
    alignItems: 'center', justifyContent: 'center',
  },
  heroTitle: { fontSize: 15, fontFamily: FONTS.family.bodyBold, color: COLORS.onSurface },
  heroSub: { fontSize: 12, color: COLORS.onSurfaceVariant },

  section: { gap: 14 },
  sectionTitle: { fontSize: 11, fontFamily: FONTS.family.monoSemiBold, color: COLORS.text, textTransform: 'uppercase', letterSpacing: FONTS.tracking.caps },

  field: { gap: 8 },
  label: { fontSize: 13, fontFamily: FONTS.family.bodyMedium, color: COLORS.onSurfaceVariant },
  input: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderWidth: 1, borderColor: COLORS.outlineVariant,
    borderRadius: 8, paddingHorizontal: 16, paddingVertical: 13,
    color: COLORS.onSurface, fontSize: 14,
  },
  textarea: { minHeight: 96, paddingTop: 13 },

  toggleRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 8, borderWidth: 1, borderColor: COLORS.outlineVariant,
    padding: 14,
  },
  toggleLabel: { fontSize: 14, fontFamily: FONTS.family.bodySemiBold, color: COLORS.onSurface },
  toggleHint: { fontSize: 12, color: COLORS.onSurfaceVariant, marginTop: 2 },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 20, paddingBottom: 36,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1, borderTopColor: COLORS.outlineVariant,
  },
  saveBtn: {
    backgroundColor: COLORS.primary, borderRadius: 8,
    paddingVertical: 15, alignItems: 'center',
  },
  saveText: { fontSize: 12, fontFamily: FONTS.family.monoSemiBold, color: COLORS.onPrimary, textTransform: 'uppercase', letterSpacing: FONTS.tracking.caps },
});
