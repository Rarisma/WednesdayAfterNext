import { StyleSheet } from 'react-native';
import { useColorScheme } from 'react-native';

export const colors = {
  light: {
    background: '#FAFAFA',
    surface: '#FFFFFF',
    border: '#E5E5E5',
    textMuted: '#737373',
    text: '#171717',
  },
  dark: {
    background: '#0A0A0A',
    surface: '#171717',
    border: '#2E2E2E',
    textMuted: '#737373',
    text: '#EDEDED',
  },
};


export const useThemeColors = () => {
  const scheme = useColorScheme();
  return colors[scheme ?? 'light'];
};
