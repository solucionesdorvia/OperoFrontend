import { StyleSheet } from 'react-native';
import { COLORS } from '../../../constants/colors';
import { FONTS } from '../../../constants/fonts';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: 20, paddingBottom: 160, gap: 20 },

  header: { gap: 10 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priorityTag: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  priorityDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.error },
  priorityText: { fontSize: 12, color: COLORS.error, fontFamily: FONTS.family.bodyMedium },
  id: { fontSize: 12, color: COLORS.onSurfaceVariant },
  title: { fontSize: 20, fontFamily: FONTS.family.display, color: COLORS.onSurface, lineHeight: 28, letterSpacing: -0.2 },

  infoCard: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
    overflow: 'hidden',
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 13 },
  infoLabel: { fontSize: 13, color: COLORS.onSurfaceVariant, width: 80 },
  infoValue: { flex: 1, fontSize: 13, color: COLORS.onSurface, fontFamily: FONTS.family.bodyMedium, textAlign: 'right' },
  divider: {
    height: 1,
    backgroundColor: COLORS.outlineVariant,
    opacity: 0.5,
  },

  mapPlaceholder: {
    height: 100, backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 8, borderWidth: 1, borderColor: COLORS.outlineVariant,
    alignItems: 'center', justifyContent: 'center', gap: 8,
    flexDirection: 'row',
  },
  mapLabel: { fontSize: 13, color: COLORS.onSurfaceVariant },

  section: { gap: 10 },
  sectionTitle: { fontSize: 11, fontFamily: FONTS.family.monoSemiBold, color: COLORS.text, textTransform: 'uppercase', letterSpacing: FONTS.tracking.caps },
  desc: { fontSize: 13, color: COLORS.onSurfaceVariant, lineHeight: 20 },

  warningBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: COLORS.surfaceContainerHigh,
    borderRadius: 8, padding: 14,
    borderLeftWidth: 3, borderLeftColor: COLORS.primary,
  },
  warningText: { flex: 1, fontSize: 13, color: COLORS.onSurface },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 20, paddingBottom: 36, gap: 10,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1, borderTopColor: COLORS.outlineVariant,
  },
  startBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: COLORS.primary, borderRadius: 8, paddingVertical: 15,
  },
  startBtnText: { fontSize: 12, fontFamily: FONTS.family.monoSemiBold, color: COLORS.onPrimary, textTransform: 'uppercase', letterSpacing: FONTS.tracking.caps },
  finishBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    borderWidth: 1, borderColor: COLORS.outlineVariant,
    borderRadius: 8, paddingVertical: 15,
  },
  finishBtnText: { fontSize: 14, fontFamily: FONTS.family.bodySemiBold, color: COLORS.onSurface },
});
