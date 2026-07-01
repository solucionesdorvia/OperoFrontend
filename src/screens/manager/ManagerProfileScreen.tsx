import React from 'react';
import { Alert } from 'react-native';
import type { ManagerTabScreenProps } from '../../types/navigation';
import { styles } from './ManagerProfileScreen.styles';
import BaseProfileScreen from '../../components/BaseProfileScreen';

type ManagerProfileScreenProps = ManagerTabScreenProps<'ManagerProfile'>;

const comingSoon = (title: string) =>
  Alert.alert(title, 'Esta función está en desarrollo y estará disponible en una próxima versión.');

export default function ManagerProfileScreen({ navigation }: ManagerProfileScreenProps) {
  const menuItems = [
    { icon: 'edit' as const, label: 'Editar perfil', onPress: () => navigation.navigate('EditProfile' as never) },
    { icon: 'people' as const, label: 'Gestión de equipo', onPress: () => navigation.navigate('ManagerMyTeam' as any) },
  ];

  const statsFilter = (incidents: any[], userId?: number) => {
    return {
      reported: incidents.filter(inc => !inc.workerId).length, // Nuevas (sin asignar)
      resolved: incidents.filter(inc => inc.status === 'FINISHED').length,
      active: incidents.filter(inc => inc.status === 'IN_PROCESS').length, // En proceso
    };
  };

  return (
    <BaseProfileScreen
      navigation={navigation}
      styles={styles}
      menuItems={menuItems}
      statsFilter={statsFilter}
      statsLabels={{ reported: 'Nuevas', resolved: 'Resueltas', active: 'En proceso' }}
      statsOrder={['reported', 'active', 'resolved']}
    />
  );
}
