import { Credentials } from "./types";
import * as SecureStore from "expo-secure-store";

export const setCredentials = async (credentials: Credentials) => {
  await SecureStore.setItemAsync(
    process.env.EXPO_PUBLIC_ACCESS_TOKEN_KEY!,
    credentials.accessToken
  );
  await SecureStore.setItemAsync(
    process.env.EXPO_PUBLIC_REFRESH_TOKEN_KEY!,
    credentials.refreshToken
  );
  await SecureStore.setItemAsync(
    process.env.EXPO_PUBLIC_USER_KEY!,
    JSON.stringify(credentials.user)
  );
};

export const getCredentials = async () => {
  const accessToken = await SecureStore.getItemAsync(process.env.EXPO_PUBLIC_ACCESS_TOKEN_KEY!);
  const refreshToken = await SecureStore.getItemAsync(process.env.EXPO_PUBLIC_REFRESH_TOKEN_KEY!);
  const userJson = await SecureStore.getItemAsync(process.env.EXPO_PUBLIC_USER_KEY!);

  if (!!accessToken && !!refreshToken && !!userJson) {
    return {
      accessToken,
      refreshToken,
      user: JSON.parse(userJson),
    };
  }

  return null;
};

export const deleteCredentials = async () => {
  await SecureStore.deleteItemAsync(process.env.EXPO_PUBLIC_ACCESS_TOKEN_KEY!);
  await SecureStore.deleteItemAsync(process.env.EXPO_PUBLIC_REFRESH_TOKEN_KEY!);
  await SecureStore.deleteItemAsync(process.env.EXPO_PUBLIC_USER_KEY!);
};
