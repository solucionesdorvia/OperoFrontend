import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/colors';
import { FONTS } from '../../../constants/fonts';
import TopAppBar from '../../components/TopAppBar';
import type { RootStackScreenProps } from '../../types/navigation';
import { styles } from './EditProfileScreen.styles';

type EditProfileScreenProps = RootStackScreenProps<'EditProfile'>;

export default function EditProfileScreen({ navigation }: EditProfileScreenProps) {
  const [name, setName]   = useState('Alejandro Moreno');
  const [email, setEmail] = useState('a.moreno@opero.edu');
  const [phone, setPhone] = useState('+54 11 4000 0000');
  const [legajo, setLegajo] = useState('123456');

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TopAppBar title="Editar perfil" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitials}>AM</Text>
          </View>
          <TouchableOpacity style={styles.changePhoto} activeOpacity={0.7}>
            <MaterialIcons name="photo-camera" size={15} color={COLORS.onSurface} />
            <Text style={styles.changePhotoText}>Cambiar foto</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Nombre y apellido</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholderTextColor={COLORS.outline}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={COLORS.outline}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholderTextColor={COLORS.outline}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Legajo</Text>
          <TextInput
            style={[styles.input, { opacity: 0.6 }]}
            value={legajo}
            onChangeText={setLegajo}
            editable={false}
            placeholderTextColor={COLORS.outline}
          />
          <Text style={styles.hint}>El legajo no puede modificarse.</Text>
        </View>

      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.saveBtn}
          activeOpacity={0.85}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.saveText}>Guardar cambios</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
