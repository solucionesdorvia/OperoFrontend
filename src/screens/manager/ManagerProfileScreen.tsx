import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../../../constants/colors';
import TopAppBar from '../../components/TopAppBar';
import type { ManagerTabScreenProps, RootStackParamList } from '../../types/navigation';
import { styles } from './ManagerProfileScreen.styles';
import { useAuth } from '../../context/AuthContext';
import { incidentService } from '../../services/incidentService';
import { userService } from '../../services/userService';

type MenuItem = {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  sub?: string;
  route?: keyof RootStackParamList;
};

const menu: MenuItem[] = [
  { icon: 'edit',         label: 'Editar perfil',          sub: 'Nombre, email y foto',            route: 'EditProfile' },
  { icon: 'groups',       label: 'Mi equipo',              sub: 'Gestión de operarios',            route: 'ManagerMyTeam' },
  { icon: 'domain',       label: 'Configurar departamento', sub: 'Información y preferencias',      route: 'DepartmentSettings' },
  { icon: 'notifications-none', label: 'Notificaciones',   sub: 'Correo y push' },
  { icon: 'security',     label: 'Seguridad',              sub: 'Contraseña y sesión activa' },
  { icon: 'help-outline', label: 'Soporte',                sub: 'Centro de ayuda' },
];

type ManagerProfileScreenProps = ManagerTabScreenProps<'ManagerProfile'>;

export default function ManagerProfileScreen({ navigation }: ManagerProfileScreenProps) {
  const { logout, user } = useAuth();

  const [stats, setStats] = useState({ abiertas: 0, enProceso: 0, operarios: 0 });
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      setLoading(true);

      // Obtener perfil del manager
      const myProfile = await userService.getMe();

      const [incidents, users] = await Promise.all([
        incidentService.getAll(),
        myProfile.departmentId ? userService.getByDepartment(myProfile.departmentId) : Promise.resolve([]),
      ]);

      const workers = users.filter(u => u.roleName === 'WORKER');

      setStats({
        abiertas: incidents.filter(inc => inc.status === 'ASSIGNED').length,
        enProceso: incidents.filter(inc => inc.status === 'IN_PROCESS').length,
        operarios: workers.length,
      });
    } catch (error) {
      console.error('[ManagerProfileScreen] Error al cargar stats:', error);
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
      console.error('[ManagerProfileScreen] Error al cerrar sesión:', error);
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
                <Text style={styles.roleText}>Manager</Text>
              </View>
            </View>
            <Text style={styles.email}>{user?.emailUade || ''}</Text>
            <Text style={styles.dept}>
              <MaterialIcons name="domain" size={12} color={COLORS.onSurfaceVariant} />
              {'  '}Gestión de incidencias
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
              <Text style={styles.statNum}>{stats.abiertas}</Text>
              <Text style={styles.statLabel}>Abiertas</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statNum}>{stats.enProceso}</Text>
              <Text style={styles.statLabel}>En proceso</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statNum}>{stats.operarios}</Text>
              <Text style={styles.statLabel}>Operarios</Text>
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
