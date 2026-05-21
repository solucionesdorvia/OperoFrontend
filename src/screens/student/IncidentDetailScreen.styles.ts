import { StyleSheet } from 'react-native';
import { COLORS } from '../../../constants/colors';
import { FONTS } from '../../../constants/fonts';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: 20, paddingBottom: 40, gap: 24 },

  header: { gap: 10 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  id: { fontSize: 12, color: COLORS.onSurfaceVariant, fontFamily: FONTS.family.bodyMedium },
  title: { fontSize: 20, fontFamily: FONTS.family.display, color: COLORS.onSurface, lineHeight: 28, letterSpacing: -0.2 },

  infoCard: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 8, borderWidth: 1, borderColor: COLORS.outlineVariant,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 13 },
  infoLabel: { fontSize: 13, color: COLORS.onSurfaceVariant, width: 80 },
  infoValue: { flex: 1, fontSize: 13, color: COLORS.onSurface, fontFamily: FONTS.family.bodyMedium, textAlign: 'right' },
  divider: { height: 1, backgroundColor: COLORS.outlineVariant, marginHorizontal: 13 },

  section: { gap: 12 },
  sectionTitle: { fontSize: 11, fontFamily: FONTS.family.monoSemiBold, color: COLORS.text, textTransform: 'uppercase', letterSpacing: FONTS.tracking.caps },
  desc: { fontSize: 13, color: COLORS.onSurfaceVariant, lineHeight: 20 },

  photoPlaceholder: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 8, borderWidth: 1, borderColor: COLORS.outlineVariant,
    padding: 16,
  },
  photoLabel: { fontSize: 12, color: COLORS.onSurfaceVariant },

  timeline: {},
  timelineItem: { flexDirection: 'row', gap: 14 },
  timelineLeft: { alignItems: 'center', width: 20 },
  timelineDot: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 1, borderColor: COLORS.outline,
    backgroundColor: COLORS.surfaceContainerLow,
    alignItems: 'center', justifyContent: 'center', zIndex: 1,
  },
  dotDone: { backgroundColor: COLORS.primaryContainer, borderColor: COLORS.primary },
  dotCurrent: { backgroundColor: COLORS.primary, borderColor: 'transparent' },
  timelineLine: { flex: 1, width: 1, backgroundColor: COLORS.outlineVariant, marginVertical: 3 },
  timelineText: { flex: 1, gap: 2 },
  timelineStep: { fontSize: 13, fontFamily: FONTS.family.bodySemiBold, color: COLORS.onSurface },
  timelineTime: { fontSize: 12, color: COLORS.onSurfaceVariant },

  actions: { flexDirection: 'row', gap: 12 },
  btnSecondary: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 14, borderRadius: 8,
    borderWidth: 1, borderColor: COLORS.outlineVariant,
  },
  btnSecondaryText: { fontSize: 13, fontFamily: FONTS.family.bodySemiBold, color: COLORS.onSurface },
  btnPrimary: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 14, borderRadius: 8, backgroundColor: COLORS.primary,
  },
  btnPrimaryText: { fontSize: 12, fontFamily: FONTS.family.monoSemiBold, color: COLORS.onPrimary, textTransform: 'uppercase', letterSpacing: FONTS.tracking.caps },

  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'flex-end',
    paddingTop: 60,
    paddingRight: 16,
  },
  menu: {
    minWidth: 200,
    backgroundColor: COLORS.surfaceContainerHigh,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 13, paddingHorizontal: 14,
  },
  menuText: { fontSize: 13, fontFamily: FONTS.family.bodyMedium, color: COLORS.onSurface },
  menuDivider: { height: 1, backgroundColor: COLORS.outlineVariant, marginHorizontal: 10 },
});
