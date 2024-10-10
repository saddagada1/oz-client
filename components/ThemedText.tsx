import { useThemeColors } from "@/lib/hooks";
import { Text, type TextProps, StyleSheet } from "react-native";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?:
    | "normal"
    | "normalFat"
    | "xxl"
    | "xxlFat"
    | "xl"
    | "xlFat"
    | "l"
    | "lFat"
    | "m"
    | "mFat"
    | "s"
    | "sFat"
    | "xs"
    | "xsFat";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "normal",
  ...rest
}: ThemedTextProps) {
  const colors = useThemeColors({ light: lightColor, dark: darkColor });

  const color = typeof colors !== "string" ? colors.foreground : colors;

  return <Text style={[{ color }, styles.default, styles[type], style]} {...rest} />;
}

const styles = StyleSheet.create({
  default: {
    fontFamily: "SpaceMono",
    textTransform: "uppercase",
  },
  normal: {
    fontSize: 16,
  },
  normalFat: {
    fontSize: 16,
    fontWeight: "500",
  },
  xxl: {
    fontSize: 32,
  },
  xxlFat: {
    fontSize: 32,
    fontWeight: "500",
  },
  xl: {
    fontSize: 24,
  },
  xlFat: {
    fontSize: 24,
    fontWeight: "500",
  },
  l: {
    fontSize: 18,
  },
  lFat: {
    fontSize: 18,
    fontWeight: "500",
  },
  m: {
    fontSize: 14,
  },
  mFat: {
    fontSize: 14,
    fontWeight: "500",
  },
  s: {
    fontSize: 12,
  },
  sFat: {
    fontSize: 12,
    fontWeight: "500",
  },
  xs: {
    fontSize: 10,
  },
  xsFat: {
    fontSize: 10,
    fontWeight: "500",
  },
});
