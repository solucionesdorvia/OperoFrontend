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

  const { dialogState, hideDialog, showError, showSuccess } = useErrorDialog();
  const { isOnline } = useNetwork();

  const [departments, setDepartments] = useState<DepartmentResponse[]>([]);
  const [loadingDepts, setLoadingDepts] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState(prefill?.location ?? '');
  const [description, setDescription] = useState('');
  const [selectedDept, setSelectedDept] = useState(0);
  const [attachedImages, setAttachedImages] = useState<string[]>([]);

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
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        showError('Permiso denegado', 'Necesitamos acceso a tus fotos para adjuntar imágenes.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.5,
        allowsEditing: false,
      });

      if (!result.canceled && result.assets) {
        const newImages = result.assets.map(asset => asset.uri);
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
    // Chooser cross-platform (iOS y Android): tomar foto con la cámara o
    // elegir de la galería. Alert.alert soporta hasta 3 botones en ambos.
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

    if (departments.length === 0) {
      showError('Error', 'No hay departamentos disponibles');
      return;
    }

    const selectedDepartment = departments[selectedDept];
    if (!selectedDepartment || !selectedDepartment.id) {
      showError('Error', 'Por favor selecciona un departamento válido');
      return;
    }

    try {
      setSubmitting(true);

      const baseData = {
        title: title.trim(),
        description: description.trim(),
        departmentId: selectedDepartment.id,
        locationDescription: location.trim() || undefined,
      };

      // Sin conexión: guardamos el reporte (con las imágenes locales) en la
      // cola y avisamos. OfflineSyncManager lo subirá al reconectar.
      if (!isOnline) {
        await offlineQueueService.enqueue({
          ...baseData,
          departmentName: selectedDepartment.name,
          imageUris: attachedImages,
        });
        showSuccess(
          'Guardado sin conexión',
          'El reporte quedó guardado y se subirá cuando recuperes la conexión.',
        );
        setTimeout(() => {
          navigation.navigate('StudentTabs', { screen: 'StudentHome' });
        }, 1000);
        return;
      }

      // Con conexión: subimos la imagen (si hay) y creamos el incidente.
      let photoUrl: string | undefined;
      if (attachedImages.length > 0) {
        try {
          console.log('[CreateIncidentScreen] Subiendo imagen...');
          photoUrl = await fileService.uploadImage(attachedImages[0]);
          console.log('[CreateIncidentScreen] Imagen subida correctamente:', photoUrl);
        } catch (error: any) {
          console.error('[CreateIncidentScreen] Error al subir imagen:', error);
          showError('Error', 'No se pudo subir la imagen. Intenta nuevamente.');
          return;
        }
      }

      await incidentService.create({ ...baseData, photoUrl });

      showSuccess('Éxito', 'Incidencia creada correctamente');

      // Ir al inicio y refrescar
      setTimeout(() => {
        navigation.navigate('StudentTabs', { screen: 'StudentHome' });
      }, 1000);
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
          <Text style={styles.label}>Departamento</Text>
          {loadingDepts ? (
            <ActivityIndicator color={COLORS.primary} style={{ marginVertical: 16 }} />
          ) : (
            <View style={styles.deptGrid}>
              {departments.map((d, i) => (
                <TouchableOpacity
                  key={d.id}
                  style={[styles.deptBtn, selectedDept === i && styles.deptBtnActive]}
                  onPress={() => setSelectedDept(i)}
                >
                  <Text style={[styles.deptText, selectedDept === i && styles.deptTextActive]}>{d.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

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
