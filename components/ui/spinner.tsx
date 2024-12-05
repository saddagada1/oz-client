import { useAppSelector } from "@/lib/hooks";
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

export type SpinnerProps = ViewProps & {
  loading: boolean;
};

const animDuration = 1000;
const size = 35;

export function Spinner({ style, loading, ...otherProps }: SpinnerProps) {
  const borderRadius = useSharedValue(4);
  const rotation = useSharedValue(0);
  const transform = useDerivedValue(() => {
    return `${Math.PI * rotation.value}rad`;
  }, [rotation]);
  const animStyles = useAnimatedStyle(() => ({
    transform: [{ rotate: transform.value }],
    borderRadius: borderRadius.value,
  }));
  const { colors } = useAppSelector((store) => store.theme);

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
          styles.spinner,
          {
            backgroundColor: colors.accent + "80",
            borderColor: colors.accent,
          },
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
  spinner: {
    borderWidth: 2,
    width: size,
    height: size,
  },
});
