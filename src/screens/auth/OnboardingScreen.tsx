import React, { useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, Pressable, StyleSheet, Image, FlatList, Dimensions, useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/colors';
import { FONTS } from '../../../constants/fonts';
import type { RootStackScreenProps } from '../../types/navigation';
import { styles } from './OnboardingScreen.styles';
import { onboardingService } from '../../services/onboardingService';

const logo = require('../../../assets/operologo.png');

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
  const { width, height } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList>(null);

  // Calcular altura disponible para el slide: altura total - topBar - bottom - padding
  // topBar ≈ 60px, bottom ≈ 200px, padding top/bottom ≈ 40px
  const slideHeight = height - insets.top - insets.bottom - 300;

  const goNext = async () => {
    console.log('[OnboardingScreen] goNext llamado, index actual:', index);
    if (index < slides.length - 1) {
      const nextIndex = index + 1;
      console.log('[OnboardingScreen] Scrolling to index:', nextIndex);
      // Usar scrollToOffset en lugar de scrollToIndex para mejor compatibilidad web
      listRef.current?.scrollToOffset({ offset: nextIndex * width, animated: true });
      setIndex(nextIndex);
    } else {
      // Marcar onboarding como completado ANTES de navegar
      console.log('[OnboardingScreen] Último slide, marcando como completado');
      try {
        await onboardingService.markAsCompleted();
      } catch (error) {
        console.error('[OnboardingScreen] Error al marcar como completado:', error);
        // NO bloquear navegación aunque falle el guardado
      }
      console.log('[OnboardingScreen] Navegando a Login');
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

      <View style={styles.flatListWrapper}>
        <FlatList
          ref={listRef}
          data={slides}
          keyExtractor={(item) => item.key}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={{ flex: 1 }}
          onMomentumScrollEnd={(e) => {
            const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
            setIndex(newIndex);
          }}
          renderItem={({ item }) => (
            <View style={[styles.slide, { width, height: slideHeight }]}>
              <View style={styles.iconWrap}>
                <MaterialIcons name={item.icon} size={52} color={COLORS.primary} />
              </View>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.desc}>{item.desc}</Text>
            </View>
          )}
        />
      </View>

      <View style={[styles.bottom, { paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.dots}>
          {slides.map((slide, i) => (
            <View
              key={`dot-${slide.key}`}
              style={[styles.dot, i === index && styles.dotActive]}
            />
          ))}
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.primaryBtn,
            pressed && { opacity: 0.85 }
          ]}
          onPress={goNext}
          accessible={true}
          accessibilityRole="button"
        >
          <Text style={styles.primaryText}>
            {index === slides.length - 1 ? 'Empezar' : 'Siguiente'}
          </Text>
          <MaterialIcons name="arrow-forward" size={18} color={COLORS.onPrimary} />
        </Pressable>

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
