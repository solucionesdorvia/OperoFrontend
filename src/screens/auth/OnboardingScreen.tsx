import React, { useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Image, FlatList, Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/colors';
import { FONTS } from '../../../constants/fonts';
import type { RootStackScreenProps } from '../../types/navigation';
import { styles } from './OnboardingScreen.styles';
import { onboardingService } from '../../services/onboardingService';

const logo = require('../../../assets/operologo.png');
const { width } = Dimensions.get('window');

type Slide = {
  key: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  desc: string;
};

const slides: Slide[] = [
  {
    key: '1',
    icon: 'bolt',
    title: 'Reporta incidencias',
    desc: 'Registra fallos y problemas en instalaciones de forma rápida, con foto, ubicación y descripción.',
  },
  {
    key: '2',
    icon: 'timeline',
    title: 'Seguimiento en tiempo real',
    desc: 'Consulta el estado de cada incidencia y su línea de tiempo desde que la reportás hasta que se resuelve.',
  },
  {
    key: '3',
    icon: 'groups',
    title: 'Coordinación por equipos',
    desc: 'Gerentes y operarios de mantenimiento reciben asignaciones y priorizan el trabajo desde un mismo lugar.',
  },
];

type OnboardingScreenProps = RootStackScreenProps<'Onboarding'>;

export default function OnboardingScreen({ navigation }: OnboardingScreenProps) {
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList>(null);

  const goNext = async () => {
    if (index < slides.length - 1) {
      listRef.current?.scrollToIndex({ index: index + 1 });
    } else {
      // Marcar onboarding como completado ANTES de navegar
      try {
        await onboardingService.markAsCompleted();
      } catch (error) {
        console.error('[OnboardingScreen] Error al marcar como completado:', error);
        // NO bloquear navegación aunque falle el guardado
      }
      navigation.replace('Login');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <View style={styles.topBar}>
        <View style={styles.brand}>
          <Image source={logo} style={styles.logo} />
          <Text style={styles.wordmark}>Opero</Text>
        </View>
        <TouchableOpacity
          onPress={async () => {
            try {
              await onboardingService.markAsCompleted();
            } catch (error) {
              console.error('[OnboardingScreen] Error al saltar onboarding:', error);
            }
            navigation.replace('Login');
          }}
          hitSlop={12}
        >
          <Text style={styles.skip}>Saltar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={listRef}
        data={slides}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
          setIndex(newIndex);
        }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <View style={styles.iconWrap}>
              <MaterialIcons name={item.icon} size={52} color={COLORS.primary} />
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.desc}>{item.desc}</Text>
          </View>
        )}
      />

      <View style={[styles.bottom, { paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.dots}>
          {slides.map((slide, i) => (
            <View
              key={`dot-${slide.key}`}
              style={[styles.dot, i === index && styles.dotActive]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.primaryBtn} onPress={goNext} activeOpacity={0.85}>
          <Text style={styles.primaryText}>
            {index === slides.length - 1 ? 'Empezar' : 'Siguiente'}
          </Text>
          <MaterialIcons name="arrow-forward" size={18} color={COLORS.onPrimary} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={async () => {
            try {
              await onboardingService.markAsCompleted();
            } catch (error) {
              console.error('[OnboardingScreen] Error en login directo:', error);
            }
            navigation.replace('Login');
          }}
          style={styles.loginLink}
        >
          <Text style={styles.loginText}>
            ¿Ya tenés cuenta? <Text style={styles.loginAccent}>Ingresar</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
