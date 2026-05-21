import React, { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Animated, Easing,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../../constants/colors';
import { FONTS } from '../../../constants/fonts';
import type { RootStackScreenProps } from '../../types/navigation';
import { styles } from './ScanQRScreen.styles';

const recentScans = [
  { code: 'UADE-6-665', location: 'Piso 6 · Aula 665 · UADE Labs',     time: 'Hace 2 d' },
  { code: 'UADE-4-412', location: 'Piso 4 · Aula 412 · Edificio Norte', time: 'Hace 5 d' },
];

type ScanQRScreenProps = RootStackScreenProps<'ScanQR'>;

export default function ScanQRScreen({ navigation }: ScanQRScreenProps) {
  const insets = useSafeAreaInsets();
  const scanLine = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLine, {
          toValue: 1,
          duration: 1600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scanLine, {
          toValue: 0,
          duration: 1600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [scanLine]);

  const simulateScan = (code: string, location: string) => {
    navigation.replace('CreateIncident', {
      prefill: {
        code,
        location,
        building: 'UADE Labs',
        floor: '6',
        room: '665',
        department: 'Mantenimiento',
      },
    });
  };

  const translateY = scanLine.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200],
  });

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.closeBtn}
          hitSlop={12}
        >
          <MaterialIcons name="close" size={22} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Escanear QR</Text>
        <TouchableOpacity style={styles.closeBtn} hitSlop={12}>
          <MaterialIcons name="flash-on" size={20} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.center}>
        <Text style={styles.title}>Escaneá el QR del aula</Text>
        <Text style={styles.subtitle}>
          Ubicá el código dentro del marco para cargar{'\n'}
          automáticamente la ubicación del reporte.
        </Text>

        <View style={styles.viewfinder}>
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />
          <Animated.View style={[styles.scanLine, { transform: [{ translateY }] }]} />
          <MaterialIcons name="qr-code-scanner" size={56} color={COLORS.outlineStrong} />
        </View>

        <TouchableOpacity
          style={styles.simulateBtn}
          activeOpacity={0.85}
          onPress={() => simulateScan('UADE-6-665', 'Piso 6 · Aula 665 · UADE Labs')}
        >
          <MaterialIcons name="qr-code-2" size={18} color={COLORS.onPrimary} />
          <Text style={styles.simulateText}>Simular escaneo</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.bottomSheet, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.handle} />
        <Text style={styles.sheetTitle}>Escaneos recientes</Text>
        <View style={styles.sheetList}>
          {recentScans.map((s) => (
            <TouchableOpacity
              key={s.code}
              style={styles.sheetItem}
              activeOpacity={0.7}
              onPress={() => simulateScan(s.code, s.location)}
            >
              <View style={styles.sheetIcon}>
                <MaterialIcons name="qr-code" size={16} color={COLORS.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.sheetLocation}>{s.location}</Text>
                <Text style={styles.sheetCode}>{s.code} · {s.time}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={18} color={COLORS.outline} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}
