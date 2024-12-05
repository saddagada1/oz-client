import { Pressable, Image, StyleSheet, View, ViewProps } from "react-native";
import { ThemedText } from "../ui/text";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { defaultSpacing } from "@/lib/constants";
import { setSelectedIndex } from "@/lib/redux/slices/vision";
import Animated, {
  Easing,
  FadeIn,
  LinearTransition,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";
import { VisionHistoryItem } from "@/lib/types";
import { useState } from "react";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const animDuration = 400;

export type HistoryItemProps = {
  item: VisionHistoryItem;
  index: number;
};

export function HistoryItem({ item, index }: HistoryItemProps) {
  const dispatch = useAppDispatch();
  const { colors } = useAppSelector((store) => store.theme);
  const { history, selectedIndex } = useAppSelector((store) => store.vision);

  return (
    <AnimatedPressable
      entering={FadeIn.delay(history.length > 1 ? animDuration : 0)}
      style={[
        styles.historyItem,
        { borderColor: index === selectedIndex ? colors.brand : colors.accent },
      ]}
      onPress={() => dispatch(setSelectedIndex(index))}
    >
      <Image source={{ uri: item.image.uri }} style={styles.img} />
    </AnimatedPressable>
  );
}

export type HistoryProps = ViewProps;

export function History({ style, ...otherProps }: HistoryProps) {
  const { colors } = useAppSelector((store) => store.theme);
  const { history } = useAppSelector((store) => store.vision);
  const [open, setOpen] = useState(true);
  const opacity = useDerivedValue(() => {
    return open ? 1 : 0;
  }, [open]);
  const height = useDerivedValue(() => {
    return open ? `${75}%` : `${0}%`;
  }, [open]);
  const historyContainerAnimStyles = useAnimatedStyle(() => ({
    height: withTiming(height.value),
    opacity: withTiming(opacity.value),
  }));

  const renderItem = ({ item, index }: { item: VisionHistoryItem; index: number }) => {
    return <HistoryItem item={item} index={index} />;
  };

  return (
    <View style={[styles.root, style]} {...otherProps}>
      <Pressable
        onPress={() => {
          setOpen(!open);
        }}
      >
        <ThemedText
          style={{
            color: history.length > 0 ? colors.white : colors.accent,
            paddingVertical: defaultSpacing / 2,
          }}
          type="sFat"
        >
          {`history ${open ? "↓" : "↑"}`}
        </ThemedText>
      </Pressable>
      <Animated.View style={[styles.historyContainer, historyContainerAnimStyles]}>
        <Animated.FlatList
          data={history}
          contentContainerStyle={styles.history}
          showsVerticalScrollIndicator={false}
          bounces={false}
          renderItem={renderItem}
          itemLayoutAnimation={LinearTransition.duration(animDuration).easing(
            Easing.inOut(Easing.quad)
          )}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: "absolute",
    height: "100%",
    right: 0,
    paddingRight: defaultSpacing / 2,
    justifyContent: "flex-end",
  },
  historyContainer: {
    width: "100%",
    overflow: "hidden",
  },
  history: {
    width: "100%",
    gap: defaultSpacing / 4,
  },
  historyItem: {
    width: "100%",
    height: 50,
    borderWidth: 2,
  },
  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
});
