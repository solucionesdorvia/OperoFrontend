import React from 'react';
import type { MaintenanceTabScreenProps } from '../../types/navigation';
import { styles } from './MaintenanceProfileScreen.styles';
import BaseProfileScreen from '../../components/BaseProfileScreen';

type MaintenanceProfileScreenProps = MaintenanceTabScreenProps<'MaintenanceProfile'>;

export default function MaintenanceProfileScreen({ navigation }: MaintenanceProfileScreenProps) {
  const menuItems = [
    { icon: 'edit' as const, label: 'Editar perfil', onPress: () => navigation.navigate('EditProfile' as never) },
    { icon: 'history' as const, label: 'Ver historial', onPress: () => navigation.navigate('MaintenanceHistory') },
    { icon: 'notifications-none' as const, label: 'Notificaciones', onPress: () => {} },
    { icon: 'security' as const, label: 'Seguridad', onPress: () => {} },
    { icon: 'help-outline' as const, label: 'Soporte', onPress: () => {} },
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
