import { StyleSheet } from 'react-native';
import { FONTS } from '../../constants/fonts';

export const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontSize: 10,
    fontFamily: FONTS.family.monoSemiBold,
    textTransform: 'uppercase',
    letterSpacing: FONTS.tracking.caps,
  },
});
