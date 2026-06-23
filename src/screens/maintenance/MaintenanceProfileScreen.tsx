import React from 'react';
import { Alert } from 'react-native';
import type { MaintenanceTabScreenProps } from '../../types/navigation';
import { styles } from './MaintenanceProfileScreen.styles';
import BaseProfileScreen from '../../components/BaseProfileScreen';

type MaintenanceProfileScreenProps = MaintenanceTabScreenProps<'MaintenanceProfile'>;

const comingSoon = (title: string) =>
  Alert.alert(title, 'Esta función está en desarrollo y estará disponible en una próxima versión.');

export default function MaintenanceProfileScreen({ navigation }: MaintenanceProfileScreenProps) {
  const menuItems = [
    { icon: 'edit' as const, label: 'Editar perfil', onPress: () => navigation.navigate('EditProfile' as never) },
    { icon: 'history' as const, label: 'Ver historial', onPress: () => navigation.navigate('MaintenanceHistory') },
  ];

  const statsFilter = (incidents: any[], userId?: number) => {
    const mine = incidents.filter(inc => inc.workerId === userId);
    const today = new Date();
    const completedToday = mine.filter(inc => {
      if (inc.status !== 'FINISHED') return false;
      const updated = new Date(inc.updatedAt);
      return updated.toDateString() === today.toDateString();
    });

    return {
      reported: mine.length,
      resolved: completedToday.length,
      active: mine.filter(inc => inc.status === 'FINISHED').length,
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
