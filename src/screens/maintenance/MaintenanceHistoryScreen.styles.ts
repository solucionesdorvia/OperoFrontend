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

  statsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 8, borderWidth: 1, borderColor: COLORS.outlineVariant,
  },
  stat: { flex: 1, alignItems: 'center', paddingVertical: 14, gap: 3 },
  statNum: { fontSize: 18, fontFamily: FONTS.family.monoSemiBold, color: COLORS.primary, letterSpacing: -0.5 },
  statLabel: { fontSize: 11, fontFamily: FONTS.family.mono, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: FONTS.tracking.caps },
  statDivider: { width: 1, backgroundColor: COLORS.outlineVariant, marginVertical: 10 },

  list: { gap: 8 },
  card: {
    flexDirection: 'row', gap: 12,
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 8, borderWidth: 1, borderColor: COLORS.outlineVariant,
    padding: 14,
  },
  iconWrap: {
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: COLORS.primaryContainer,
    alignItems: 'center', justifyContent: 'center',
  },
  cardBody: { flex: 1, gap: 6 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  code: { fontSize: 11, fontFamily: FONTS.family.monoMedium, color: COLORS.onSurfaceVariant },
  date: { fontSize: 11, color: COLORS.onSurfaceVariant },
  cardTitle: { fontSize: 14, fontFamily: FONTS.family.bodySemiBold, color: COLORS.onSurface, lineHeight: 20 },
  meta: { flexDirection: 'row', gap: 14, flexWrap: 'wrap' },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4, flexShrink: 1 },
  metaText: { fontSize: 12, fontFamily: FONTS.family.mono, color: COLORS.textMuted },
});
