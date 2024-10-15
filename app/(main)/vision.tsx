import { StyleSheet, Pressable } from "react-native";
import React, { useMemo, useRef } from "react";
import { ThemedText } from "@/components/themedText";
import { useAppSelector } from "@/lib/hooks";
import { ThemedView } from "@/components/themedView";
import { ThemedButton } from "@/components/themedButton";
import { defaultSpacing } from "@/lib/constants";
import { LoadingSpinner } from "@/components/loadingSpinner";
import { runOnJS } from "react-native-reanimated";
import { Camera, CameraHandles } from "@/components/vision/camera";
import { History } from "@/components/vision/history";

export default function Vision() {
  const cameraRef = useRef<CameraHandles>(null);
  const user = useAppSelector((store) => store.auth.credentials?.user);
  const { colors } = useAppSelector((store) => store.theme);
  const { history, selectedIndex, isSubmitting } = useAppSelector((store) => store.vision);

  const avgPrice = useMemo(() => {
    if (history.length === 0) return 0;
    return (
      history[selectedIndex].results.itemSummaries.reduce(
        (curr, next) => parseFloat(next.price.value) + curr,
        0
      ) / history[selectedIndex].results.itemSummaries.length
    ).toFixed(2);
  }, [history, selectedIndex]);

  return (
    <>
      <Camera ref={cameraRef} />
      <ThemedView
        style={styles.root}
        noBackgroundColor
        statusBarPadding
        navbarPadding
        horizontalPadding
      >
        <ThemedView noBackgroundColor>
          <ThemedText style={{ color: colors.accent }} type="mFat">
            Good Morning
          </ThemedText>
          <ThemedText type="xlFat" style={{ color: colors.white }}>
            {user?.Username ?? "Welcome"}
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.footer} noBackgroundColor>
          <ThemedButton
            style={{ flex: 1 }}
            title={isSubmitting ? "..." : "analyze"}
            disabled={isSubmitting}
            onPress={() => {
              if (!cameraRef.current) return;
              runOnJS(cameraRef.current.handleImageSearch)();
            }}
          />
          {history.length > 0 ? (
            <ThemedView noBackgroundColor style={{ flex: 2 }}>
              <ThemedText
                style={[
                  {
                    color: colors.brand,
                  },
                  styles.details,
                ]}
                type="xlFat"
              >
                ~${avgPrice}
              </ThemedText>
              <ThemedView noBackgroundColor style={{ gap: defaultSpacing / 2 }}>
                <ThemedText
                  style={[
                    {
                      color: colors.white,
                    },
                    styles.details,
                  ]}
                  type="mFat"
                  numberOfLines={2}
                >
                  {history[selectedIndex].results.itemSummaries[0].title}
                </ThemedText>
                <Pressable onPress={() => {}}>
                  <ThemedText
                    style={[
                      {
                        color: colors.white,
                        textDecorationLine: "underline",
                      },
                      styles.details,
                    ]}
                    type="mFat"
                  >{`view more info ->`}</ThemedText>
                </Pressable>
              </ThemedView>
            </ThemedView>
          ) : (
            <ThemedText
              style={[
                {
                  color: colors.accent,
                  flex: 2,
                },
                styles.details,
              ]}
              type="mFat"
            >
              capture image {"\n"} for product details
            </ThemedText>
          )}
        </ThemedView>
      </ThemedView>
      <History />
      <LoadingSpinner loading={isSubmitting} />
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  footer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: defaultSpacing * 2,
  },
  details: {
    textAlign: "right",
  },
});
