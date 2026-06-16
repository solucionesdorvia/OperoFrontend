// Adjuntar imágenes a un reporte.
//
// Abre la galería con expo-image-picker (funciona en web y nativo), convierte
// cada selección a un data URI base64 y los devuelve vía onChange. Guardar el
// base64 — y no la uri temporal (blob:) — es lo que hace que las imágenes
// "queden" en el incidente aunque no haya conexión.

import React from 'react';
import { View, Text, Image, TouchableOpacity, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { styles } from './ImageAttachments.styles';

type ImageAttachmentsProps = {
  images: string[];
  onChange: (next: string[]) => void;
  max?: number;
};

const toDataUri = (asset: ImagePicker.ImagePickerAsset): string | null => {
  if (!asset.base64) {
    // Sin base64 (caso raro) caemos a la uri tal cual; en web suele ser data:.
    return asset.uri ?? null;
  }
  const mime = asset.mimeType ?? 'image/jpeg';
  return `data:${mime};base64,${asset.base64}`;
};

export default function ImageAttachments({ images, onChange, max = 5 }: ImageAttachmentsProps) {
  const atLimit = images.length >= max;

  const pickImage = async () => {
    if (atLimit) {
      Alert.alert('Límite alcanzado', `Podés adjuntar hasta ${max} imágenes.`);
      return;
    }

    // En nativo pedimos permiso de galería; en web no hace falta.
    if (Platform.OS !== 'web') {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Permiso necesario', 'Habilitá el acceso a fotos para adjuntar imágenes.');
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      base64: true,
      quality: 0.6,
      allowsMultipleSelection: true,
      selectionLimit: max - images.length,
    });

    if (result.canceled) return;

    const picked = result.assets
      .map(toDataUri)
      .filter((uri): uri is string => Boolean(uri));

    onChange([...images, ...picked].slice(0, max));
  };

  const removeAt = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      {images.length > 0 ? (
        <View style={styles.grid}>
          {images.map((uri, i) => (
            <View key={`${uri.slice(0, 24)}-${i}`} style={styles.thumbWrap}>
              <Image source={{ uri }} style={styles.thumb} />
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => removeAt(i)}
                hitSlop={8}
                activeOpacity={0.8}
              >
                <MaterialIcons name="close" size={14} color={COLORS.onPrimary} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      ) : null}

      {!atLimit ? (
        <TouchableOpacity style={styles.addBtn} activeOpacity={0.7} onPress={pickImage}>
          <MaterialIcons name="add-a-photo" size={18} color={COLORS.onSurfaceVariant} />
          <Text style={styles.addBtnText}>
            {images.length > 0 ? 'Agregar otra imagen' : 'Adjuntar imagen'}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
