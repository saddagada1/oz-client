import { ThemedView } from "@/components/themedView";
import { StyleSheet } from "react-native";

export default function Sell() {
  return <ThemedView style={styles.root}></ThemedView>;
}

const styles = StyleSheet.create({
  root: {
    width: "100%",
    height: "100%",
  },
});
