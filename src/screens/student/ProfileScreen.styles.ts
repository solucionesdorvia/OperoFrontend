import { StyleSheet } from 'react-native';
import { COLORS } from '../../../constants/colors';
import { FONTS } from '../../../constants/fonts';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: 20, paddingBottom: 100, gap: 20 },

  profile: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 8 },
  avatar: {
    width: 52, height: 52, borderRadius: 8,
    backgroundColor: COLORS.surfaceContainerHigh,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarInitials: { fontSize: 16, fontFamily: FONTS.family.bodyBold, color: COLORS.primary },
  profileInfo: { gap: 3 },
  name: { fontSize: 18, fontFamily: FONTS.family.bodyBold, color: COLORS.onSurface, letterSpacing: -0.2 },
  email: { fontSize: 13, color: COLORS.onSurfaceVariant },

  statsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 8, borderWidth: 1, borderColor: COLORS.outlineVariant,
  },
  stat: { flex: 1, alignItems: 'center', paddingVertical: 16, gap: 3 },
  statNum: { fontSize: 22, fontFamily: FONTS.family.monoSemiBold, color: COLORS.primary, letterSpacing: -0.5 },
  statLabel: { fontSize: 11, fontFamily: FONTS.family.mono, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: FONTS.tracking.caps },
  statDivider: { width: 1, backgroundColor: COLORS.outlineVariant, marginVertical: 12 },

  menu: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 8, borderWidth: 1, borderColor: COLORS.outlineVariant,
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingVertical: 15, paddingHorizontal: 16,
  },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.outlineVariant },
  menuLabel: { flex: 1, fontSize: 14, color: COLORS.onSurface },

  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 14, borderRadius: 8,
    backgroundColor: COLORS.errorContainer,
  },
  logoutText: { fontSize: 13, fontFamily: FONTS.family.bodySemiBold, color: COLORS.error },
});
