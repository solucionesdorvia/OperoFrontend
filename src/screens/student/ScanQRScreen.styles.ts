import { StyleSheet } from 'react-native';
import { COLORS } from '../../../constants/colors';
import { FONTS } from '../../../constants/fonts';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgLow },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingBottom: 8,
  },
  closeBtn: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 15, fontFamily: FONTS.family.bodySemiBold, color: COLORS.text },

  center: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 32, gap: 14,
  },
  title: { fontSize: 20, fontFamily: FONTS.family.display, color: COLORS.text, textAlign: 'center' },
  subtitle: {
    fontSize: 12, fontFamily: FONTS.family.mono, color: COLORS.textMuted,
    textAlign: 'center', lineHeight: 20, marginBottom: 16, letterSpacing: 0.2,
  },

  viewfinder: {
    width: 240, height: 240,
    alignItems: 'center', justifyContent: 'center',
    marginVertical: 8,
  },
  corner: {
    position: 'absolute',
    width: 28, height: 28,
    borderColor: COLORS.primary,
  },
  cornerTL: { top: 0,    left: 0,    borderTopWidth: 3, borderLeftWidth: 3,  borderTopLeftRadius: 6     },
  cornerTR: { top: 0,    right: 0,   borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 6    },
  cornerBL: { bottom: 0, left: 0,    borderBottomWidth: 3, borderLeftWidth: 3,  borderBottomLeftRadius: 6  },
  cornerBR: { bottom: 0, right: 0,   borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 6 },
  scanLine: {
    position: 'absolute', top: 20,
    width: 210, height: 2,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.8,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },

  simulateBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 18, paddingVertical: 12,
    borderRadius: 24,
    marginTop: 12,
  },
  simulateText: { fontSize: 12, fontFamily: FONTS.family.monoSemiBold, color: COLORS.onPrimary, textTransform: 'uppercase', letterSpacing: FONTS.tracking.caps },

  bottomSheet: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderTopLeftRadius: 18, borderTopRightRadius: 18,
    paddingHorizontal: 20, paddingTop: 10,
    borderTopWidth: 1, borderColor: COLORS.outlineVariant,
    gap: 12,
  },
  handle: {
    alignSelf: 'center', width: 36, height: 3, borderRadius: 2,
    backgroundColor: COLORS.outlineVariant,
    marginBottom: 6,
  },
  sheetTitle: { fontSize: 13, fontFamily: FONTS.family.bodySemiBold, color: COLORS.onSurface },
  sheetList: { gap: 6 },
  sheetItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 10,
  },
  sheetIcon: {
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: COLORS.primaryContainer,
    alignItems: 'center', justifyContent: 'center',
  },
  sheetLocation: { fontSize: 13, fontFamily: FONTS.family.bodyMedium, color: COLORS.onSurface },
  sheetCode: { fontSize: 11, color: COLORS.onSurfaceVariant, marginTop: 2 },
});
