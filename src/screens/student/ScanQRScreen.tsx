import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Animated, Easing, Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CameraView, Camera } from 'expo-camera';
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
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(false);

  useEffect(() => {
    requestCameraPermission();

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

  const requestCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');

    if (status !== 'granted') {
      Alert.alert(
        'Permiso de cámara requerido',
        'Necesitamos acceso a tu cámara para escanear códigos QR.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }
  };

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;

    setScanned(true);
    console.log('[ScanQRScreen] QR escaneado:', data);

    // Parsear el contenido del QR
    // Formato esperado: "UADE-6-665" o un JSON con más datos
    try {
      let qrData: any = {};

      if (data.startsWith('{')) {
        qrData = JSON.parse(data);
      } else {
        // Formato simple UADE-piso-aula
        const parts = data.split('-');
        if (parts.length === 3) {
          qrData = {
            code: data,
            building: parts[0],
            floor: parts[1],
            room: parts[2],
            location: `Piso ${parts[1]} · Aula ${parts[2]}`,
            department: 'Mantenimiento',
          };
        } else {
          qrData = {
            code: data,
            location: data,
          };
        }
      }

      navigation.replace('CreateIncident', {
        prefill: qrData,
      });
    } catch (error) {
      console.error('[ScanQRScreen] Error al parsear QR:', error);
      navigation.replace('CreateIncident', {
        prefill: {
          code: data,
          location: data,
        },
      });
    }
  };

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

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Solicitando permiso de cámara...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>No se concedió permiso para usar la cámara</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.simulateBtn}>
          <Text style={styles.simulateText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        enableTorch={flashEnabled}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      />

      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.closeBtn}
          hitSlop={12}
        >
          <MaterialIcons name="close" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: '#FFFFFF' }]}>Escanear QR</Text>
        <TouchableOpacity
          style={styles.closeBtn}
          hitSlop={12}
          onPress={() => setFlashEnabled(!flashEnabled)}
        >
          <MaterialIcons
            name={flashEnabled ? 'flash-on' : 'flash-off'}
            size={20}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.center}>
        <Text style={[styles.title, { color: '#FFFFFF' }]}>Escaneá el QR del aula</Text>
        <Text style={[styles.subtitle, { color: '#FFFFFF' }]}>
          Ubicá el código dentro del marco para cargar{'\n'}
          automáticamente la ubicación del reporte.
        </Text>

        <View style={styles.viewfinder}>
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />
          <Animated.View style={[styles.scanLine, { transform: [{ translateY }] }]} />
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
