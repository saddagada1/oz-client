import { StyleProp, View, ViewProps, ViewStyle } from "react-native";
import { StyleSheet } from "react-native";
import { defaultSpacing } from "@/lib/constants";
import { ReactNode } from "react";
import { useAppSelector } from "@/lib/hooks";

type HorizontalSplitViewProps = Omit<ViewProps, "children"> & {
  leftChildren?: ReactNode;
  rightChildren?: ReactNode;
  leftContainerStyle?: StyleProp<ViewStyle>;
  rightContainerStyle?: StyleProp<ViewStyle>;
  mirrorStyle?: StyleProp<ViewStyle>;
};

export function HorizontalSplitView({
  style,
  leftChildren,
  rightChildren,
  leftContainerStyle,
  rightContainerStyle,
  mirrorStyle,
  ...otherProps
}: HorizontalSplitViewProps) {
  const { colors } = useAppSelector((store) => store.theme);
  return (
    <View style={[styles.horizontalSplitContainer, style]} {...otherProps}>
      <View
        style={[
          styles.splitLeftContainer,
          { borderColor: colors.accent },
          mirrorStyle,
          leftContainerStyle,
        ]}
      >
        {leftChildren}
      </View>
      <View style={[styles.splitRightContainer, mirrorStyle, rightContainerStyle]}>
        {rightChildren}
      </View>
    </View>
  );
}

type VerticalSplitViewProps = Omit<ViewProps, "children"> & {
  topChildren?: ReactNode;
  bottomChildren?: ReactNode;
  topContainerStyle?: StyleProp<ViewStyle>;
  bottomContainerStyle?: StyleProp<ViewStyle>;
  mirrorStyle?: StyleProp<ViewStyle>;
};

export function VerticalSplitView({
  style,
  topChildren,
  bottomChildren,
  topContainerStyle,
  bottomContainerStyle,
  mirrorStyle,
  ...otherProps
}: VerticalSplitViewProps) {
  const { colors } = useAppSelector((store) => store.theme);
  return (
    <View style={style} {...otherProps}>
      <View
        style={[
          styles.splitTopContainer,
          { borderColor: colors.accent },
          mirrorStyle,
          topContainerStyle,
        ]}
      >
        {topChildren}
      </View>
      <View style={[styles.splitBottomContainer, mirrorStyle, bottomContainerStyle]}>
        {bottomChildren}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  horizontalSplitContainer: {
    flexDirection: "row",
  },
  splitLeftContainer: {
    borderRightWidth: 1,
    paddingRight: defaultSpacing / 2,
  },
  splitRightContainer: {
    alignItems: "flex-end",
    paddingLeft: defaultSpacing / 2,
  },
  splitTopContainer: {
    borderBottomWidth: 1,
    paddingBottom: defaultSpacing / 2,
  },
  splitBottomContainer: {
    justifyContent: "flex-end",
    paddingTop: defaultSpacing / 2,
  },
});
