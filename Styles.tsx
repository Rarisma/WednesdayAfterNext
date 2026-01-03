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
            backgroundColor: colors.background,
            margin: 5,
            padding: 10,
            borderWidth: 5,
            borderRadius: 36,
            borderColor: colors.border,
        } as ViewStyle,

        HorizontalContainer: {
            backgroundColor: colors.border,
            margin: 5,
            padding: 10,
            borderWidth: 5,
            borderRadius: 36,
            borderColor: colors.border,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
        } as ViewStyle,

        Page: {
            backgroundColor: colors.background,
            margin:0,
            padding:0,
            flex:1
        } as ViewStyle,

      cell: {
        borderWidth: 1,
        borderColor: colors.text,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
      },

      Button: {
          borderRadius: 64,
          backgroundColor: "#19647E",
          height:50,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row'
      } as ViewStyle,

      IconButton: {
          width:50,
          justifyContent:'center',
          marginRight:10,
          borderRadius: 64,
          backgroundColor: "#19647E",
          height:50,
          alignItems: 'center',
      } as ViewStyle,

      filledCell: { backgroundColor: colors.text, borderColor: colors.text },
    };
};
