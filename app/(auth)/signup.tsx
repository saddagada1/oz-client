import SignupForm from "@/components/auth/signupForm";
import { ThemedText } from "@/components/themedText";
import { ThemedView } from "@/components/themedView";
import { useAppSelector } from "@/lib/hooks";
import { StyleSheet } from "react-native";

export default function Signup() {
  const { colors } = useAppSelector((store) => store.theme);

  return (
    <ThemedView style={styles.root} statusBarPadding horizontalPadding>
      <ThemedText style={{ color: colors.accent }} type="mFat">
        Welcome to OZ
      </ThemedText>
      <ThemedText type="xlFat">Please Signup</ThemedText>
      <SignupForm />
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
