import { StyleSheet, Pressable, Image, View } from "react-native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { ThemedText } from "@/components/ui/text";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { ThemedButton } from "@/components/ui/button";
import { defaultSpacing } from "@/lib/constants";
import { Spinner } from "@/components/ui/spinner";
import { runOnJS } from "react-native-reanimated";
import { Camera, CameraHandles } from "@/components/vision/camera";
import { History } from "@/components/vision/history";
import { setHistory, setResultIndex } from "@/lib/redux/slices/vision";
import { Shutter } from "@/components/ui/shutter";
import { HorizontalSplitView, VerticalSplitView } from "@/components/ui/splitView";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { ReceiptModal } from "@/components/receiptModal";
import { greeting } from "@/lib/utils";

export default function Vision() {
  const cameraRef = useRef<CameraHandles>(null);
  const dispatch = useAppDispatch();
  const user = useAppSelector((store) => store.auth.credentials?.user);
  const { colors } = useAppSelector((store) => store.theme);
  const { history, selectedIndex, isSubmitting } = useAppSelector((store) => store.vision);
  const [showJSON, setShowJSON] = useState(false);

  const results = useMemo(() => {
    if (history.length === 0) return [];
    return history[selectedIndex].results.itemSummaries;
  }, [history, selectedIndex]);

  const resultIndex = useMemo(() => {
    if (history.length === 0) return 0;
    return history[selectedIndex].resultIndex;
  }, [history, selectedIndex]);

  const avgPrice = useMemo(() => {
    if (results.length === 0) return 0;
    return (
      results.reduce((curr, next) => parseFloat(next.price.value) + curr, 0) / results.length
    ).toFixed(2);
  }, [results]);

  const maxPrice = useMemo(() => {
    if (results.length === 0) return 0;
    return results.reduce((curr, next) => {
      const nextPrice = parseFloat(next.price.value);
      if (nextPrice > curr) {
        return nextPrice;
      } else {
        return curr;
      }
    }, 0);
  }, [results]);

  const minPrice = useMemo(() => {
    if (results.length === 0) return 0;
    return results.reduce((curr, next) => {
      const nextPrice = parseFloat(next.price.value);
      if (nextPrice < curr && nextPrice !== 0) {
        return nextPrice;
      } else {
        return curr;
      }
    }, maxPrice);
  }, [maxPrice]);

  const activeColor = useCallback(
    (color: string) => {
      if (results.length === 0) return colors.accent;
      return color;
    },
    [results.length]
  );

  const pickImage = async () => {
    if (!cameraRef.current) return;

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
    });

    if (!result.canceled) {
      runOnJS(cameraRef.current.handleImageSearch)(result.assets[0].uri);
    }
  };

  const Matches: React.FC = () => {
    return results.length === 0 ? (
      <ThemedText style={{ color: colors.accent }} type="sFat">
        (0) matches
      </ThemedText>
    ) : (
      <HorizontalSplitView
        leftChildren={
          <ThemedText style={{ color: colors.accent }} type="sFat">
            {`${resultIndex + 1} / ${results.length} matches`}
          </ThemedText>
        }
        rightChildren={
          <HorizontalSplitView
            leftChildren={
              results.length !== 0 && (
                <Pressable
                  onPress={() =>
                    dispatch(setHistory(history.filter((_, i) => i !== selectedIndex)))
                  }
                >
                  <ThemedText
                    style={{ color: colors.destructive, textDecorationLine: "underline" }}
                    type="sFat"
                  >
                    delete
                  </ThemedText>
                </Pressable>
              )
            }
            rightChildren={
              <ThemedText style={{ color: colors.brand }} type="sFat">
                {`$${results[resultIndex].price.value}`}
              </ThemedText>
            }
          />
        }
      />
    );
  };

  const Title: React.FC = () => {
    return results.length === 0 ? (
      <ThemedText style={{ color: colors.accent, width: "75%" }} type="lFat">
        capture image to begin product analysis
      </ThemedText>
    ) : (
      <View style={[styles.rowContainer, { justifyContent: "space-between" }]}>
        <ThemedText style={{ color: colors.white, width: "75%" }} type="lFat" numberOfLines={2}>
          {results[resultIndex].title}
        </ThemedText>
        <View style={[styles.preview, { borderColor: colors.accent }]}>
          <Image
            source={{
              uri: results[resultIndex].image.imageUrl,
            }}
            style={styles.img}
          />
        </View>
      </View>
    );
  };

  const Actions: React.FC = () => {
    return (
      <View style={{ gap: defaultSpacing / 2 }}>
        <HorizontalSplitView
          leftChildren={
            <Pressable
              onPress={() => dispatch(setResultIndex(resultIndex - 1))}
              disabled={resultIndex === 0}
            >
              <ThemedText
                style={{ color: resultIndex === 0 ? colors.accent : activeColor(colors.white) }}
              >
                prev
              </ThemedText>
            </Pressable>
          }
          rightChildren={
            <Pressable
              onPress={() => dispatch(setResultIndex(resultIndex + 1))}
              disabled={resultIndex >= results.length - 1}
            >
              <ThemedText
                style={{
                  color:
                    resultIndex >= results.length - 1 ? colors.accent : activeColor(colors.white),
                }}
              >
                next
              </ThemedText>
            </Pressable>
          }
        />
        <ThemedButton
          title={isSubmitting ? "..." : `hold`}
          disabled={isSubmitting}
          onLongPress={() => {
            if (!cameraRef.current) return;
            runOnJS(cameraRef.current.handleCameraSearch)();
          }}
          delayLongPress={750}
        />
      </View>
    );
  };

  const Pricing: React.FC = () => {
    return (
      <HorizontalSplitView
        leftContainerStyle={{ minWidth: "20%" }}
        rightContainerStyle={{ flex: 1 }}
        leftChildren={
          <VerticalSplitView
            topChildren={
              <>
                <ThemedText style={{ color: colors.accent }} type="sFat">
                  min
                </ThemedText>
                <ThemedText style={{ color: activeColor(colors.success) }} type="mFat">
                  ↓
                  <ThemedText style={{ color: activeColor(colors.white) }} type="mFat">
                    ${minPrice}
                  </ThemedText>
                </ThemedText>
              </>
            }
            bottomChildren={
              <>
                <ThemedText style={{ color: colors.accent }} type="sFat">
                  max
                </ThemedText>
                <ThemedText style={{ color: activeColor(colors.destructive) }} type="mFat">
                  ↑
                  <ThemedText style={{ color: activeColor(colors.white) }} type="mFat">
                    ${maxPrice}
                  </ThemedText>
                </ThemedText>
              </>
            }
            mirrorStyle={{ alignItems: "center" }}
          />
        }
        rightChildren={
          <VerticalSplitView
            style={{ width: "100%" }}
            topChildren={
              <>
                <ThemedText style={{ color: colors.accent }} type="sFat">
                  avg price
                </ThemedText>
                <ThemedText style={{ color: activeColor(colors.brand) }} type="mFat">
                  ~
                  <ThemedText style={{ color: activeColor(colors.white) }} type="mFat">
                    ${avgPrice}
                  </ThemedText>
                </ThemedText>
              </>
            }
            bottomChildren={
              <ThemedButton
                title="view more"
                disabled={results.length === 0}
                textType="sFat"
                textStyle={{ color: activeColor(colors.white) }}
                style={{
                  width: "100%",
                  padding: defaultSpacing / 4,
                  backgroundColor: colors.accent + "80",
                }}
                onPress={() => setShowJSON(true)}
              />
            }
            mirrorStyle={{ alignItems: "center" }}
          />
        }
      />
    );
  };

  return (
    <>
      <Camera ref={cameraRef} />
      <Shutter
        headerChildren={
          <>
            <ThemedText style={{ color: colors.accent }} type="mFat">
              {greeting()}
            </ThemedText>
            <ThemedText type="xlFat" style={{ color: colors.white }}>
              {user?.Username ?? "Welcome"}
            </ThemedText>
          </>
        }
        shutterChildren={
          <>
            <Pressable onPress={() => pickImage()} style={styles.upload}>
              <Ionicons name="images-outline" size={16} color={colors.accent} />
            </Pressable>
            <History />
            <Spinner loading={isSubmitting} />
          </>
        }
      >
        <VerticalSplitView
          topChildren={
            <>
              <Matches />
              <Title />
            </>
          }
          bottomChildren={
            <HorizontalSplitView
              rightContainerStyle={{ flex: 1 }}
              leftChildren={<Actions />}
              rightChildren={<Pricing />}
              mirrorStyle={{ justifyContent: "center" }}
            />
          }
        />
      </Shutter>
      <ReceiptModal visible={showJSON} setVisible={setShowJSON} />
    </>
  );
}

const styles = StyleSheet.create({
  rowContainer: {
    width: "100%",
    flexDirection: "row",
  },
  preview: {
    width: "15%",
    aspectRatio: 1 / 1,
    borderWidth: 2,
  },
  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  upload: {
    position: "absolute",
    bottom: 0,
    left: 0,
    padding: defaultSpacing / 2,
  },
});
