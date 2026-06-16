import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { FONTS } from '../../constants/fonts';

export const styles = StyleSheet.create({
  field: { gap: 8 },
  label: {
    fontSize: 13,
    fontFamily: FONTS.family.bodyMedium,
    color: COLORS.onSurfaceVariant,
  },
});
