import { Tabs } from "expo-router";
import { NavbarLink } from "@/components/navigation/navbarLink";
import { ProfileIcon } from "@/components/navigation/profileIcon";
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
        name="profile"
        options={{
          title: "",
          tabBarIcon: ({ color, focused }) => <ProfileIcon color={color} focused={focused} />,
          tabBarItemStyle: {
            flex: 0.5,
          },
        }}
      />
      <Tabs.Screen
        name="vision"
        options={{
          title: "",
          tabBarIcon: ({ color, focused }) => (
            <NavbarLink name="vision" color={focused ? colors.white : color} focused={focused} />
          ),
          tabBarItemStyle: {
            flex: 1,
          },
        }}
      />
      <Tabs.Screen
        name="sell"
        options={{
          title: "",
          tabBarIcon: ({ color, focused }) => (
            <NavbarLink separator name="sell" color={color} focused={focused} />
          ),
          tabBarItemStyle: {
            flex: 0.7,
          },
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: "",
          tabBarIcon: ({ color, focused }) => (
            <NavbarLink last separator name="shop" color={color} focused={focused} />
          ),
          tabBarItemStyle: {
            flex: 0.5,
          },
        }}
      />
    </Tabs>
  );
}
