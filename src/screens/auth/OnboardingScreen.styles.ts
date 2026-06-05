import { StyleSheet } from 'react-native';
import { COLORS } from '../../../constants/colors';
import { FONTS } from '../../../constants/fonts';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  topBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingBottom: 8,
  },
  flatListWrapper: {
    flex: 1,
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logo: { width: 28, height: 28, tintColor: COLORS.text },
  wordmark: { fontSize: 16, fontFamily: FONTS.family.monoBold, color: COLORS.primary, textTransform: 'uppercase', letterSpacing: FONTS.tracking.wide },
  skip: { fontSize: 13, color: COLORS.onSurfaceVariant, fontFamily: FONTS.family.bodyMedium },

  slide: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 32, gap: 18,
  },
  iconWrap: {
    width: 120, height: 120, borderRadius: 24,
    backgroundColor: COLORS.surfaceContainerLow,
    borderWidth: 1, borderColor: COLORS.outlineVariant,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: FONTS.size.xl, fontFamily: FONTS.family.display, color: COLORS.onSurface,
    textAlign: 'center', letterSpacing: -0.3,
  },
  desc: {
    fontSize: 14, color: COLORS.onSurfaceVariant,
    textAlign: 'center', lineHeight: 22, maxWidth: 320,
  },

  bottom: { paddingHorizontal: 28, gap: 20 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6 },
  dot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: COLORS.outlineVariant,
  },
  dotActive: { backgroundColor: COLORS.primary, width: 18 },

  primaryBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: COLORS.primary, borderRadius: 8, paddingVertical: 15,
  },
  primaryText: { fontSize: 12, fontFamily: FONTS.family.monoSemiBold, color: COLORS.onPrimary, textTransform: 'uppercase', letterSpacing: FONTS.tracking.caps },

  loginLink: { alignItems: 'center' },
  loginText: { fontSize: 13, color: COLORS.onSurfaceVariant },
  loginAccent: { color: COLORS.primary, fontFamily: FONTS.family.bodySemiBold },
});
