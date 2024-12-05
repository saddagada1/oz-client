import { View, ViewProps } from "react-native";
import { StyleSheet } from "react-native";
import { ThemedView } from "./view";
import { useAppSelector } from "@/lib/hooks";
import { defaultSpacing } from "@/lib/constants";
import { ReactNode } from "react";

type ShutterProps = ViewProps & {
  color?: string;
  shutterChildren?: ReactNode;
  headerChildren?: ReactNode;
};

export function Shutter({
  style,
  color,
  shutterChildren,
  headerChildren,
  children,
  ...otherProps
}: ShutterProps) {
  const { colors } = useAppSelector((store) => store.theme);
  const shadeColor = color ?? colors.black + "80";
  return (
    <View style={[styles.root, style]} {...otherProps}>
      <View style={[styles.shadeX, { backgroundColor: shadeColor }]} />
      <View style={styles.shutterContainer}>
        <ThemedView statusBarPadding style={[styles.shadeHeader, { backgroundColor: shadeColor }]}>
          {headerChildren}
        </ThemedView>
        <View style={[styles.shutter, { borderColor: colors.accent + "40" }]}>
          {shutterChildren}
        </View>
        <ThemedView navbarPadding style={[styles.shadeMain, { backgroundColor: shadeColor }]}>
          {children}
        </ThemedView>
      </View>
      <View style={[styles.shadeX, { backgroundColor: shadeColor }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    height: "100%",
    flexDirection: "row",
  },
  shadeX: {
    width: defaultSpacing,
    height: "100%",
  },
  shutterContainer: {
    flex: 1,
    height: "100%",
  },
  shadeHeader: {
    width: "100%",
    paddingBottom: defaultSpacing / 2,
    position: "relative",
  },
  shutter: {
    flex: 1,
    width: "100%",
    borderWidth: 2,
    position: "relative",
    overflow: "hidden",
  },
  shadeMain: {
    width: "100%",
    paddingTop: defaultSpacing / 2,
    gap: defaultSpacing / 2,
  },
});
