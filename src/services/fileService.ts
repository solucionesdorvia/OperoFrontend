import { api, getErrorMessage } from './api';
import { ENDPOINTS } from '../../constants/api';

export interface UploadResponse {
  url: string;
  filename: string;
}

export const fileService = {
  /**
   * Sube una imagen al servidor
   * @param uri URI local de la imagen (file://)
   * @returns URL pública de la imagen subida
   */
  async uploadImage(uri: string): Promise<string> {
    try {
      console.log('[fileService] uploadImage iniciado, URI:', uri);

      // Crear FormData
      const formData = new FormData();

      // En web, el URI es una Blob URL, necesitamos tratarla diferente
      if (uri.startsWith('blob:') || uri.startsWith('http')) {
        console.log('[fileService] URI es Blob/HTTP, convirtiendo a File...');

        // Fetch el blob y convertirlo a File
        const response = await fetch(uri);
        const blob = await response.blob();

        // Crear un File desde el Blob
        const filename = `image-${Date.now()}.jpg`;
        const file = new File([blob], filename, { type: blob.type || 'image/jpeg' });

        console.log('[fileService] File creado:', { name: file.name, type: file.type, size: file.size });

        // En web, FormData acepta directamente el File
        formData.append('file', file);
      } else {
        // En móvil (React Native), usar el formato original
        console.log('[fileService] URI es file://, usando formato React Native');

        const filename = uri.split('/').pop() || 'image.jpg';

        let mimeType = 'image/jpeg';
        if (filename.toLowerCase().endsWith('.png')) {
          mimeType = 'image/png';
        } else if (filename.toLowerCase().endsWith('.gif')) {
          mimeType = 'image/gif';
        } else if (filename.toLowerCase().endsWith('.webp')) {
          mimeType = 'image/webp';
        }

        // @ts-ignore - React Native permite pasar un objeto con uri, name y type
        formData.append('file', {
          uri: uri,
          name: filename,
          type: mimeType,
        });
      }

      console.log('[fileService] Enviando FormData al servidor...');

      // Realizar el upload
      const response = await api.post<UploadResponse>(
        `${ENDPOINTS.FILES}/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('[fileService] Upload exitoso, URL:', response.data.url);
      return response.data.url;
    } catch (error) {
      console.error('[fileService] Error en uploadImage:', error);
      throw new Error(getErrorMessage(error));
    }
  },
};
