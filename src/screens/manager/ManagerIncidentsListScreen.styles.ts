import { StyleSheet } from 'react-native';
import { COLORS } from '../../../constants/colors';
import { FONTS } from '../../../constants/fonts';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: 20, gap: 16 },

  header: { gap: 4, paddingTop: 8 },
  title: { fontSize: 22, fontFamily: FONTS.family.display, color: COLORS.onSurface, letterSpacing: -0.3 },
  sub: { fontSize: 13, fontFamily: FONTS.family.mono, color: COLORS.textMuted },

  filtersScroll: { marginHorizontal: -20 },
  filters: { flexDirection: 'row', gap: 8, paddingHorizontal: 20 },
  filterBtn: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 6,
    borderWidth: 1, borderColor: COLORS.outlineVariant,
  },
  filterBtnActive: { backgroundColor: COLORS.surfaceContainerHigh, borderColor: COLORS.outline },
  filterText: { fontSize: 12, fontFamily: FONTS.family.bodyMedium, color: COLORS.onSurfaceVariant },
  filterTextActive: { color: COLORS.onSurface, fontFamily: FONTS.family.bodySemiBold },

  list: { gap: 8 },
  card: {
    flexDirection: 'row', overflow: 'hidden',
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 8, borderWidth: 1, borderColor: COLORS.outlineVariant,
  },
  priorityBar: { width: 3 },
  cardBody: { flex: 1, padding: 13, gap: 8 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  code: { fontSize: 11, fontFamily: FONTS.family.monoMedium, color: COLORS.onSurfaceVariant },
  cardTitle: { fontSize: 14, fontFamily: FONTS.family.bodySemiBold, color: COLORS.onSurface, lineHeight: 20 },
  meta: { flexDirection: 'row', gap: 14 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, fontFamily: FONTS.family.mono, color: COLORS.textMuted, flexShrink: 1 },
  footer: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: 6,
    borderTopWidth: 1, borderTopColor: COLORS.outlineVariant,
  },
  assignee: { fontSize: 12, color: COLORS.onSurface, fontFamily: FONTS.family.bodyMedium },
  time: { fontSize: 11, color: COLORS.onSurfaceVariant },
});
