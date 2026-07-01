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

    return {
      reported: mine.length, // Asignadas (todas las tareas asignadas al operario)
      resolved: mine.filter(inc => inc.status === 'FINISHED').length, // Resueltas (total)
      active: mine.filter(inc => inc.status === 'IN_PROCESS').length, // En proceso (comenzadas pero no terminadas)
    };
  };

  return (
    <BaseProfileScreen
      navigation={navigation}
      styles={styles}
      menuItems={menuItems}
      statsFilter={statsFilter}
      statsLabels={{ reported: 'Asignadas', resolved: 'Resueltas', active: 'En proceso' }}
    />
  );
}
