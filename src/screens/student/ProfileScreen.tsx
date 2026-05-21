import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/colors';
import { FONTS } from '../../../constants/fonts';
import TopAppBar from '../../components/TopAppBar';
import type { RootStackScreenProps, RootStackParamList } from '../../types/navigation';
import { styles } from './ProfileScreen.styles';

type MenuItem = {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  route?: keyof RootStackParamList;
};

const menuItems: MenuItem[] = [
  { icon: 'edit',               label: 'Editar perfil',  route: 'EditProfile' },
  { icon: 'notifications-none', label: 'Notificaciones' },
  { icon: 'security',           label: 'Seguridad'      },
  { icon: 'help-outline',       label: 'Soporte'        },
];

type ProfileScreenProps = RootStackScreenProps<'StudentProfile'>;

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  return (
    <View style={styles.container}>
      <TopAppBar title="Perfil" onBack={() => navigation.goBack()} rightIcon="settings" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.profile}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitials}>AM</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>Alejandro Moreno</Text>
            <Text style={styles.email}>a.moreno@opero.edu</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statNum}>14</Text>
            <Text style={styles.statLabel}>Reportadas</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNum}>11</Text>
            <Text style={styles.statLabel}>Resueltas</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNum}>3</Text>
            <Text style={styles.statLabel}>Activas</Text>
          </View>
        </View>

        <View style={styles.menu}>
          {menuItems.map((item, i) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.menuItem, i < menuItems.length - 1 && styles.menuItemBorder]}
              activeOpacity={0.7}
              onPress={() => item.route && navigation.navigate(item.route as never)}
            >
              <MaterialIcons name={item.icon} size={18} color={COLORS.onSurfaceVariant} />
              <Text style={styles.menuLabel}>{item.label}</Text>
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
