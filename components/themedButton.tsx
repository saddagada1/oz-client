import { useAppSelector, useThemeColors } from "@/lib/hooks";
import { StyleSheet, Pressable, type PressableProps } from "react-native";
import { ThemedText } from "./themedText";

export type ThemedButtonProps = PressableProps & {
  lightColor?: string;
  darkColor?: string;
  lightTextColor?: string;
  darkTextColor?: string;
  title: string;
};

export function ThemedButton({
  style,
  lightColor,
  darkColor,
  lightTextColor,
  darkTextColor,
  title,
  ...otherProps
}: ThemedButtonProps) {
  const { colors } = useAppSelector((store) => store.theme);
  const customColors = useThemeColors({ light: lightColor, dark: darkColor });
  const customTextColors = useThemeColors({ light: lightTextColor, dark: darkTextColor });

  const backgroundColor = typeof customColors !== "string" ? customColors.black : customColors;
  const color = typeof customTextColors !== "string" ? customTextColors.white : customTextColors;

  return (
    <Pressable
      style={[styles.root, { backgroundColor, borderColor: colors.accent }, style as any]}
      {...otherProps}
    >
      <ThemedText type="normalFat" style={{ color }}>
        {title}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    width: "100%",
    height: 50,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
});
