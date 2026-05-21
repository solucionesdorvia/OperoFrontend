import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/colors';
import { FONTS } from '../../../constants/fonts';
import TopAppBar from '../../components/TopAppBar';
import StatusBadge from '../../components/StatusBadge';
import type { RootStackScreenProps } from '../../types/navigation';
import { styles } from './ManagerIncidentDetailScreen.styles';

const priorities = ['Baja', 'Media', 'Alta'];
const departments = ['Mantenimiento General', 'Sistemas Hidráulicos', 'Electricidad', 'Limpieza Técnica'];
const employees = ['Sin asignar', 'Carlos Mendoza', 'Elena Rivas', 'Marcos Polo'];

type ManagerIncidentDetailScreenProps = RootStackScreenProps<'ManagerIncidentDetail'>;

export default function ManagerIncidentDetailScreen({ navigation, route }: ManagerIncidentDetailScreenProps) {
  const incident = route?.params?.incident;
  const [priority, setPriority] = useState(2);
  const [dept, setDept] = useState(1);
  const [employee, setEmployee] = useState(0);

  return (
    <View style={styles.container}>
      <TopAppBar title="Gestionar incidencia" onBack={() => navigation.goBack()} showAvatar />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.id}>#INC-8821</Text>
            <StatusBadge status="CRITICO" />
          </View>
          <Text style={styles.title}>{incident?.title ?? 'Rotura de tubería principal en ala norte'}</Text>
          <Text style={styles.location}>
            <MaterialIcons name="location-on" size={13} color={COLORS.onSurfaceVariant} />
            {' '}{incident?.location ?? 'Edificio Central · Lab 204'}
          </Text>
        </View>

        <View style={styles.photoPlaceholder}>
          <MaterialIcons name="image" size={32} color={COLORS.outline} />
          <Text style={styles.photoLabel}>Archivo #8821-A</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.desc}>
            Fuga masiva de agua potable en el techo del laboratorio 204. El agua está afectando equipos de alta precisión. Requiere intervención inmediata.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prioridad</Text>
          <View style={styles.priorityBtns}>
            {priorities.map((p, i) => (
              <TouchableOpacity
                key={p}
                style={[styles.priorityBtn, priority === i && styles.priorityBtnActive]}
                onPress={() => setPriority(i)}
              >
                <Text style={[styles.priorityBtnText, priority === i && styles.priorityBtnTextActive]}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Departamento</Text>
          <View style={styles.select}>
            <Text style={styles.selectText}>{departments[dept]}</Text>
            <MaterialIcons name="expand-more" size={20} color={COLORS.onSurfaceVariant} />
          </View>
        </View>

        <View style={[styles.section, { paddingBottom: 120 }]}>
          <Text style={styles.sectionTitle}>Asignar operario</Text>
          <View style={styles.select}>
            <Text style={styles.selectText}>{employees[employee]}</Text>
            <MaterialIcons name="keyboard-arrow-down" size={20} color={COLORS.onSurfaceVariant} />
          </View>
        </View>

      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.saveBtn} onPress={() => navigation.goBack()} activeOpacity={0.85}>
          <Text style={styles.saveBtnText}>Guardar cambios</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
