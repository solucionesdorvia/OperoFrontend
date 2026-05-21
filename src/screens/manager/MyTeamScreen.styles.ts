import { StyleSheet } from 'react-native';
import { COLORS } from '../../../constants/colors';
import { FONTS } from '../../../constants/fonts';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: 20, gap: 18 },

  header: { gap: 4, paddingTop: 8 },
  title: { fontSize: 22, fontFamily: FONTS.family.display, color: COLORS.onSurface, letterSpacing: -0.3 },
  sub: { fontSize: 13, fontFamily: FONTS.family.mono, color: COLORS.textMuted },

  searchBox: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: COLORS.surfaceContainerLow,
    borderWidth: 1, borderColor: COLORS.outlineVariant,
    borderRadius: 8, paddingHorizontal: 14,
  },
  searchInput: {
    flex: 1, paddingVertical: 12,
    color: COLORS.onSurface, fontSize: 13,
  },

  summaryRow: { flexDirection: 'row', gap: 8 },
  summaryCard: {
    flex: 1, alignItems: 'center', gap: 4,
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 8, borderWidth: 1, borderColor: COLORS.outlineVariant,
    paddingVertical: 16,
  },
  summaryNum: { fontSize: 20, fontFamily: FONTS.family.monoSemiBold, color: COLORS.primary, letterSpacing: -0.5 },
  summaryLabel: { fontSize: 11, color: COLORS.onSurfaceVariant },

  list: { gap: 8 },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 8, borderWidth: 1, borderColor: COLORS.outlineVariant,
    padding: 14,
  },
  avatar: {
    width: 42, height: 42, borderRadius: 10,
    backgroundColor: COLORS.surfaceContainerHigh,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 13, fontFamily: FONTS.family.bodyBold, color: COLORS.primary },
  info: { flex: 1, gap: 4 },
  infoTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  name: { fontSize: 14, fontFamily: FONTS.family.bodySemiBold, color: COLORS.onSurface },
  role: { fontSize: 12, color: COLORS.onSurfaceVariant },
  statsRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  stat: { fontSize: 11, color: COLORS.onSurfaceVariant },
  statNum: { fontSize: 11, fontFamily: FONTS.family.bodySemiBold, color: COLORS.onSurface },
  sep: { fontSize: 11, color: COLORS.outline },

  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 4, backgroundColor: COLORS.primaryContainer,
  },
  badgeDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: COLORS.primary },
  badgeText: { fontSize: 10, fontFamily: FONTS.family.bodySemiBold, color: COLORS.primary },
  badgeMuted: { backgroundColor: COLORS.surfaceContainerHigh },
  badgeDotMuted: { backgroundColor: COLORS.outline },
  badgeTextMuted: { color: COLORS.onSurfaceVariant },
});
