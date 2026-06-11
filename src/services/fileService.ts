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
      // Crear FormData
      const formData = new FormData();

      // Extraer el nombre del archivo de la URI
      const filename = uri.split('/').pop() || 'image.jpg';

      // Determinar el tipo MIME basado en la extensión
      let mimeType = 'image/jpeg';
      if (filename.toLowerCase().endsWith('.png')) {
        mimeType = 'image/png';
      } else if (filename.toLowerCase().endsWith('.gif')) {
        mimeType = 'image/gif';
      } else if (filename.toLowerCase().endsWith('.webp')) {
        mimeType = 'image/webp';
      }

      // Añadir el archivo al FormData
      // @ts-ignore - React Native permite pasar un objeto con uri, name y type
      formData.append('file', {
        uri: uri,
        name: filename,
        type: mimeType,
      });

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

      return response.data.url;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};
