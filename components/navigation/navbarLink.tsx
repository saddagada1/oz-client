import { View } from "react-native";
import { StyleSheet } from "react-native";
import { ThemedText } from "../themedText";
import { useAppSelector } from "@/lib/hooks";
import { defaultSpacing } from "@/lib/constants";
import { ThemedView } from "../themedView";

interface Props {
  name: string;
  color: string;
  focused: boolean;
  separator?: boolean;
  last?: boolean;
}

export function NavbarLink(props: Props) {
  const { colors } = useAppSelector((store) => store.theme);
  return (
    <ThemedView
      style={[styles.root, props.last && { paddingRight: 0 }]}
      noBackgroundColor
      horizontalPadding
    >
      {props.separator && <View style={[styles.separator, { backgroundColor: colors.accent }]} />}
      <ThemedText style={{ color: props.color }} type="lFat">
        {props.name}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    gap: defaultSpacing,
  },
  separator: {
    width: 2,
    height: "50%",
  },
});
