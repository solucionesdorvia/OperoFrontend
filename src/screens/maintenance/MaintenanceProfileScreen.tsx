import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/colors';
import { FONTS } from '../../../constants/fonts';
import TopAppBar from '../../components/TopAppBar';
import type {
  MaintenanceTabScreenProps,
  RootStackParamList,
  MaintenanceTabParamList,
} from '../../types/navigation';
import { styles } from './MaintenanceProfileScreen.styles';

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
  return (
    <View style={styles.container}>
      <TopAppBar showLogo rightIcon="settings" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.profile}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitials}>CM</Text>
          </View>
          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>Carlos Mendoza</Text>
              <View style={styles.role}>
                <Text style={styles.roleText}>Operario</Text>
              </View>
            </View>
            <Text style={styles.email}>c.mendoza@opero.edu</Text>
            <Text style={styles.dept}>
              <MaterialIcons name="domain" size={12} color={COLORS.onSurfaceVariant} />
              {'  '}Mantenimiento General
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statNum}>4</Text>
            <Text style={styles.statLabel}>Asignadas</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNum}>12</Text>
            <Text style={styles.statLabel}>Hoy</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNum}>184</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>

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
          onPress={() => navigation.replace('Login')}
          activeOpacity={0.7}
        >
          <MaterialIcons name="logout" size={16} color={COLORS.error} />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}
