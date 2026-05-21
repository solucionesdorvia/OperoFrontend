import { StyleSheet } from 'react-native';
import { COLORS } from '../../../constants/colors';
import { FONTS } from '../../../constants/fonts';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: 20, gap: 22 },

  header: { gap: 8 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  id: { fontSize: 12, color: COLORS.onSurfaceVariant, fontFamily: FONTS.family.bodyMedium },
  title: { fontSize: 20, fontFamily: FONTS.family.display, color: COLORS.onSurface, lineHeight: 28, letterSpacing: -0.2 },
  location: { fontSize: 13, color: COLORS.onSurfaceVariant },

  photoPlaceholder: {
    height: 160, backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 8, borderWidth: 1, borderColor: COLORS.outlineVariant,
    alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  photoLabel: { fontSize: 12, color: COLORS.onSurfaceVariant },

  section: { gap: 10 },
  sectionTitle: { fontSize: 11, fontFamily: FONTS.family.monoSemiBold, color: COLORS.text, textTransform: 'uppercase', letterSpacing: FONTS.tracking.caps },
  desc: { fontSize: 13, color: COLORS.onSurfaceVariant, lineHeight: 20 },

  priorityBtns: { flexDirection: 'row', gap: 8 },
  priorityBtn: {
    flex: 1, paddingVertical: 11, borderRadius: 6, alignItems: 'center',
    borderWidth: 1, borderColor: COLORS.outlineVariant,
  },
  priorityBtnActive: { backgroundColor: COLORS.surfaceContainerHigh, borderColor: COLORS.outline },
  priorityBtnText: { fontSize: 13, fontFamily: FONTS.family.bodyMedium, color: COLORS.onSurfaceVariant },
  priorityBtnTextActive: { color: COLORS.onSurface, fontFamily: FONTS.family.bodySemiBold },

  select: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 8, borderWidth: 1, borderColor: COLORS.outlineVariant,
    paddingHorizontal: 16, paddingVertical: 13,
  },
  selectText: { fontSize: 14, color: COLORS.onSurface },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 20, paddingBottom: 36,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1, borderTopColor: COLORS.outlineVariant,
  },
  saveBtn: {
    backgroundColor: COLORS.primary, borderRadius: 8, paddingVertical: 15,
    alignItems: 'center',
  },
  saveBtnText: { fontSize: 14, fontFamily: FONTS.family.bodySemiBold, color: COLORS.onPrimary },
});
