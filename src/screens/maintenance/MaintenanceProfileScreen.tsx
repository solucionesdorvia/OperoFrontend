import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../../../constants/colors';
import TopAppBar from '../../components/TopAppBar';
import type {
  MaintenanceTabScreenProps,
  RootStackParamList,
  MaintenanceTabParamList,
} from '../../types/navigation';
import { styles } from './MaintenanceProfileScreen.styles';
import { useAuth } from '../../context/AuthContext';
import { incidentService } from '../../services/incidentService';

type MenuItem = {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  sub?: string;
  route?: keyof RootStackParamList | keyof MaintenanceTabParamList;
};

const menu: MenuItem[] = [
  { icon: 'edit',               label: 'Editar perfil',   sub: 'Datos personales',       route: 'EditProfile' },
  { icon: 'history',            label: 'Ver historial',   sub: 'Tareas finalizadas',     route: 'MaintenanceHistory' },
  { icon: 'notifications-none', label: 'Notificaciones',  sub: 'Alertas de asignación' },
  { icon: 'security',           label: 'Seguridad',       sub: 'Contraseña y sesión' },
  { icon: 'help-outline',       label: 'Soporte',         sub: 'Centro de ayuda' },
];

type MaintenanceProfileScreenProps = MaintenanceTabScreenProps<'MaintenanceProfile'>;

export default function MaintenanceProfileScreen({ navigation }: MaintenanceProfileScreenProps) {
  const { logout, user } = useAuth();

  const [stats, setStats] = useState({ asignadas: 0, hoy: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      setLoading(true);
      const incidents = await incidentService.getAll();
      const mine = incidents.filter(inc => inc.workerId === user?.id);

      const today = new Date();
      const completedToday = mine.filter(inc => {
        if (inc.status !== 'FINISHED') return false;
        const updated = new Date(inc.updatedAt);
        return updated.toDateString() === today.toDateString();
      });

      setStats({
        asignadas: mine.filter(inc => inc.status !== 'FINISHED').length,
        hoy: completedToday.length,
        total: mine.filter(inc => inc.status === 'FINISHED').length,
      });
    } catch (error) {
      console.error('[MaintenanceProfileScreen] Error al cargar stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadStats();
    }, [])
  );

  const handleLogout = async () => {
    try {
      await logout();
      navigation.replace('Login');
    } catch (error) {
      console.error('[MaintenanceProfileScreen] Error al cerrar sesión:', error);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <View style={styles.container}>
      <TopAppBar showLogo rightIcon="settings" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.profile}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitials}>{getInitials(user?.fullName)}</Text>
          </View>
          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{user?.fullName || 'Usuario'}</Text>
              <View style={styles.role}>
                <Text style={styles.roleText}>Operario</Text>
              </View>
            </View>
            <Text style={styles.email}>{user?.emailUade || ''}</Text>
            <Text style={styles.dept}>
              <MaterialIcons name="domain" size={12} color={COLORS.onSurfaceVariant} />
              {'  '}Mantenimiento
            </Text>
          </View>
        </View>

        {loading ? (
          <View style={{ padding: 24, alignItems: 'center' }}>
            <ActivityIndicator size="small" color={COLORS.primary} />
          </View>
        ) : (
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statNum}>{stats.asignadas}</Text>
              <Text style={styles.statLabel}>Asignadas</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statNum}>{stats.hoy}</Text>
              <Text style={styles.statLabel}>Hoy</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statNum}>{stats.total}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
          </View>
        )}

        <View style={styles.menu}>
          {menu.map((item, i) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.menuItem, i < menu.length - 1 && styles.menuItemBorder]}
              activeOpacity={0.7}
              onPress={() => item.route && navigation.navigate(item.route as never)}
            >
              <View style={styles.menuIcon}>
                <MaterialIcons name={item.icon} size={18} color={COLORS.onSurface} />
              </View>
              <View style={styles.menuText}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                {item.sub ? <Text style={styles.menuSub}>{item.sub}</Text> : null}
              </View>
              <MaterialIcons name="chevron-right" size={18} color={COLORS.outline} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <MaterialIcons name="logout" size={16} color={COLORS.error} />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}
