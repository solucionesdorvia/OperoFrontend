import { StyleSheet } from 'react-native';
import { COLORS } from '../../../constants/colors';
import { FONTS } from '../../../constants/fonts';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: 20, gap: 32 },

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
