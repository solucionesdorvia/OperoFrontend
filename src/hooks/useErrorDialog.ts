import { useState, useCallback } from 'react';
import { Keyboard } from 'react-native';
import { DialogType, DialogButton } from '../components/ErrorDialog/ErrorDialog';

type ShowDialogParams = {
  type?: DialogType;
  title: string;
  message: string;
  buttons?: DialogButton[];
};

export function useErrorDialog() {
  const [dialogState, setDialogState] = useState<{
    visible: boolean;
    type: DialogType;
    title: string;
    message: string;
    buttons: DialogButton[];
  }>({
    visible: false,
    type: 'error',
    title: '',
    message: '',
    buttons: [],
  });

  const showDialog = useCallback((params: ShowDialogParams) => {
    Keyboard.dismiss(); // Cerrar keyboard antes de mostrar dialog
    setDialogState({
      visible: true,
      type: params.type || 'error',
      title: params.title,
      message: params.message,
      buttons: params.buttons || [{ text: 'OK', style: 'default' }],
    });
  }, []);

  const hideDialog = useCallback(() => {
    setDialogState(prev => ({ ...prev, visible: false }));
  }, []);

  // Helpers tipados
  const showError = useCallback((title: string, message: string, buttons?: DialogButton[]) => {
    showDialog({ type: 'error', title, message, buttons });
  }, [showDialog]);

  const showWarning = useCallback((title: string, message: string, buttons?: DialogButton[]) => {
    showDialog({ type: 'warning', title, message, buttons });
  }, [showDialog]);

  const showSuccess = useCallback((title: string, message: string, buttons?: DialogButton[]) => {
    showDialog({ type: 'success', title, message, buttons });
  }, [showDialog]);

  const showInfo = useCallback((title: string, message: string, buttons?: DialogButton[]) => {
    showDialog({ type: 'info', title, message, buttons });
  }, [showDialog]);

  const showConfirmation = useCallback(
    (title: string, message: string, onConfirm: () => void, onCancel?: () => void) => {
      showDialog({
        type: 'warning',
        title,
        message,
        buttons: [
          { text: 'Cancelar', style: 'cancel', onPress: onCancel },
          { text: 'Confirmar', style: 'destructive', onPress: onConfirm },
        ],
      });
    },
    [showDialog]
  );

  return {
    dialogState,
    showDialog,
    hideDialog,
    showError,
    showWarning,
    showSuccess,
    showInfo,
    showConfirmation,
  };
}
