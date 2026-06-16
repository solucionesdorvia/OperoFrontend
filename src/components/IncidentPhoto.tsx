import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { FONTS } from '../../constants/fonts';

interface IncidentPhotoProps {
  photoUrl?: string;
}

export default function IncidentPhoto({ photoUrl }: IncidentPhotoProps) {
  const [modalVisible, setModalVisible] = useState(false);

  if (!photoUrl) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Foto adjunta</Text>
      <TouchableOpacity onPress={() => setModalVisible(true)} activeOpacity={0.8}>
        <Image
          source={{ uri: photoUrl }}
          style={styles.photo}
          resizeMode="cover"
        />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
              hitSlop={20}
            >
              <MaterialIcons name="close" size={30} color={COLORS.onPrimary} />
            </TouchableOpacity>
            <Image
              source={{ uri: photoUrl }}
              style={styles.fullscreenImage}
              resizeMode="contain"
            />
          </View>
        </Pressable>
      </Modal>
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
  },
});
