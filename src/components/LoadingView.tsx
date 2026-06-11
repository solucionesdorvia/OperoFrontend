import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import TopAppBar from './TopAppBar';

interface LoadingViewProps {
  showLogo?: boolean;
  showAvatar?: boolean;
  rightIcon?: any;
  onBack?: () => void;
}

export default function LoadingView({ showLogo, showAvatar, rightIcon, onBack }: LoadingViewProps) {
  return (
    <View style={styles.container}>
      <TopAppBar showLogo={showLogo} showAvatar={showAvatar} rightIcon={rightIcon} onBack={onBack} />
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
