import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { FONTS } from '../../constants/fonts';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  title: {
    fontSize: FONTS.size.lg,
    fontFamily: FONTS.family.display,
    color: COLORS.text,
    letterSpacing: -0.2,
  },
  iconBtn: { padding: 2 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoImg: { width: 34, height: 34, tintColor: COLORS.text },
  logoText: { fontSize: 16, fontFamily: FONTS.family.monoBold, color: COLORS.primary, textTransform: 'uppercase', letterSpacing: FONTS.tracking.wide },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 6,
    backgroundColor: COLORS.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: FONTS.size.xs,
    fontFamily: FONTS.family.monoBold,
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
});
