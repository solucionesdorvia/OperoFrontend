import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/colors';
import TopAppBar from '../../components/TopAppBar';
import type { RootStackScreenProps } from '../../types/navigation';
import { styles } from './EditProfileScreen.styles';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import ErrorDialog from '../../components/ErrorDialog';
import { useErrorDialog } from '../../hooks/useErrorDialog';

type EditProfileScreenProps = RootStackScreenProps<'EditProfile'>;

export default function EditProfileScreen({ navigation }: EditProfileScreenProps) {
  const { user, refreshUser } = useAuth();

  const [name, setName] = useState(user?.fullName || '');
  const [saving, setSaving] = useState(false);
  const { dialogState, hideDialog, showError, showSuccess } = useErrorDialog();

  const getInitials = (fullName?: string) => {
    if (!fullName) return 'U';
    const parts = fullName.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  };

  const handleSave = async () => {
    if (!name.trim()) {
      showError('Error', 'Por favor ingresa un nombre');
      return;
    }

    try {
      setSaving(true);
      await userService.updateMe({ fullName: name.trim() });
      await refreshUser();
      showSuccess('Éxito', 'Perfil actualizado correctamente');
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    } catch (error: any) {
      console.error('[EditProfileScreen] Error al actualizar:', error);
      showError('Error', error.message || 'No se pudo actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TopAppBar title="Editar perfil" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        <View style={styles.avatarSection}>
          <View key={user?.fullName || 'avatar'} style={styles.avatar}>
            <Text style={styles.avatarInitials}>{getInitials(user?.fullName)}</Text>
          </View>
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
            style={[styles.input, { opacity: 0.6 }]}
            value={user?.emailUade || ''}
            editable={false}
            placeholderTextColor={COLORS.outline}
          />
          <Text style={styles.hint}>El email no puede modificarse.</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>ID de usuario</Text>
          <TextInput
            style={[styles.input, { opacity: 0.6 }]}
            value={String(user?.id || '')}
            editable={false}
            placeholderTextColor={COLORS.outline}
          />
          <Text style={styles.hint}>El ID es único y no puede modificarse.</Text>
        </View>

      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.saveBtn, saving && { opacity: 0.6 }]}
          activeOpacity={0.85}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color={COLORS.onPrimary} />
          ) : (
            <Text style={styles.saveText}>Guardar cambios</Text>
          )}
        </TouchableOpacity>
      </View>

      <ErrorDialog
        visible={dialogState.visible}
        type={dialogState.type}
        title={dialogState.title}
        message={dialogState.message}
        buttons={dialogState.buttons}
        onDismiss={hideDialog}
      />
    </KeyboardAvoidingView>
  );
}
