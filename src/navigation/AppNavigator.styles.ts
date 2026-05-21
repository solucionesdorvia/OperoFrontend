import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { FONTS } from '../../constants/fonts';

export const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceContainerLow,
    borderTopWidth: 1,
    borderTopColor: COLORS.outlineVariant,
    paddingTop: 10,
    paddingHorizontal: 8,
  },
  studentTabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceContainerLow,
    borderTopWidth: 1,
    borderTopColor: COLORS.outlineVariant,
    paddingTop: 10,
    paddingHorizontal: 8,
    alignItems: 'flex-start',
  },
  tab: {
    flex: 1, alignItems: 'center', gap: 4, paddingVertical: 4,
  },
  tabLabel: {
    fontSize: 10, fontFamily: FONTS.family.bodyMedium, color: COLORS.onSurfaceVariant,
  },
  tabLabelActive: {
    color: COLORS.primary, fontFamily: FONTS.family.bodySemiBold,
  },
  scanSlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 4,
    marginTop: -22,
  },
  scanBtn: {
    width: 54, height: 54, borderRadius: 27,
    backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 4, borderColor: COLORS.surfaceContainerLow,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  scanLabel: {
    fontSize: 10, fontFamily: FONTS.family.bodySemiBold, color: COLORS.primary,
    marginTop: 2,
  },
});
