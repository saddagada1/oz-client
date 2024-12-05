import { defaultSpacing } from "@/lib/constants";
import { useAppSelector } from "@/lib/hooks";
import { TextInput, type TextInputProps, StyleSheet } from "react-native";

type ThemedInputProps = TextInputProps & {
  noMarginBottom?: boolean;
};

export function ThemedInput({ style, noMarginBottom, ...otherProps }: ThemedInputProps) {
  const { colors } = useAppSelector((store) => store.theme);

  return (
    <TextInput
      style={[
        styles.root,
        {
          backgroundColor: colors.white,
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
