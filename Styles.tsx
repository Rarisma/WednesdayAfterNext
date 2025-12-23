import {useColorScheme, TextStyle, ViewStyle} from 'react-native';

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

export const useStyles = () => {
    const colors = useThemeColors();
    return {
        Text: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 1,
        } as TextStyle,

        Container: {
            backgroundColor: colors.border,
            margin: 10,
            padding: 10,
            borderWidth: 5,
            borderRadius: 5,
            borderColor: colors.border,
        } as ViewStyle,

      cell: {
        borderWidth: 1,
        borderColor: colors.text,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
      },

      filledCell: { backgroundColor: colors.text, borderColor: colors.text },
    };
};
