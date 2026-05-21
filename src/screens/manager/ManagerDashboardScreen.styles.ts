import { StyleSheet } from 'react-native';
import { COLORS } from '../../../constants/colors';
import { FONTS } from '../../../constants/fonts';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: 20, paddingBottom: 100, gap: 28 },

  header: { gap: 4, paddingTop: 8 },
  greeting: { fontSize: 22, fontFamily: FONTS.family.display, color: COLORS.onSurface, letterSpacing: -0.3 },
  sub: { fontSize: 13, fontFamily: FONTS.family.mono, color: COLORS.textMuted },

  statsBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 8, borderWidth: 1, borderColor: COLORS.outlineVariant,
  },
  statItem: { flex: 1, alignItems: 'center', paddingVertical: 16, gap: 4 },
  statNum: { fontSize: 24, fontFamily: FONTS.family.monoSemiBold, color: COLORS.primary, letterSpacing: -0.5 },
  statLabel: { fontSize: 11, fontFamily: FONTS.family.mono, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: FONTS.tracking.caps },
  statSep: { width: 1, backgroundColor: COLORS.outlineVariant, marginVertical: 12 },

  section: { gap: 14 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 11, fontFamily: FONTS.family.monoSemiBold, color: COLORS.text, textTransform: 'uppercase', letterSpacing: FONTS.tracking.caps },
  seeAll: { fontSize: 12, color: COLORS.primary },
  list: { gap: 8 },

  card: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 8, borderWidth: 1, borderColor: COLORS.outlineVariant,
    flexDirection: 'row', overflow: 'hidden',
  },
  priorityBar: { width: 3 },
  cardBody: { flex: 1, padding: 13, gap: 8 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  cardTitle: { flex: 1, fontSize: 14, fontFamily: FONTS.family.bodySemiBold, color: COLORS.onSurface },
  cardTime: { fontSize: 11, fontFamily: FONTS.family.mono, color: COLORS.textMuted },
  cardMeta: { flexDirection: 'row', gap: 14 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 11, fontFamily: FONTS.family.mono, color: COLORS.textMuted },
});
