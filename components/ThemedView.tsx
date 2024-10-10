import { defaultSpacing } from "@/lib/constants";
import { useThemeColors } from "@/lib/hooks";
import Constants from "expo-constants";
import { View, type ViewProps } from "react-native";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  statusBarPadding?: boolean;
  horizontalPadding?: boolean;
  noBackgroundColor?: boolean;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  statusBarPadding,
  horizontalPadding,
  noBackgroundColor,
  ...otherProps
}: ThemedViewProps) {
  const colors = useThemeColors({ light: lightColor, dark: darkColor });

  const backgroundColor = !noBackgroundColor
    ? typeof colors !== "string"
      ? colors.background
      : colors
    : undefined;

  const paddingTop = statusBarPadding ? Constants.statusBarHeight + defaultSpacing : undefined;
  const paddingHorizontal = horizontalPadding ? defaultSpacing : undefined;

  return (
    <View style={[{ backgroundColor, paddingTop, paddingHorizontal }, style]} {...otherProps} />
  );
}
