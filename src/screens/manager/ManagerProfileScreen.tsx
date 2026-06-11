import React from 'react';
import type { ManagerTabScreenProps } from '../../types/navigation';
import { styles } from './ManagerProfileScreen.styles';
import BaseProfileScreen from '../../components/BaseProfileScreen';

type ManagerProfileScreenProps = ManagerTabScreenProps<'ManagerProfile'>;

export default function ManagerProfileScreen({ navigation }: ManagerProfileScreenProps) {
  const menuItems = [
    { icon: 'edit' as const, label: 'Editar perfil', onPress: () => navigation.navigate('EditProfile' as never) },
    { icon: 'people' as const, label: 'Gestión de equipo', onPress: () => navigation.navigate('MyTeam') },
    { icon: 'notifications-none' as const, label: 'Notificaciones', onPress: () => {} },
    { icon: 'security' as const, label: 'Seguridad', onPress: () => {} },
    { icon: 'help-outline' as const, label: 'Soporte', onPress: () => {} },
  ];

  const statsFilter = (incidents: any[], userId?: number) => {
    const deptIncidents = incidents; // Manager ve todos los de su departamento
    return {
      reported: deptIncidents.length,
      resolved: deptIncidents.filter(inc => inc.status === 'FINISHED').length,
      active: deptIncidents.filter(inc => inc.status !== 'FINISHED').length,
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
