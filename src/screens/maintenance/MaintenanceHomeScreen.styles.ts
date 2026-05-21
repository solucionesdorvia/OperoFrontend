import { StyleSheet } from 'react-native';
import { COLORS } from '../../../constants/colors';
import { FONTS } from '../../../constants/fonts';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: 20, paddingBottom: 100, gap: 28 },

  header: { gap: 8, paddingTop: 8 },
  greeting: { fontSize: 24, fontFamily: FONTS.family.display, color: COLORS.onSurface, letterSpacing: -0.3 },
  statsRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stat: { fontSize: 13, color: COLORS.onSurfaceVariant },
  statNum: { fontSize: 13, fontFamily: FONTS.family.bodySemiBold, color: COLORS.onSurface },
  sep: { color: COLORS.outline, fontSize: 13 },

  section: { gap: 14 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 11, fontFamily: FONTS.family.monoSemiBold, color: COLORS.text, textTransform: 'uppercase', letterSpacing: FONTS.tracking.caps },
  seeAll: { fontSize: 12, color: COLORS.primary },
  list: { gap: 8 },

  taskCard: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 8, borderWidth: 1, borderColor: COLORS.outlineVariant,
    flexDirection: 'row', overflow: 'hidden',
  },
  priorityBar: { width: 3 },
  taskBody: { flex: 1, padding: 14, gap: 8 },
  taskTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priorityTag: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  priorityLabel: { fontSize: 11, fontFamily: FONTS.family.bodyMedium },
  taskCode: { fontSize: 11, color: COLORS.onSurfaceVariant },
  taskTitle: { fontSize: 14, fontFamily: FONTS.family.bodySemiBold, color: COLORS.onSurface, lineHeight: 20 },
  taskMeta: { flexDirection: 'row', gap: 16 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, fontFamily: FONTS.family.mono, color: COLORS.textMuted },

  quickRow: { flexDirection: 'row', gap: 8 },
  quickCard: {
    flex: 1, backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 8, borderWidth: 1, borderColor: COLORS.outlineVariant,
    padding: 14, gap: 10, flexDirection: 'row', alignItems: 'center',
  },
  quickType: { fontSize: 11, color: COLORS.onSurfaceVariant },
  quickTitle: { fontSize: 13, fontFamily: FONTS.family.bodySemiBold, color: COLORS.onSurface },

  featuredCard: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 8, borderWidth: 1, borderColor: COLORS.outlineVariant,
    padding: 16, gap: 12,
  },
  featuredHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  featuredTag: { fontSize: 11, color: COLORS.primary, marginBottom: 4 },
  featuredTitle: { fontSize: 16, fontFamily: FONTS.family.bodyBold, color: COLORS.onSurface, letterSpacing: -0.2 },
  featuredDesc: { fontSize: 13, color: COLORS.onSurfaceVariant, lineHeight: 19 },
  startBtn: {
    alignSelf: 'flex-start',
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.primary, borderRadius: 6,
    paddingHorizontal: 14, paddingVertical: 9,
  },
  startBtnText: { fontSize: 12, fontFamily: FONTS.family.monoSemiBold, color: COLORS.onPrimary, textTransform: 'uppercase', letterSpacing: FONTS.tracking.caps },
});
