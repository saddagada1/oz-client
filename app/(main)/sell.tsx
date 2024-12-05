import { ThemedView } from "@/components/ui/view";
import { StyleSheet } from "react-native";

export default function Sell() {
  return <ThemedView background style={styles.root}></ThemedView>;
}

const styles = StyleSheet.create({
  root: {
    width: "100%",
    height: "100%",
  },
});
