import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Image, Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../../../constants/colors';
import TopAppBar from '../../components/TopAppBar';
import type { RootStackScreenProps } from '../../types/navigation';
import { styles } from './CreateIncidentScreen.styles';
import { incidentService } from '../../services/incidentService';
import { departmentService, DepartmentResponse } from '../../services/departmentService';
import { fileService } from '../../services/fileService';
import { offlineQueueService } from '../../services/offlineQueueService';
import { useNetwork } from '../../hooks/useNetwork';
import ErrorDialog from '../../components/ErrorDialog';
import { useErrorDialog } from '../../hooks/useErrorDialog';

type Prefill = {
  code?: string;
  location?: string;
  building?: string;
  floor?: string;
  room?: string;
  department?: string;
};

type CreateIncidentScreenProps = RootStackScreenProps<'CreateIncident'>;

export default function CreateIncidentScreen({ navigation, route }: CreateIncidentScreenProps) {
  const prefill: Prefill | undefined = route?.params?.prefill;
  const isEdit = route?.params?.mode === 'edit';
  const incident = route?.params?.incident;

  const { dialogState, hideDialog, showError, showSuccess } = useErrorDialog();
  const { isOnline } = useNetwork();

  const [departments, setDepartments] = useState<DepartmentResponse[]>([]);
  const [loadingDepts, setLoadingDepts] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState(isEdit && incident ? (incident.title || '') : '');
  const [location, setLocation] = useState(isEdit && incident ? (incident.locationDescription || '') : (prefill?.location ?? ''));
  const [description, setDescription] = useState(isEdit && incident ? (incident.description || '') : '');
  const [selectedDept, setSelectedDept] = useState(0);
  const [attachedImages, setAttachedImages] = useState<string[]>(isEdit && incident?.photoUrl ? [incident.photoUrl] : []);

  useEffect(() => {
    loadDepartments();
  }, []);

  const DEPTS_CACHE_KEY = '@opero_departments_cache';

  const applyPrefillDept = (data: DepartmentResponse[]) => {
    if (prefill?.department) {
      const index = data.findIndex(d => d.name === prefill.department);
      if (index !== -1) setSelectedDept(index);
    }
  };

  const loadDepartments = async () => {
    try {
      setLoadingDepts(true);
      const data = await departmentService.getAll();
      setDepartments(data);
      applyPrefillDept(data);
      // Cacheamos para poder crear incidencias también sin conexión.
      await AsyncStorage.setItem(DEPTS_CACHE_KEY, JSON.stringify(data));
    } catch (error: any) {
      console.error('[CreateIncidentScreen] Error al cargar departamentos:', error);
      // Sin conexión: usamos los departamentos cacheados de la última vez.
      try {
        const cached = await AsyncStorage.getItem(DEPTS_CACHE_KEY);
        if (cached) {
          const data = JSON.parse(cached) as DepartmentResponse[];
          setDepartments(data);
          applyPrefillDept(data);
        } else {
          showError('Sin conexión', 'No se pudieron cargar los departamentos. Conectate al menos una vez para poder crear reportes offline.');
        }
      } catch {
        showError('Error', 'No se pudieron cargar los departamentos');
      }
    } finally {
      setLoadingDepts(false);
    }
  };

  const handlePickImage = async () => {
    try {
      console.log('[CreateIncidentScreen] handlePickImage iniciado, Platform:', Platform.OS);

      // En web, no se necesitan permisos explícitos
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        console.log('[CreateIncidentScreen] Permiso de galería:', status);

        if (status !== 'granted') {
          showError('Permiso denegado', 'Necesitamos acceso a tus fotos para adjuntar imágenes.');
          return;
        }
      }

      console.log('[CreateIncidentScreen] Abriendo selector de imágenes...');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: Platform.OS !== 'web', // En web solo una imagen a la vez
        quality: 0.5,
        allowsEditing: false,
      });

      console.log('[CreateIncidentScreen] Resultado del picker:', result);

      if (!result.canceled && result.assets) {
        const newImages = result.assets.map(asset => asset.uri);
        console.log('[CreateIncidentScreen] Imágenes seleccionadas:', newImages);
        setAttachedImages([...attachedImages, ...newImages]);
      }
    } catch (error) {
      console.error('[CreateIncidentScreen] Error al seleccionar imagen:', error);
      showError('Error', 'No se pudo seleccionar la imagen');
    }
  };

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== 'granted') {
        showError('Permiso denegado', 'Necesitamos acceso a tu cámara para tomar fotos.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        quality: 0.5,
        allowsEditing: false,
      });

      if (!result.canceled && result.assets) {
        const newImage = result.assets[0].uri;
        setAttachedImages([...attachedImages, newImage]);
      }
    } catch (error) {
      console.error('[CreateIncidentScreen] Error al tomar foto:', error);
      showError('Error', 'No se pudo tomar la foto');
    }
  };

  const handleAttachFile = () => {
    // En web, Alert.alert no funciona, por lo que vamos directo a seleccionar imagen
    if (Platform.OS === 'web') {
      handlePickImage();
    } else {
      // En móvil (iOS y Android): mostrar opciones de cámara o galería
      Alert.alert(
        'Adjuntar imagen',
        '¿Cómo querés agregar la imagen?',
        [
          { text: 'Tomar foto', onPress: () => { handleTakePhoto(); } },
          { text: 'Elegir de galería', onPress: () => { handlePickImage(); } },
          { text: 'Cancelar', style: 'cancel' },
        ],
        { cancelable: true },
      );
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...attachedImages];
    newImages.splice(index, 1);
    setAttachedImages(newImages);
  };

  const handleSubmit = async () => {
    // Validaciones
    if (!title.trim()) {
      showError('Error', 'Por favor ingresa un título');
      return;
    }

    if (!description.trim()) {
      showError('Error', 'Por favor ingresa una descripción');
      return;
    }

    // Si estamos en modo edición, actualizamos título, descripción y foto
    if (isEdit && incident) {
      try {
        setSubmitting(true);

        // Determinar el photoUrl a enviar:
        // - Si no hay imágenes adjuntas → enviar "" (vacío) para eliminar la foto
        // - Si hay una imagen nueva (local, no es URL http) → subirla primero
        // - Si es la misma URL que ya tenía → no cambiar nada (undefined)
        let photoUrlToSend: string | undefined = undefined;

        if (attachedImages.length === 0) {
          // Usuario eliminó la imagen → enviar "" para borrarla del backend
          photoUrlToSend = '';
        } else if (attachedImages[0] !== incident.photoUrl) {
          // Hay una imagen nueva (local) → subirla
          if (!attachedImages[0].startsWith('http')) {
            photoUrlToSend = await fileService.uploadImage(attachedImages[0]);
          } else {
            // Es una URL diferente a la original (caso raro, pero manejarlo)
            photoUrlToSend = attachedImages[0];
          }
        }
        // Si attachedImages[0] === incident.photoUrl → no enviar photoUrl (undefined)

        await incidentService.update(incident.id, {
          title: title.trim(),
          description: description.trim(),
          ...(photoUrlToSend !== undefined && { photoUrl: photoUrlToSend }),
        });

        showSuccess('Éxito', 'Incidencia actualizada correctamente');
        setTimeout(() => {
          navigation.goBack();
        }, 1000);
      } catch (error: any) {
        console.error('[CreateIncidentScreen] Error al actualizar incidencia:', error);
        showError('Error', error.message || 'No se pudo actualizar la incidencia');
      } finally {
        setSubmitting(false);
      }
      return;
    }

    // El alumno NO elige departamento — siempre se asigna al primero (Mantenimiento
    // por convención del seed) y el manager lo reasigna después con PUT /department.
    // Esto simplifica el form para el alumno y centraliza la decisión en el manager.
    const defaultDepartment = departments[0] ?? { id: 1, name: 'Mantenimiento' };

    // Helper: detecta si un error es por falta de red. Lo usamos para fallback
    // al modo offline cuando isOnline da true (default inicial mientras NetInfo
    // sincroniza) pero el fetch real falla con Network Error.
    const isNetworkError = (err: any) => {
      const msg = (err?.message || '').toLowerCase();
      return (
        msg.includes('no se pudo conectar') ||
        msg.includes('network error') ||
        msg.includes('tardó demasiado') ||
        err?.code === 'ECONNABORTED' ||
        err?.code === 'ERR_NETWORK'
      );
    };

    const queueOfflineAndExit = async (baseData: any) => {
      await offlineQueueService.enqueue({
        ...baseData,
        departmentName: defaultDepartment.name,
        imageUris: attachedImages,
      });
      showSuccess(
        'Guardado sin conexión',
        'El reporte quedó guardado y se subirá cuando recuperes la conexión.',
      );
      setTimeout(() => {
        navigation.navigate('StudentTabs', { screen: 'StudentHome' });
      }, 1000);
    };

    try {
      setSubmitting(true);

      const baseData = {
        title: title.trim(),
        description: description.trim(),
        departmentId: defaultDepartment.id,
        locationDescription: location.trim() || undefined,
      };

      // Caso 1 — NetInfo ya nos confirmó que estamos offline: directo al queue.
      if (!isOnline) {
        await queueOfflineAndExit(baseData);
        return;
      }

      // Caso 2 — NetInfo dice online (puede ser el estado por default antes de
      // que sincronice). Intentamos el upload normal. Si falla por red,
      // hacemos fallback transparente al queue sin mostrar el error.
      try {
        let photoUrl: string | undefined;
        if (attachedImages.length > 0) {
          photoUrl = await fileService.uploadImage(attachedImages[0]);
        }

        await incidentService.create({ ...baseData, photoUrl });

        showSuccess('Éxito', 'Incidencia creada correctamente');
        setTimeout(() => {
          navigation.navigate('StudentTabs', { screen: 'StudentHome' });
        }, 1000);
      } catch (uploadErr: any) {
        if (isNetworkError(uploadErr)) {
          // Era falsa "conexión": encolamos en silencio. Lo subirá el
          // OfflineSyncManager cuando NetInfo reporte online de verdad.
          console.log('[CreateIncidentScreen] Sin red real, fallback a queue offline:', uploadErr.message);
          await queueOfflineAndExit(baseData);
          return;
        }
        // Otros errores (validación, 4xx, 5xx) sí los reportamos.
        throw uploadErr;
      }
    } catch (error: any) {
      console.error('[CreateIncidentScreen] Error al crear incidencia:', error);
      showError('Error', error.message || 'No se pudo crear la incidencia');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TopAppBar
        title={isEdit ? 'Editar reporte' : 'Nuevo reporte'}
        onBack={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        {prefill ? (
          <View style={styles.qrBanner}>
            <View style={styles.qrIcon}>
              <MaterialIcons name="qr-code-2" size={18} color={COLORS.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.qrTitle}>Ubicación cargada por QR</Text>
              <Text style={styles.qrSub}>
                {prefill.code ? `${prefill.code} · ` : ''}
                {prefill.location ?? ''}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setLocation('')} hitSlop={8}>
              <MaterialIcons name="close" size={16} color={COLORS.onSurfaceVariant} />
            </TouchableOpacity>
          </View>
        ) : null}

        <View style={styles.field}>
          <Text style={styles.label}>Asunto</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. Fallo eléctrico aula 402"
            placeholderTextColor={COLORS.outline}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Ubicación</Text>
          <View style={styles.inputRow}>
            <MaterialIcons name="location-on" size={16} color={COLORS.onSurfaceVariant} style={{ marginLeft: 12 }} />
            <TextInput
              style={[styles.input, { flex: 1, borderWidth: 0, paddingLeft: 8 }]}
              placeholder="Edificio B, Planta 2"
              placeholderTextColor={COLORS.outline}
              value={location}
              onChangeText={setLocation}
            />
            <TouchableOpacity
              style={styles.qrInlineBtn}
              onPress={() => navigation.navigate('ScanQR')}
              hitSlop={8}
            >
              <MaterialIcons name="qr-code-scanner" size={18} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {prefill && (prefill.building || prefill.floor || prefill.room) ? (
          <View style={styles.chipsRow}>
            {prefill.building ? (
              <View style={styles.chip}>
                <Text style={styles.chipText}>{prefill.building}</Text>
              </View>
            ) : null}
            {prefill.floor ? (
              <View style={styles.chip}>
                <Text style={styles.chipText}>Piso {prefill.floor}</Text>
              </View>
            ) : null}
            {prefill.room ? (
              <View style={styles.chip}>
                <Text style={styles.chipText}>Aula {prefill.room}</Text>
              </View>
            ) : null}
          </View>
        ) : null}

        <View style={styles.field}>
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Describe brevemente lo ocurrido..."
            placeholderTextColor={COLORS.outline}
            multiline
            textAlignVertical="top"
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <TouchableOpacity style={styles.photoBtn} activeOpacity={0.7} onPress={handleAttachFile}>
          <MaterialIcons name="add-a-photo" size={18} color={COLORS.onSurfaceVariant} />
          <Text style={styles.photoBtnText}>Adjuntar imagen (cámara o galería)</Text>
        </TouchableOpacity>

        {attachedImages.length > 0 && (
          <View style={styles.imagesContainer}>
            <Text style={styles.label}>Imágenes adjuntas ({attachedImages.length})</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesScroll}>
              {attachedImages.map((imageUri, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image source={{ uri: imageUri }} style={styles.attachedImage} />
                  <TouchableOpacity
                    style={styles.removeImageBtn}
                    onPress={() => handleRemoveImage(index)}
                    hitSlop={8}
                  >
                    <MaterialIcons name="close" size={16} color={COLORS.onPrimary} />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.submitBtn, submitting && { opacity: 0.6 }]}
          activeOpacity={0.85}
          onPress={handleSubmit}
          disabled={submitting || loadingDepts}
        >
          {submitting ? (
            <ActivityIndicator color={COLORS.onPrimary} />
          ) : (
            <>
              <Text style={styles.submitText}>{isEdit ? 'Guardar cambios' : 'Enviar reporte'}</Text>
              <MaterialIcons name="arrow-forward" size={18} color={COLORS.onPrimary} />
            </>
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
