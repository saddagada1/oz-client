import { useAppSelector, useThemeColors } from "@/lib/hooks";
import { useEffect } from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import Animated, {
  useSharedValue,
  useDerivedValue,
  withRepeat,
  withSequence,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";

export type LoadingSpinnerProps = ViewProps & {
  loading: boolean;
  lightColor?: string;
  darkColor?: string;
  lightStrokeColor?: string;
  darkStrokeColor?: string;
};

const animDuration = 1000;
const size = 50;

export function LoadingSpinner({
  style,
  loading,
  lightColor,
  darkColor,
  lightStrokeColor,
  darkStrokeColor,
  ...otherProps
}: LoadingSpinnerProps) {
  const borderRadius = useSharedValue(4);
  const rotation = useSharedValue(0);
  const transform = useDerivedValue(() => {
    return `${Math.PI * rotation.value}rad`;
  }, [rotation]);
  const animStyles = useAnimatedStyle(() => ({
    transform: [{ rotate: transform.value }],
    borderRadius: borderRadius.value,
  }));
  const { colorsRGBA } = useAppSelector((store) => store.theme);
  const customBackgroundColors = useThemeColors({ light: lightColor, dark: darkColor });
  const customBorderColors = useThemeColors({ light: lightStrokeColor, dark: darkStrokeColor });

  const backgroundColor =
    typeof customBackgroundColors !== "string"
      ? `rgba(${colorsRGBA.white[0]},${colorsRGBA.white[1]},${colorsRGBA.white[2]},0.25)`
      : customBackgroundColors;
  const borderColor =
    typeof customBorderColors !== "string"
      ? `rgba(${colorsRGBA.white[0]},${colorsRGBA.white[1]},${colorsRGBA.white[2]},0.5)`
      : customBorderColors;

  useEffect(() => {
    rotation.value = loading
      ? withRepeat(
          withSequence(
            withTiming(1, { duration: animDuration }),
            withTiming(
              0,
              { duration: animDuration * 2 },
              () =>
                (borderRadius.value = withTiming(size / 2, {
                  duration: animDuration,
                }))
            ),
            withTiming(
              2,
              { duration: animDuration },
              () => (borderRadius.value = withTiming(4, { duration: animDuration }))
            )
          ),
          -1,
          false
        )
      : 0;
  }, [loading]);

  if (!loading) return null;

  return (
    <View style={[StyleSheet.absoluteFill, styles.root, style]} {...otherProps}>
      <Animated.View
        style={[
          animStyles,
          { backgroundColor, borderColor, borderWidth: 2, width: size, height: size },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    justifyContent: "center",
    alignItems: "center",
  },
});
