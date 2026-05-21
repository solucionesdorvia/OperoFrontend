import { StyleSheet } from 'react-native';
import { COLORS } from '../../../constants/colors';
import { FONTS } from '../../../constants/fonts';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: 20, paddingBottom: 120, gap: 20 },

  avatarSection: { alignItems: 'center', gap: 10, paddingVertical: 6 },
  avatar: {
    width: 72, height: 72, borderRadius: 16,
    backgroundColor: COLORS.surfaceContainerHigh,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarInitials: { fontSize: 22, fontFamily: FONTS.family.bodyBold, color: COLORS.primary },
  changePhoto: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: 6, borderWidth: 1, borderColor: COLORS.outlineVariant,
  },
  changePhotoText: { fontSize: 12, fontFamily: FONTS.family.bodyMedium, color: COLORS.onSurface },

  field: { gap: 8 },
  label: { fontSize: 13, fontFamily: FONTS.family.bodyMedium, color: COLORS.onSurfaceVariant },
  input: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderWidth: 1, borderColor: COLORS.outlineVariant,
    borderRadius: 8, paddingHorizontal: 16, paddingVertical: 13,
    color: COLORS.onSurface, fontSize: 14,
  },
  hint: { fontSize: 11, color: COLORS.onSurfaceVariant },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 20, paddingBottom: 36,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1, borderTopColor: COLORS.outlineVariant,
  },
  saveBtn: {
    backgroundColor: COLORS.primary, borderRadius: 8,
    paddingVertical: 15, alignItems: 'center',
  },
  saveText: { fontSize: 12, fontFamily: FONTS.family.monoSemiBold, color: COLORS.onPrimary, textTransform: 'uppercase', letterSpacing: FONTS.tracking.caps },
});
