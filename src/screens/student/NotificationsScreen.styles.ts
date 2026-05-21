import { StyleSheet } from 'react-native';
import { COLORS } from '../../../constants/colors';
import { FONTS } from '../../../constants/fonts';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: 20, gap: 16 },

  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: 8, gap: 12,
  },
  title: { fontSize: 22, fontFamily: FONTS.family.display, color: COLORS.onSurface, letterSpacing: -0.3 },
  sub: { fontSize: 12, fontFamily: FONTS.family.mono, color: COLORS.textMuted, marginTop: 2 },
  clearBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 10, paddingVertical: 7,
    borderRadius: 6, borderWidth: 1, borderColor: COLORS.outlineVariant,
  },
  clearText: { fontSize: 11, fontFamily: FONTS.family.bodyMedium, color: COLORS.onSurface },

  filtersScroll: { marginHorizontal: -20 },
  filters: { flexDirection: 'row', gap: 8, paddingHorizontal: 20 },
  filterBtn: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 6,
    borderWidth: 1, borderColor: COLORS.outlineVariant,
  },
  filterBtnActive: { backgroundColor: COLORS.surfaceContainerHigh, borderColor: COLORS.outline },
  filterText: { fontSize: 12, fontFamily: FONTS.family.bodyMedium, color: COLORS.onSurfaceVariant },
  filterTextActive: { color: COLORS.onSurface, fontFamily: FONTS.family.bodySemiBold },

  empty: {
    alignItems: 'center', gap: 10, paddingVertical: 40,
  },
  emptyText: { fontSize: 13, color: COLORS.onSurfaceVariant },

  list: { gap: 8 },
  card: {
    flexDirection: 'row', gap: 12,
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 8, borderWidth: 1, borderColor: COLORS.outlineVariant,
    padding: 14,
  },
  cardUnread: { borderColor: COLORS.outline, backgroundColor: COLORS.surfaceContainer },
  iconWrap: {
    width: 36, height: 36, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  cardBody: { flex: 1, gap: 3 },
  cardTop: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8,
  },
  cardTitle: { fontSize: 13, fontFamily: FONTS.family.bodySemiBold, color: COLORS.onSurface, flex: 1 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: COLORS.primary },
  cardSub: { fontSize: 12, color: COLORS.onSurfaceVariant, lineHeight: 18 },
  cardTime: { fontSize: 11, fontFamily: FONTS.family.mono, color: COLORS.textMuted, marginTop: 4 },
});
