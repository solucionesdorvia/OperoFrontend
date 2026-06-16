import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { FONTS } from '../../constants/fonts';

export const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 15,
  },
  btnDisabled: { opacity: 0.5 },
  text: {
    fontSize: 12,
    fontFamily: FONTS.family.monoSemiBold,
    color: COLORS.onPrimary,
    textTransform: 'uppercase',
    letterSpacing: FONTS.tracking.caps,
  },
});
