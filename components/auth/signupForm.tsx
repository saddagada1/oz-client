import React from "react";
import { View, StyleSheet } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ThemedText } from "../ui/text";
import { ThemedInput } from "../ui/input";
import { ThemedButton } from "../ui/button";
import { defaultSpacing } from "@/lib/constants";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useMutation } from "@tanstack/react-query";
import { signup } from "@/lib/axios";
import { checkIfApiError } from "@/lib/utils";
import { setAuthState } from "@/lib/redux/slices/auth";
import { useRouter } from "expo-router";
import { setCredentials } from "@/lib/secureStorage";

const formSchema = z
  .object({
    email: z.string().email({ message: "Invalid Email" }),
    username: z
      .string()
      .min(4, { message: "Min 4 Chars Required" })
      .regex(/^[A-Za-z0-9_]*$/, "Only A-Z, 0-9 & _")
      .max(15, { message: "Max 15 Chars Allowed" }),
    password: z.string().min(8, { message: "Min 8 Chars Required" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Does Not Match",
    path: ["confirmPassword"],
  });

type formValues = z.infer<typeof formSchema>;

const SignupForm: React.FC = () => {
  const { colors } = useAppSelector((store) => store.theme);
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<formValues>({
    resolver: zodResolver(formSchema),
  });
  const { mutateAsync } = useMutation({
    mutationFn: signup,
  });
  const dispatch = useAppDispatch();
  const router = useRouter();

  const onSubmit = async (data: formValues) => {
    try {
      const response = await mutateAsync({
        email: data.email,
        username: data.username,
        password: data.password,
      });
      await setCredentials(response.data);
      dispatch(
        setAuthState({
          status: "authenticated",
          credentials: {
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
            user: response.data.user,
          },
        })
      );
      router.replace("/vision");
    } catch (error) {
      const apiError = checkIfApiError(error);
      if (!!apiError && typeof apiError !== "number") {
        setError(apiError.subject as "email" | "username", {
          message: apiError.message,
        });
        return;
      }
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.labelContainer}>
        <ThemedText type="mFat">Email</ThemedText>
        {errors.email && (
          <ThemedText type="xs" style={styles.error}>
            {errors.email.message}
          </ThemedText>
        )}
      </View>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <ThemedInput
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="oz@acme.ca"
          />
        )}
        name="email"
      />
      <View style={styles.labelContainer}>
        <ThemedText type="mFat">Username</ThemedText>
        {errors.username && (
          <ThemedText type="xs" style={styles.error}>
            {errors.username.message}
          </ThemedText>
        )}
      </View>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <ThemedInput
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="whyiscrafty"
          />
        )}
        name="username"
      />
      <View style={styles.labelContainer}>
        <ThemedText type="mFat">Password</ThemedText>
        {errors.password && (
          <ThemedText type="xs" style={styles.error}>
            {errors.password.message}
          </ThemedText>
        )}
      </View>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <ThemedInput
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="********"
            secureTextEntry
          />
        )}
        name="password"
      />
      <View style={styles.labelContainer}>
        <ThemedText type="mFat">Confirm Password</ThemedText>
        {errors.confirmPassword && (
          <ThemedText type="xs" style={styles.error}>
            {errors.confirmPassword.message}
          </ThemedText>
        )}
      </View>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <ThemedInput
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="********"
            secureTextEntry
            style={{ marginBottom: defaultSpacing * 1.5 }}
          />
        )}
        name="confirmPassword"
      />
      <ThemedButton title={isSubmitting ? "..." : "Signup"} onPress={handleSubmit(onSubmit)} />
      <View style={styles.seperator}>
        <ThemedText type="xs" style={[styles.seperatorText, { color: colors.accent }]}>
          or
        </ThemedText>
        <View style={[styles.seperatorLine, { backgroundColor: colors.accent }]} />
        <View style={[styles.seperatorLine, { backgroundColor: colors.accent }]} />
      </View>
      <ThemedButton
        title="Continue With Google"
        style={{ backgroundColor: colors.accent + "80" }}
        textStyle={{ color: colors.black }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    width: "80%",
    marginTop: defaultSpacing * 3,
    marginLeft: defaultSpacing,
    overflow: "hidden",
  },
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 5,
  },
  error: {
    color: "red",
  },
  seperator: {
    marginVertical: defaultSpacing,
    position: "relative",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: defaultSpacing,
  },
  seperatorText: {
    position: "absolute",
  },
  seperatorLine: {
    width: "100%",
    height: 0.5,
  },
});

export default SignupForm;
