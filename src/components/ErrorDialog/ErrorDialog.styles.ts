import { StyleSheet } from 'react-native';
import { COLORS } from '../../../constants/colors';
import { FONTS } from '../../../constants/fonts';

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 26, 46, 0.6)', // COLORS.primaryDim con alpha
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  dialog: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    // Sombra sutil
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },

  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  title: {
    fontFamily: FONTS.semiBold,
    fontSize: 20,
    lineHeight: 28,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8,
  },

  message: {
    fontFamily: FONTS.regular,
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: 24,
  },

  buttonsContainer: {
    width: '100%',
    gap: 12,
  },

  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
  },

  buttonDestructive: {
    backgroundColor: COLORS.danger,
  },

  buttonCancel: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.outline,
  },

  buttonText: {
    fontFamily: FONTS.medium,
    fontSize: 15,
    lineHeight: 20,
    color: COLORS.onPrimary,
  },

  buttonTextDestructive: {
    color: COLORS.onPrimary,
  },

  buttonTextCancel: {
    color: COLORS.text,
  },
});
