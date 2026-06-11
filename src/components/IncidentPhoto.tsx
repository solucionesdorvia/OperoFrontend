import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { FONTS } from '../../constants/fonts';

interface IncidentPhotoProps {
  photoUrl?: string;
}

export default function IncidentPhoto({ photoUrl }: IncidentPhotoProps) {
  if (!photoUrl) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Foto adjunta</Text>
      <Image
        source={{ uri: photoUrl }}
        style={styles.photo}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: FONTS.family.bodySemiBold,
    color: COLORS.onSurface,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginTop: 8,
  },
});
