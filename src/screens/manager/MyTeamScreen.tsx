import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../../constants/colors';
import { FONTS } from '../../../constants/fonts';
import TopAppBar from '../../components/TopAppBar';
import type { ManagerTabScreenProps } from '../../types/navigation';
import { styles } from './MyTeamScreen.styles';

type Member = {
  id: string;
  name: string;
  role: string;
  initials: string;
  active: number;
  done: number;
  status: 'ACTIVO' | 'AUSENTE';
};

const team: Member[] = [
  { id: '1', name: 'Carlos Mendoza', role: 'Operario senior',    initials: 'CM', active: 3, done: 42, status: 'ACTIVO'  },
  { id: '2', name: 'Elena Rivas',    role: 'Técnica eléctrica',  initials: 'ER', active: 2, done: 31, status: 'ACTIVO'  },
  { id: '3', name: 'Marcos Polo',    role: 'Operario junior',    initials: 'MP', active: 1, done: 14, status: 'ACTIVO'  },
  { id: '4', name: 'Ana Suárez',     role: 'Operaria hidráulica', initials: 'AS', active: 0, done: 28, status: 'AUSENTE' },
];

type MyTeamScreenProps = ManagerTabScreenProps<'ManagerMyTeam'>;

export default function MyTeamScreen({ navigation }: MyTeamScreenProps) {
  const insets = useSafeAreaInsets();
  const tabBarHeight = 60 + insets.bottom;
  const [query, setQuery] = useState('');

  const filtered = team.filter((m) =>
    m.name.toLowerCase().includes(query.toLowerCase()) ||
    m.role.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TopAppBar showLogo rightIcon="search" showAvatar />
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: tabBarHeight + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Mi equipo</Text>
          <Text style={styles.sub}>Mantenimiento · {team.length} miembros</Text>
        </View>

        <View style={styles.searchBox}>
          <MaterialIcons name="search" size={18} color={COLORS.onSurfaceVariant} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre o rol"
            placeholderTextColor={COLORS.outline}
            value={query}
            onChangeText={setQuery}
          />
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNum}>3</Text>
            <Text style={styles.summaryLabel}>Activos</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNum}>6</Text>
            <Text style={styles.summaryLabel}>Tareas abiertas</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNum}>115</Text>
            <Text style={styles.summaryLabel}>Resueltas</Text>
          </View>
        </View>

        <View style={styles.list}>
          {filtered.map((m) => (
            <TouchableOpacity key={m.id} style={styles.card} activeOpacity={0.7}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{m.initials}</Text>
              </View>
              <View style={styles.info}>
                <View style={styles.infoTop}>
                  <Text style={styles.name}>{m.name}</Text>
                  <View style={[styles.badge, m.status === 'AUSENTE' && styles.badgeMuted]}>
                    <View style={[styles.badgeDot, m.status === 'AUSENTE' && styles.badgeDotMuted]} />
                    <Text style={[styles.badgeText, m.status === 'AUSENTE' && styles.badgeTextMuted]}>
                      {m.status === 'ACTIVO' ? 'Activo' : 'Ausente'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.role}>{m.role}</Text>
                <View style={styles.statsRow}>
                  <Text style={styles.stat}>
                    <Text style={styles.statNum}>{m.active}</Text> en curso
                  </Text>
                  <Text style={styles.sep}>·</Text>
                  <Text style={styles.stat}>
                    <Text style={styles.statNum}>{m.done}</Text> completadas
                  </Text>
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={20} color={COLORS.outline} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
