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
  ];

  const statsFilter = (incidents: any[], userId?: number) => {
    const userIncidents = incidents.filter(inc => inc.reporterId === userId);
    return {
      reported: userIncidents.length,
      resolved: userIncidents.filter(inc => inc.status === 'FINISHED').length,
      active: userIncidents.filter(inc => inc.status === 'IN_PROCESS').length, // En curso (operario trabajando)
    };
  };

  return (
    <BaseProfileScreen
      navigation={navigation}
      styles={styles}
      menuItems={menuItems}
      statsFilter={statsFilter}
      statsLabels={{ reported: 'Reportadas', resolved: 'Resueltas', active: 'En curso' }}
    />
  );
}
