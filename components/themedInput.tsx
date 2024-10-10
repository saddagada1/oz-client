import { defaultSpacing } from "@/lib/constants";
import { useAppSelector, useThemeColors } from "@/lib/hooks";
import { TextInput, type TextInputProps, StyleSheet } from "react-native";

type ThemedInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
  noMarginBottom?: boolean;
};

export function ThemedInput({
  style,
  lightColor,
  darkColor,
  noMarginBottom,
  ...otherProps
}: ThemedInputProps) {
  const { colors } = useAppSelector((store) => store.theme);
  const customColors = useThemeColors({ light: lightColor, dark: darkColor });

  const backgroundColor = typeof customColors !== "string" ? customColors.white : customColors;

  return (
    <TextInput
      style={[
        styles.root,
        {
          backgroundColor,
          borderColor: colors.accent,
          color: colors.black,
          marginBottom: noMarginBottom ? 0 : defaultSpacing,
        },
        style,
      ]}
      placeholderTextColor={colors.accent}
      {...otherProps}
    />
  );
}

const styles = StyleSheet.create({
  root: {
    width: "100%",
    height: 40,
    borderWidth: 2,
    paddingHorizontal: defaultSpacing / 2,
    textTransform: "lowercase",
    fontFamily: "SpaceMono",
  },
});
