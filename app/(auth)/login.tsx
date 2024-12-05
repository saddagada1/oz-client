import LoginForm from "@/components/auth/loginForm";
import { ThemedText } from "@/components/ui/text";
import { ThemedView } from "@/components/ui/view";
import { useAppSelector } from "@/lib/hooks";
import { StyleSheet } from "react-native";

export default function Login() {
  const { colors } = useAppSelector((store) => store.theme);
  return (
    <ThemedView style={styles.root} background statusBarPadding horizontalPadding>
      <ThemedText style={{ color: colors.accent }} type="mFat">
        Welcome to OZ
      </ThemedText>
      <ThemedText type="xlFat">Please Login</ThemedText>
      <LoginForm />
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
});
