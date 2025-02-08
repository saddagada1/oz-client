import { ThemedText } from "@/components/ui/text";
import { ThemedView } from "@/components/ui/view";
import { Pressable, StyleSheet } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { useEffect } from "react";
import { deleteCredentials } from "@/lib/secureStorage";
import { useAppDispatch } from "@/lib/hooks";
import { resetAuthState } from "@/lib/redux/slices/auth";
import { useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { connectAccount } from "@/lib/axios";

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: "https://auth.ebay.com/oauth2/authorize",
  tokenEndpoint: "https://api.ebay.com/identity/v1/oauth2/token",
};

export default function Profile() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_EBAY_CLIENT_ID!,
      scopes: ["https://api.ebay.com/oauth/api_scope"],
      usePKCE: false,
      redirectUri: "Saivamsi_Addaga-Saivamsi-oz-PRD-mxfrkdwi",
      responseType: "code",
    },
    discovery
  );
  const { mutateAsync } = useMutation({
    mutationFn: connectAccount,
  });

  const handleLogout = async () => {
    await deleteCredentials();
    dispatch(resetAuthState());
    router.replace("/login");
  };

  useEffect(() => {
    const handleAccountConnection = async (code: string) => {
      const credentials = await mutateAsync(code);
      console.log(credentials.data);
      return credentials.data;
    };

    if (response?.type === "success") {
      const { code } = response.params;
      handleAccountConnection(code);
    }
  }, [response]);

  // console.log(request);

  return (
    <ThemedView style={styles.root} background statusBarPadding horizontalPadding>
      <Pressable
        onPress={() => {
          promptAsync();
        }}
      >
        <ThemedText>Connect your ebay account!</ThemedText>
      </Pressable>
      <Pressable
        onPress={() => {
          handleLogout();
        }}
      >
        <ThemedText>Logout</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: {
    width: "100%",
    height: "100%",
  },
});
