import React from 'react';
import {
  View, Text,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/colors';
import TopAppBar from '../../components/TopAppBar';
import type { RootStackScreenProps } from '../../types/navigation';
import { styles } from './NotificationsScreen.styles';

type NotificationsScreenProps = RootStackScreenProps<'StudentNotifications'>;

export default function NotificationsScreen({ navigation }: NotificationsScreenProps) {
  // TODO: Endpoint de notificaciones no implementado en backend
  // Por ahora mostramos empty state

  return (
    <View style={styles.container}>
      <TopAppBar title="Notificaciones" onBack={() => navigation.goBack()} />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
        <MaterialIcons name="notifications-none" size={64} color={COLORS.outline} />
        <Text style={{ fontSize: 18, fontWeight: '600', color: COLORS.text, marginTop: 16, textAlign: 'center' }}>
          Notificaciones
        </Text>
        <Text style={{ fontSize: 15, color: COLORS.textMuted, marginTop: 8, textAlign: 'center' }}>
          Las notificaciones en tiempo real estarán disponibles próximamente
        </Text>
      </View>
    </View>
  );
}
