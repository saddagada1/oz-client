import { useAppSelector } from "@/lib/hooks";
import { StyleSheet, Pressable, type PressableProps, StyleProp, TextStyle } from "react-native";
import { TextTypes, ThemedText } from "./text";
import { defaultSpacing } from "@/lib/constants";

export type ThemedButtonProps = PressableProps & {
  title: string;
  textStyle?: StyleProp<TextStyle>;
  textType?: TextTypes;
};

export function ThemedButton({
  style,
  title,
  textStyle,
  textType,
  ...otherProps
}: ThemedButtonProps) {
  const { colors } = useAppSelector((store) => store.theme);

  return (
    <Pressable
      style={[
        styles.root,
        { backgroundColor: colors.black, borderColor: colors.accent },
        style as any,
      ]}
      {...otherProps}
    >
      <ThemedText type={textType ?? "normalFat"} style={[{ color: colors.white }, textStyle]}>
        {title}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    // width: "100%",
    // height: 50,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    padding: defaultSpacing / 2,
  },
});
