import { Pressable, Image, StyleSheet } from "react-native";
import { ThemedText } from "../themedText";
import { ThemedView, ThemedViewProps } from "../themedView";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { defaultSpacing } from "@/lib/constants";
import { setSelectedIndex } from "@/lib/redux/slices/vision";
import Animated, { Easing, FadeIn, LinearTransition } from "react-native-reanimated";
import { VisionHistoryItem } from "@/lib/types";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const width = 60;
const height = 80;

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
      <Image source={{ uri: item.image.uri }} style={{ width: "100%", height: "100%" }} />
    </AnimatedPressable>
  );
}

export type HistoryProps = ThemedViewProps;

export function History({ style, ...otherProps }: HistoryProps) {
  const { colors } = useAppSelector((store) => store.theme);
  const { history } = useAppSelector((store) => store.vision);

  const renderItem = ({ item, index }: { item: VisionHistoryItem; index: number }) => {
    return <HistoryItem item={item} index={index} />;
  };

  return (
    <ThemedView style={[styles.root, style]} noBackgroundColor horizontalPadding {...otherProps}>
      <ThemedText
        style={{
          color: history.length > 0 ? colors.white : colors.accent,
          textAlign: "right",
        }}
        type="mFat"
      >
        history
      </ThemedText>
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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: {
    position: "absolute",
    top: "25%",
    right: 0,
    gap: defaultSpacing,
    height: "40%",
  },
  history: {
    gap: defaultSpacing / 2,
    alignItems: "flex-end",
  },
  historyItem: {
    width,
    height,
    borderWidth: 2,
  },
});
