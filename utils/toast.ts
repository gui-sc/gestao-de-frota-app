// toastHelper.js
import Toast from 'react-native-toast-message';

const toastHelper = {
  success: (message: string, description: string) => {
    Toast.show({
      text1: message,
      text2: description,
      type: 'success',
      position: 'top',
      visibilityTime: 4000,
      autoHide: true,
      bottomOffset: 40,
    });
  },

  error: (message: string, description: string) => {
    Toast.show({
      text1: message,
      text2: description,
      type: 'error',
      position: 'top',
      visibilityTime: 4000,
      autoHide: true,
      bottomOffset: 40,
    });
  },

  info: (message: string, description: string) => {
    Toast.show({
      text1: message,
      text2: description,
      type: 'info',
      position: 'top',
      visibilityTime: 4000,
      autoHide: true,
      bottomOffset: 40,
    });
  },
};

export default toastHelper;
