import { ThemedText } from "@/components/themedText";
import { ThemedView } from "@/components/themedView";
import { Pressable, StyleSheet } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { useEffect } from "react";
import { deleteCredentials } from "@/lib/secureStorage";
import { useAppDispatch } from "@/lib/hooks";
import { resetAuthState } from "@/lib/redux/slices/auth";
import { useRouter } from "expo-router";

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: "https://auth.sandbox.ebay.com/oauth2/authorize",
  tokenEndpoint: "https://api.sandbox.ebay.com/identity/v1/oauth2/token",
};

export default function Profile() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_EBAY_CLIENT_ID!,
      scopes: ["api_scope"],
      usePKCE: false,
      redirectUri: "Saivamsi_Addaga-Saivamsi-oz-SBX-ojvevnlaw",
      responseType: "code",
    },
    discovery
  );

  const handleLogout = async () => {
    await deleteCredentials();
    dispatch(resetAuthState());
    router.replace("/login");
  };

  useEffect(() => {
    console.log("here", response);
    if (response?.type === "success") {
      const { code } = response.params;
      console.log(code);
    }
  }, [response]);

  // console.log(request);

  return (
    <ThemedView style={styles.root} statusBarPadding horizontalPadding>
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
