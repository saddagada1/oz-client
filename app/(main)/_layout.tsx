import { Tabs } from "expo-router";
import { ProfileIcon } from "@/components/navigation/profileIcon";
import { useAppSelector } from "@/lib/hooks";
import { defaultSpacing } from "@/lib/constants";
import { NavbarIcon } from "@/components/navigation/navbarIcon";

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
          paddingLeft: defaultSpacing,
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
        name="profile"
        options={{
          title: "",
          tabBarIcon: ({ color }) => <ProfileIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="vision"
        options={{
          title: "",
          tabBarIcon: ({ color, focused }) => (
            <NavbarIcon name="vision" color={focused ? colors.white : color} />
          ),
        }}
      />
      <Tabs.Screen
        name="sell"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <NavbarIcon
              name="sell"
              color={color}
              style={{ borderLeftWidth: 1, borderRightWidth: 1, borderColor: colors.accent }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: "",
          tabBarIcon: ({ color }) => <NavbarIcon name="shop" color={color} />,
        }}
      />
    </Tabs>
  );
}
