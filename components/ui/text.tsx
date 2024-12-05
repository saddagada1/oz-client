import { useAppSelector } from "@/lib/hooks";
import { Text, type TextProps, StyleSheet } from "react-native";

export type TextTypes =
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

export type ThemedTextProps = TextProps & {
  type?: TextTypes;
};

export function ThemedText({ style, type = "normal", ...rest }: ThemedTextProps) {
  const { colors } = useAppSelector((store) => store.theme);

  return (
    <Text style={[{ color: colors.foreground }, styles.default, styles[type], style]} {...rest} />
  );
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
