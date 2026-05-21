import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { FONTS } from '../../constants/fonts';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 4,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.outline,
  },
  dimmed: { opacity: 0.45 },
  accent: { width: 3 },
  body: { flex: 1, padding: 14, gap: 8 },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: FONTS.size.sm,
    fontFamily: FONTS.family.bodySemiBold,
    color: COLORS.text,
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  location: {
    flex: 1,
    fontSize: 11,
    fontFamily: FONTS.family.mono,
    color: COLORS.textMuted,
    letterSpacing: 0.2,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sep: { fontSize: FONTS.size.sm, color: COLORS.outline },
  time: { fontSize: FONTS.size.xs, color: COLORS.textMuted, fontFamily: FONTS.family.mono },
});
