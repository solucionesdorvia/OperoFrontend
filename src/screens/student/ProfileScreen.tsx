import React from 'react';
import { Alert } from 'react-native';
import type { RootStackScreenProps } from '../../types/navigation';
import { styles } from './ProfileScreen.styles';
import BaseProfileScreen from '../../components/BaseProfileScreen';

type ProfileScreenProps = RootStackScreenProps<'StudentProfile'>;

const comingSoon = (title: string) =>
  Alert.alert(title, 'Esta función está en desarrollo y estará disponible en una próxima versión.');

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const menuItems = [
    { icon: 'edit' as const, label: 'Editar perfil', onPress: () => navigation.navigate('EditProfile') },
    { icon: 'notifications-none' as const, label: 'Notificaciones', onPress: () => comingSoon('Notificaciones') },
    { icon: 'security' as const, label: 'Seguridad', onPress: () => comingSoon('Seguridad') },
    { icon: 'help-outline' as const, label: 'Soporte', onPress: () => comingSoon('Soporte') },
  ];

  const statsFilter = (incidents: any[], userId?: number) => {
    const userIncidents = incidents.filter(inc => inc.reporterId === userId);
    return {
      reported: userIncidents.length,
      resolved: userIncidents.filter(inc => inc.status === 'FINISHED').length,
      active: userIncidents.filter(inc => inc.status !== 'FINISHED').length,
    };
  };

  return (
    <BaseProfileScreen
      navigation={navigation}
      styles={styles}
      menuItems={menuItems}
      statsFilter={statsFilter}
    />
  );
}
