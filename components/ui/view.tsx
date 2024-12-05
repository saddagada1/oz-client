import { defaultSpacing } from "@/lib/constants";
import { useAppSelector } from "@/lib/hooks";
import Constants from "expo-constants";
import { View, type ViewProps } from "react-native";

export type ThemedViewProps = ViewProps & {
  statusBarPadding?: boolean;
  navbarPadding?: boolean;
  horizontalPadding?: boolean;
  background?: boolean;
};

export function ThemedView({
  style,
  statusBarPadding,
  navbarPadding,
  horizontalPadding,
  background,
  ...otherProps
}: ThemedViewProps) {
  const { colors } = useAppSelector((store) => store.theme);
  const paddingTop = statusBarPadding ? Constants.statusBarHeight + defaultSpacing : undefined;
  const paddingBottom = navbarPadding ? Constants.statusBarHeight * 2 + defaultSpacing : undefined;
  const paddingHorizontal = horizontalPadding ? defaultSpacing : undefined;

  return (
    <View
      style={[
        {
          backgroundColor: background ? colors.background : "transparent",
          paddingTop,
          paddingBottom,
          paddingHorizontal,
        },
        style,
      ]}
      {...otherProps}
    />
  );
}
