import React from 'react';
import type { RootStackScreenProps } from '../../types/navigation';
import { styles } from './ProfileScreen.styles';
import BaseProfileScreen from '../../components/BaseProfileScreen';

type ProfileScreenProps = RootStackScreenProps<'StudentProfile'>;

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const menuItems = [
    { icon: 'edit' as const, label: 'Editar perfil', onPress: () => navigation.navigate('EditProfile') },
    { icon: 'notifications-none' as const, label: 'Notificaciones', onPress: () => {} },
    { icon: 'security' as const, label: 'Seguridad', onPress: () => {} },
    { icon: 'help-outline' as const, label: 'Soporte', onPress: () => {} },
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
