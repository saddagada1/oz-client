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
import { Link, useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/lib/axios";
import { setAuthState } from "@/lib/redux/slices/auth";
import { checkIfApiError } from "@/lib/utils";
import { setCredentials } from "@/lib/secureStorage";

const formSchema = z.object({
  principle: z.string().min(1, { message: "Required" }),
  password: z.string().min(1, { message: "Required" }),
});

type formValues = z.infer<typeof formSchema>;

const LoginForm: React.FC = () => {
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
    mutationFn: login,
  });
  const dispatch = useAppDispatch();
  const router = useRouter();

  const onSubmit = async (data: formValues) => {
    try {
      const response = await mutateAsync({
        principle: data.principle,
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
      console.error(error);
      const apiError = checkIfApiError(error);
      if (!!apiError && typeof apiError !== "number") {
        setError(apiError.subject as "principle", {
          message: apiError.message,
        });
        return;
      }
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.labelContainer}>
        <ThemedText type="mFat">Email or Username</ThemedText>
        {errors.principle && (
          <ThemedText type="xs" style={styles.error}>
            {errors.principle.message}
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
        name="principle"
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
            noMarginBottom
            style={{ marginBottom: defaultSpacing / 4 }}
          />
        )}
        name="password"
      />
      <Link style={{ marginBottom: defaultSpacing }} href="/signup">
        <ThemedText
          type="xs"
          style={[
            styles.link,
            {
              color: colors.accent,
            },
          ]}
        >
          Forgot Password
        </ThemedText>
      </Link>
      <ThemedButton title={isSubmitting ? "..." : "Login"} onPress={handleSubmit(onSubmit)} />
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
  link: {
    textAlign: "right",
    textDecorationLine: "underline",
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

export default LoginForm;
