import { ViewProps } from "react-native";
import { StyleSheet } from "react-native";
import { ThemedText } from "../ui/text";
import { ThemedView } from "../ui/view";

type NavbarIconProps = ViewProps & {
  name: string;
  color: string;
};

export function NavbarIcon({ style, name, color, ...otherProps }: NavbarIconProps) {
  return (
    <ThemedView style={[styles.root, style]} {...otherProps}>
      <ThemedText style={{ color }} type="lFat">
        {name}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: {
    width: "100%",
    height: "100%",
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
