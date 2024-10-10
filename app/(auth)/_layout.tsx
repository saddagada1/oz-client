import { Tabs } from "expo-router";
import { NavbarLink } from "@/components/navigation/navbarLink";
import { useAppSelector } from "@/lib/hooks";
import { defaultSpacing } from "@/lib/constants";

export default function Layout() {
  const { colors } = useAppSelector((store) => store.theme);
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.foreground,
        tabBarInactiveTintColor: colors.accent,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "transparent",
          shadowColor: "transparent",
          borderTopWidth: 0,
          paddingHorizontal: defaultSpacing,
          marginBottom: defaultSpacing,
        },
        tabBarShowLabel: false,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="login"
        options={{
          title: "",
          tabBarIcon: ({ color, focused }) => (
            <NavbarLink name="login" color={color} focused={focused} />
          ),
          tabBarItemStyle: {
            flex: 3,
          },
        }}
      />
      <Tabs.Screen
        name="signup"
        options={{
          title: "",
          tabBarIcon: ({ color, focused }) => (
            <NavbarLink last separator name="signup" color={color} focused={focused} />
          ),
          tabBarItemStyle: {
            flex: 1,
          },
        }}
      />
    </Tabs>
  );
}
