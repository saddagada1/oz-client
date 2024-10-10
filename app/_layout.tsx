import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Appearance, useColorScheme } from "react-native";
import { Provider } from "react-redux";
import { store } from "@/lib/redux/store";
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Hide annoying warnings
const ignoreKeywords = "tf.nonMaxSuppression()";
const warn = console.warn;
console.warn = (...args) => {
  const message = args[0];
  if (message.includes(ignoreKeywords)) {
    return;
  }
  warn(...args);
};

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 0 } } });

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <Stack
            screenOptions={{ animation: "fade", headerShown: false, navigationBarHidden: true }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(main)" />
            <Stack.Screen name="+not-found" />
          </Stack>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
}
