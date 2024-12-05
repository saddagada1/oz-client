import { StyleSheet } from "react-native";
import { ThemedText } from "../ui/text";
import { useAppSelector } from "@/lib/hooks";
import { ThemedView } from "../ui/view";

interface Props {}

export function Preloader(props: Props) {
  const { colors } = useAppSelector((store) => store.theme);

  return (
    <ThemedView style={styles.root} background statusBarPadding horizontalPadding>
      <ThemedText type="mFat">Welcome to OZ</ThemedText>
      <ThemedText style={{ color: colors.accent }} type="xs">
        loading, please wait...
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  progress: {
    position: "absolute",
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
