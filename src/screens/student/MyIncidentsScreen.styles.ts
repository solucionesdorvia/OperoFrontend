import { StyleSheet } from 'react-native';
import { COLORS } from '../../../constants/colors';
import { FONTS } from '../../../constants/fonts';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: 20, gap: 16, paddingBottom: 70 }, // Espacio mínimo para el FAB
  summary: { fontSize: 13, color: COLORS.onSurfaceVariant },
  filtersScroll: { marginHorizontal: -20 },
  filters: { flexDirection: 'row', gap: 8, paddingHorizontal: 20 },
  filterBtn: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 6,
    borderWidth: 1, borderColor: COLORS.outlineVariant,
  },
  filterBtnActive: { backgroundColor: COLORS.surfaceContainerHigh, borderColor: COLORS.outline },
  filterText: { fontSize: 12, fontFamily: FONTS.family.bodyMedium, color: COLORS.onSurfaceVariant },
  filterTextActive: { color: COLORS.onSurface, fontFamily: FONTS.family.bodySemiBold },
  dateBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 6,
    borderWidth: 1, borderColor: COLORS.outlineVariant,
  },
  dateBtnActive: { backgroundColor: COLORS.surfaceContainerHigh, borderColor: COLORS.outline },
  list: { gap: 8 },
  card: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 8, padding: 14, gap: 10,
    borderWidth: 1, borderColor: COLORS.outlineVariant,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
  cardInfo: { flex: 1, gap: 4 },
  cardTitle: { fontSize: 14, fontFamily: FONTS.family.bodySemiBold, color: COLORS.onSurface, lineHeight: 20 },
  cardLocation: { fontSize: 12, color: COLORS.onSurfaceVariant },
  cardMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center' },
  priorityTag: {
    backgroundColor: COLORS.errorContainer,
    borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3,
  },
  priorityText: { fontSize: 11, fontFamily: FONTS.family.bodyMedium, color: COLORS.error },
  metaText: { fontSize: 12, fontFamily: FONTS.family.mono, color: COLORS.textMuted },
  metaSub: { fontSize: 12, color: COLORS.primary },
  fab: {
    position: 'absolute', right: 20,
    height: 44, paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
    flexDirection: 'row', gap: 8,
  },
  fabText: { fontSize: 12, fontFamily: FONTS.family.monoSemiBold, color: COLORS.onPrimary, textTransform: 'uppercase', letterSpacing: FONTS.tracking.caps },
});
