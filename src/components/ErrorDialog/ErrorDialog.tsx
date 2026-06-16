import React, { useEffect, useRef } from 'react';
import {
  Modal, View, Text, TouchableOpacity, Animated, Pressable,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/colors';
import { styles } from './ErrorDialog.styles';

export type DialogType = 'error' | 'warning' | 'success' | 'info';

export type DialogButton = {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'destructive' | 'cancel';
};

export type ErrorDialogProps = {
  visible: boolean;
  type?: DialogType;
  title: string;
  message: string;
  buttons?: DialogButton[];
  onDismiss?: () => void;
};

const DIALOG_CONFIG = {
  error: {
    icon: 'error-outline' as const,
    color: COLORS.danger,
    bgColor: COLORS.dangerTint,
  },
  warning: {
    icon: 'warning' as const,
    color: COLORS.warning,
    bgColor: COLORS.warningTint,
  },
  success: {
    icon: 'check-circle' as const,
    color: COLORS.success,
    bgColor: COLORS.successTint,
  },
  info: {
    icon: 'info' as const,
    color: COLORS.info,
    bgColor: COLORS.infoTint,
  },
};

export default function ErrorDialog({
  visible,
  type = 'error',
  title,
  message,
  buttons = [{ text: 'OK', style: 'default' }],
  onDismiss,
}: ErrorDialogProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    console.log('[ErrorDialog] visible changed:', visible, 'title:', title);
    if (visible) {
      // Fade in + scale
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Fade out
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, fadeAnim, scaleAnim]);

  const config = DIALOG_CONFIG[type];

  const handleButtonPress = (button: DialogButton) => {
    button.onPress?.();
    onDismiss?.();
  };

  console.log('[ErrorDialog] RENDER - visible:', visible, 'title:', title);

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.backdrop}>
        <View style={styles.dialog}>
          <View style={[styles.iconContainer, { backgroundColor: config.bgColor }]}>
            <MaterialIcons name={config.icon} size={32} color={config.color} />
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonsContainer}>
            {buttons.map((button, index) => {
              const isDestructive = button.style === 'destructive';
              const isCancel = button.style === 'cancel';

              return (
                <TouchableOpacity
                  key={`${button.text}-${index}`}
                  style={[
                    styles.button,
                    isDestructive && styles.buttonDestructive,
                    isCancel && styles.buttonCancel,
                  ]}
                  onPress={() => handleButtonPress(button)}
                  activeOpacity={0.85}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      isDestructive && styles.buttonTextDestructive,
                      isCancel && styles.buttonTextCancel,
                    ]}
                  >
                    {button.text}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}
