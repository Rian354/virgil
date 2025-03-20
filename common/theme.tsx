import { MD3LightTheme, MD3DarkTheme } from "react-native-paper";

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#6200ee",
    background: "#ffffff",
    text: "#000000",
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#bb86fc",
    background: "#121212",
    text: "#ffffff", // used if you explicitly reference theme.colors.text
    surface: "#303030",
    onSurface: "#ffffff", // overrides text used on surfaces
    onBackground: "#ffffff", // ensures text on background is white
  },
};
