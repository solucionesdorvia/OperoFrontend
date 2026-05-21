import { StyleSheet } from 'react-native';
import { COLORS } from '../../../constants/colors';
import { FONTS } from '../../../constants/fonts';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: 20, paddingBottom: 120, gap: 20 },

  profile: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 8 },
  avatar: {
    width: 58, height: 58, borderRadius: 12,
    backgroundColor: COLORS.surfaceContainerHigh,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarInitials: { fontSize: 17, fontFamily: FONTS.family.bodyBold, color: COLORS.primary },
  profileInfo: { flex: 1, gap: 4 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { fontSize: 18, fontFamily: FONTS.family.bodyBold, color: COLORS.onSurface, letterSpacing: -0.2 },
  role: {
    backgroundColor: COLORS.primaryContainer,
    paddingHorizontal: 7, paddingVertical: 2, borderRadius: 4,
  },
  roleText: { fontSize: 10, fontFamily: FONTS.family.bodyBold, color: COLORS.primary, letterSpacing: 0.3 },
  email: { fontSize: 12, color: COLORS.onSurfaceVariant },
  dept: { fontSize: 12, color: COLORS.onSurfaceVariant },

  statsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 8, borderWidth: 1, borderColor: COLORS.outlineVariant,
  },
  stat: { flex: 1, alignItems: 'center', paddingVertical: 14, gap: 3 },
  statNum: { fontSize: 22, fontFamily: FONTS.family.monoSemiBold, color: COLORS.primary, letterSpacing: -0.5 },
  statLabel: { fontSize: 11, fontFamily: FONTS.family.mono, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: FONTS.tracking.caps },
  statDivider: { width: 1, backgroundColor: COLORS.outlineVariant, marginVertical: 12 },

  menu: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 8, borderWidth: 1, borderColor: COLORS.outlineVariant,
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingVertical: 13, paddingHorizontal: 16,
  },
  menuIcon: {
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: COLORS.surfaceContainerHigh,
    alignItems: 'center', justifyContent: 'center',
  },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.outlineVariant },
  menuText: { flex: 1, gap: 2 },
  menuLabel: { fontSize: 14, color: COLORS.onSurface, fontFamily: FONTS.family.bodyMedium },
  menuSub: { fontSize: 11, color: COLORS.onSurfaceVariant },

  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 14, borderRadius: 8,
    backgroundColor: COLORS.errorContainer,
  },
  logoutText: { fontSize: 13, fontFamily: FONTS.family.bodySemiBold, color: COLORS.error },
});
