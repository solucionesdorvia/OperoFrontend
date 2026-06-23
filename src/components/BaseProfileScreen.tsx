import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../../constants/colors';
import TopAppBar from './TopAppBar';
import { useAuth } from '../context/AuthContext';
import { incidentService } from '../services/incidentService';

type MenuItem = {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress?: () => void;
};

interface BaseProfileScreenProps {
  navigation: any;
  styles: any;
  menuItems: MenuItem[];
  statsFilter: (incidents: any[], userId?: number) => { reported: number; resolved: number; active: number };
}

export default function BaseProfileScreen({
  navigation,
  styles,
  menuItems,
  statsFilter,
}: BaseProfileScreenProps) {
  const { logout, user } = useAuth();
  const [stats, setStats] = useState({ reported: 0, resolved: 0, active: 0 });
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      setLoading(true);
      const incidents = await incidentService.getAll();
      setStats(statsFilter(incidents, user?.id));
    } catch (error) {
      console.error('[ProfileScreen] Error al cargar stats:', error);
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
      console.error('[ProfileScreen] Error al cerrar sesión:', error);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <View style={styles.container}>
      <TopAppBar title="Perfil" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.profile}>
          <View key={user?.fullName || 'avatar'} style={styles.avatar}>
            <Text style={styles.avatarInitials}>{getInitials(user?.fullName)}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{user?.fullName || 'Usuario'}</Text>
            <Text style={styles.email}>{user?.emailUade || ''}</Text>
          </View>
        </View>

        {loading ? (
          <View style={{ padding: 24, alignItems: 'center' }}>
            <ActivityIndicator size="small" color={COLORS.primary} />
          </View>
        ) : (
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statNum}>{stats.reported}</Text>
              <Text style={styles.statLabel}>Reportadas</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statNum}>{stats.resolved}</Text>
              <Text style={styles.statLabel}>Resueltas</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statNum}>{stats.active}</Text>
              <Text style={styles.statLabel}>Activas</Text>
            </View>
          </View>
        )}

        <View style={styles.menu}>
          {menuItems.map((item, i) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.menuItem, i < menuItems.length - 1 && styles.menuItemBorder]}
              activeOpacity={0.7}
              onPress={item.onPress}
            >
              <MaterialIcons name={item.icon} size={18} color={COLORS.onSurfaceVariant} />
              <Text style={styles.menuLabel}>{item.label}</Text>
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
