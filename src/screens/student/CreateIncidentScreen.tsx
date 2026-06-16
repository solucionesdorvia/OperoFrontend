import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/colors';
import TopAppBar from '../../components/TopAppBar';
import FormField from '../../components/FormField';
import PrimaryButton from '../../components/PrimaryButton';
import ImageAttachments from '../../components/ImageAttachments';
import { useNetwork } from '../../hooks/useNetwork';
import { offlineIncidentService } from '../../services/offlineIncidentService';
import type { RootStackScreenProps } from '../../types/navigation';
import { styles } from './CreateIncidentScreen.styles';

const departments = ['Mantenimiento', 'IT', 'Seguridad', 'Limpieza'];

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
  const editing = route?.params?.incident;
  const { isOnline } = useNetwork();

  const [title,    setTitle]    = useState(editing?.title ?? '');
  const [location, setLocation] = useState(editing?.location ?? prefill?.location ?? '');
  const [description, setDescription] = useState(editing?.description ?? '');
  const [images, setImages] = useState<string[]>(editing?.images ?? []);
  const initialDept = prefill?.department
    ? Math.max(0, departments.indexOf(prefill.department))
    : Math.max(0, departments.indexOf(editing?.department ?? ''));
  const [dept, setDept] = useState(initialDept < 0 ? 0 : initialDept);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Faltan datos', 'Completá al menos el asunto y la descripción.');
      return;
    }

    setSubmitting(true);
    try {
      // Si estamos editando un reporte local existente, lo actualizamos.
      if (isEdit && editing?.localId) {
        await offlineIncidentService.update(editing.localId, {
          title: title.trim(),
          description: description.trim(),
          location: location.trim() || undefined,
          department: departments[dept],
          departmentId: dept + 1,
          images,
        });
        navigation.goBack();
        return;
      }

      // Alta: siempre se persiste local (la imagen queda en el incidente).
      // Si hay conexión, intentamos confirmarlo en el backend en el momento.
      await offlineIncidentService.save({
        title: title.trim(),
        description: description.trim(),
        location: location.trim() || undefined,
        department: departments[dept],
        departmentId: dept + 1,
        images,
      });

      if (isOnline) {
        const result = await offlineIncidentService.flushPending();
        if (result.uploaded > 0 && result.failed === 0) {
          Alert.alert('Reporte enviado', 'Tu incidencia se registró correctamente.');
        } else {
          Alert.alert(
            'Guardado',
            'No pudimos confirmar con el servidor; se subirá cuando se restablezca la conexión.',
          );
        }
      } else {
        Alert.alert(
          'Guardado sin conexión',
          'Tu incidencia quedó guardada en el dispositivo. Cuando recuperes la conexión te ofreceremos subirla.',
        );
      }

      navigation.goBack();
    } catch {
      Alert.alert('Error', 'No se pudo guardar la incidencia. Intentá de nuevo.');
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

        {!isOnline ? (
          <View style={styles.offlineNotice}>
            <MaterialIcons name="cloud-off" size={16} color={COLORS.warning} />
            <Text style={styles.offlineNoticeText}>
              Sin conexión — el reporte se guardará y podrás subirlo al reconectar.
            </Text>
          </View>
        ) : null}

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

        <FormField label="Asunto">
          <TextInput
            style={styles.input}
            placeholder="Ej. Fallo eléctrico aula 402"
            placeholderTextColor={COLORS.outline}
            value={title}
            onChangeText={setTitle}
          />
        </FormField>

        <FormField label="Ubicación">
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
        </FormField>

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

        <FormField label="Departamento">
          <View style={styles.deptGrid}>
            {departments.map((d, i) => (
              <TouchableOpacity
                key={d}
                style={[styles.deptBtn, dept === i && styles.deptBtnActive]}
                onPress={() => setDept(i)}
              >
                <Text style={[styles.deptText, dept === i && styles.deptTextActive]}>{d}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </FormField>

        <FormField label="Descripción">
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Describe brevemente lo ocurrido..."
            placeholderTextColor={COLORS.outline}
            multiline
            textAlignVertical="top"
            value={description}
            onChangeText={setDescription}
          />
        </FormField>

        <FormField label="Imágenes">
          <ImageAttachments images={images} onChange={setImages} />
        </FormField>

      </ScrollView>

      <View style={styles.bottomBar}>
        <PrimaryButton
          label={isEdit ? 'Guardar cambios' : 'Enviar reporte'}
          icon="arrow-forward"
          loading={submitting}
          onPress={handleSubmit}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
