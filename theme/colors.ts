interface ColorScheme {
  primary: {
    main: string;
    light: string;
    dark: string;
    contrast: string;
  };
  secondary: {
    main: string;
    light: string;
    dark: string;
    contrast: string;
  };
  background: {
    default: string;
    paper: string;
    dark: string;
  };
  text: {
    primary: string;
    secondary: string;
    disabled: string;
  };
  error: string;
  success: string;
  warning: string;
  info: string;
}

const lightColors: ColorScheme = {
  primary: {
    main: '#1E88E5', // Trustworthy blue
    light: '#64B5F6',
    dark: '#1565C0',
    contrast: '#FFFFFF',
  },
  secondary: {
    main: '#FFFFFF',
    light: '#F5F5F5',
    dark: '#E0E0E0',
    contrast: '#1E88E5',
  },
  background: {
    default: '#FFFFFF',
    paper: '#F5F5F5',
    dark: '#E3F2FD',
  },
  text: {
    primary: '#212121',
    secondary: '#757575',
    disabled: '#9E9E9E',
  },
  error: '#D32F2F',
  success: '#2E7D32',
  warning: '#FFA000',
  info: '#0288D1',
};

const darkColors: ColorScheme = {
  primary: {
    main: '#2196F3', // Brighter blue for dark mode
    light: '#90CAF9',
    dark: '#1976D2',
    contrast: '#FFFFFF',
  },
  secondary: {
    main: '#424242',
    light: '#616161',
    dark: '#212121',
    contrast: '#2196F3',
  },
  background: {
    default: '#121212',
    paper: '#1E1E1E',
    dark: '#0A0A0A',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#B0B0B0',
    disabled: '#757575',
  },
  error: '#EF5350',
  success: '#4CAF50',
  warning: '#FFC107',
  info: '#29B6F6',
};

export const getColors = (isDarkMode: boolean): ColorScheme => {
  return isDarkMode ? darkColors : lightColors;
}; 