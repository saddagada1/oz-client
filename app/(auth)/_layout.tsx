import { Tabs } from "expo-router";
import { NavbarIcon } from "@/components/navigation/navbarIcon";
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
        },
        tabBarIconStyle: {
          width: "100%",
          height: "100%",
        },
        tabBarShowLabel: false,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="login"
        options={{
          title: "",
          tabBarIcon: ({ color }) => <NavbarIcon name="login" color={color} />,
          tabBarItemStyle: {
            flex: 3,
          },
        }}
      />
      <Tabs.Screen
        name="signup"
        options={{
          title: "",
          tabBarIcon: ({ color }) => <NavbarIcon name="signup" color={color} />,
          tabBarItemStyle: {
            flex: 1,
          },
        }}
      />
    </Tabs>
  );
}
