import { useAppSelector } from "@/lib/hooks";
import {
  StyleSheet,
  Modal,
  type ModalProps,
  View,
  Image,
  ViewProps,
  StyleProp,
  ViewStyle,
  ScrollView,
  Pressable,
} from "react-native";
import { defaultSpacing } from "@/lib/constants";
import { Dispatch, SetStateAction, useMemo } from "react";
import { ThemedText } from "./ui/text";
import { getRelativeTime } from "@/lib/utils";
import { ExternalPathString, Link } from "expo-router";
import * as Haptics from "expo-haptics";

type RepeatRowProps = ViewProps & {
  count?: number;
  rowItemStyle?: StyleProp<ViewStyle>;
};

function RepeatRow({ count, rowItemStyle, style, children, ...otherProps }: RepeatRowProps) {
  return (
    <View style={[styles.row, style]} {...otherProps}>
      {Array.from({ length: count ?? 10 }).map((_, i) => (
        <View key={i} style={[{ flex: 1, alignItems: "center" }, rowItemStyle]}>
          {children}
        </View>
      ))}
    </View>
  );
}

export type ReceiptModalProps = ModalProps & {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
};

export function ReceiptModal({ visible, setVisible, ...otherProps }: ReceiptModalProps) {
  const { colors } = useAppSelector((store) => store.theme);
  const { history, selectedIndex, isSubmitting } = useAppSelector((store) => store.vision);

  const results = useMemo(() => {
    if (history.length === 0) return [];
    return history[selectedIndex].results.itemSummaries;
  }, [history, selectedIndex]);

  const image = useMemo(() => {
    if (history.length === 0) return "";
    return history[selectedIndex].image.uri;
  }, [history, selectedIndex]);

  return (
    <Modal
      animationType="slide"
      visible={visible}
      transparent={true}
      onRequestClose={() => {
        setVisible(false);
      }}
      {...otherProps}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.root}>
        <View
          style={[styles.receipt, { backgroundColor: colors.white, shadowColor: colors.black }]}
        >
          <RepeatRow
            style={[styles.edge, styles.topEdge]}
            rowItemStyle={[styles.edgePiece, { backgroundColor: colors.white }]}
          />
          <View style={[styles.header]}>
            <View style={{ alignItems: "center" }}>
              <ThemedText style={{ color: colors.accent }} type="mFat">
                oz vision
              </ThemedText>
              <ThemedText type="xlFat" style={{ color: colors.black }}>
                product report
              </ThemedText>
            </View>
            <View style={[styles.preview, { borderColor: colors.black }]}>
              <Image source={{ uri: image }} style={styles.img} />
            </View>
          </View>
          <View style={styles.items}>
            <RepeatRow count={20}>
              <ThemedText type="lFat" style={{ color: colors.black }}>
                -
              </ThemedText>
            </RepeatRow>
            <ThemedText style={{ color: colors.black }}>items summary</ThemedText>
            <RepeatRow count={20}>
              <ThemedText type="lFat" style={{ color: colors.black }}>
                -
              </ThemedText>
            </RepeatRow>
            {results.map((item, i) => (
              <View
                key={i}
                style={[
                  styles.item,
                  {
                    borderBottomColor: colors.black,
                    borderBottomWidth: i !== results.length - 1 ? 0.5 : 0,
                  },
                ]}
              >
                <View style={{ gap: defaultSpacing / 4 }}>
                  <ThemedText type="xsFat" style={{ color: colors.accent }}>
                    {item.itemId}
                  </ThemedText>
                  <View style={[styles.row, { gap: defaultSpacing }]}>
                    <ThemedText type="mFat" style={{ color: colors.black, flex: 1 }}>
                      {item.title}
                    </ThemedText>
                    <View style={[styles.itemPreview, { borderColor: colors.black }]}>
                      <Image
                        source={{
                          uri: item.image.imageUrl,
                        }}
                        style={styles.img}
                      />
                    </View>
                  </View>
                </View>
                <View style={{ gap: defaultSpacing / 2 }}>
                  <View style={[styles.row, { gap: defaultSpacing / 2 }]}>
                    <ThemedText type="sFat" style={{ color: colors.black }}>
                      seller
                    </ThemedText>
                    <RepeatRow style={{ flex: 1 }}>
                      <ThemedText type="sFat" style={{ color: colors.black }}>
                        .
                      </ThemedText>
                    </RepeatRow>
                    <ThemedText type="sFat" style={{ color: colors.black }}>
                      {item.seller.username}
                    </ThemedText>
                  </View>
                  <View style={[styles.row, { gap: defaultSpacing / 2 }]}>
                    <ThemedText type="sFat" style={{ color: colors.black }}>
                      condition
                    </ThemedText>
                    <RepeatRow style={{ flex: 1 }}>
                      <ThemedText type="sFat" style={{ color: colors.black }}>
                        .
                      </ThemedText>
                    </RepeatRow>
                    <ThemedText type="sFat" style={{ color: colors.black }}>
                      {item.condition}
                    </ThemedText>
                  </View>
                  <View style={[styles.row, { gap: defaultSpacing / 2 }]}>
                    <ThemedText type="sFat" style={{ color: colors.black }}>
                      price
                    </ThemedText>
                    <RepeatRow style={{ flex: 1 }}>
                      <ThemedText type="sFat" style={{ color: colors.black }}>
                        .
                      </ThemedText>
                    </RepeatRow>
                    <ThemedText type="sFat" style={{ color: colors.black }}>
                      ${item.price.value}
                    </ThemedText>
                  </View>
                </View>
                <View
                  style={[styles.row, { justifyContent: "space-between", alignItems: "flex-end" }]}
                >
                  <ThemedText type="sFat" style={{ color: colors.black }}>
                    {getRelativeTime(item.itemCreationDate)}
                  </ThemedText>
                  <View
                    style={[
                      styles.ebay,
                      { backgroundColor: colors.black, borderColor: colors.accent },
                    ]}
                  >
                    <Link
                      onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}
                      href={item.itemWebUrl as ExternalPathString}
                    >
                      <ThemedText type="sFat" style={{ color: colors.white }}>
                        view on ebay
                      </ThemedText>
                    </Link>
                  </View>
                </View>
              </View>
            ))}
          </View>
          <View style={styles.footer}>
            <RepeatRow count={20}>
              <ThemedText type="lFat" style={{ color: colors.black }}>
                -
              </ThemedText>
            </RepeatRow>
            <Pressable onPress={() => setVisible(false)}>
              <ThemedText style={{ color: colors.black, textDecorationLine: "underline" }}>
                exit
              </ThemedText>
            </Pressable>
            <RepeatRow count={20}>
              <ThemedText type="lFat" style={{ color: colors.black }}>
                -
              </ThemedText>
            </RepeatRow>
          </View>
          <RepeatRow
            style={[styles.edge, styles.bottomEdge]}
            rowItemStyle={[styles.edgePiece, { backgroundColor: colors.white }]}
          />
        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: defaultSpacing,
    paddingVertical: defaultSpacing * 4,
  },
  receipt: {
    width: "100%",
    shadowOffset: {
      width: 0,
      height: -1,
    },
    shadowOpacity: 1,
    shadowRadius: 50,
    elevation: -2,
    paddingVertical: defaultSpacing * 2,
  },
  row: {
    width: "100%",
    flexDirection: "row",
  },
  edge: {
    position: "absolute",
    overflow: "hidden",
    gap: defaultSpacing / 2,
  },
  topEdge: {
    top: 0,
    transform: "translateY(-25%)",
    paddingTop: defaultSpacing / 2,
  },
  bottomEdge: {
    bottom: 0,
    transform: "translateY(25%)",
    paddingBottom: defaultSpacing / 2,
  },
  edgePiece: {
    aspectRatio: 1 / 1,
    transform: "rotate(45deg)",
  },
  header: {
    alignItems: "center",
    gap: defaultSpacing,
  },
  preview: {
    width: "35%",
    aspectRatio: 1 / 1,
    borderWidth: 1,
    padding: defaultSpacing / 4,
  },
  items: {
    paddingVertical: defaultSpacing * 2,
    paddingHorizontal: defaultSpacing / 2,
    gap: defaultSpacing / 2,
  },
  item: {
    paddingTop: defaultSpacing / 2,
    paddingBottom: defaultSpacing,
    gap: defaultSpacing * 2,
  },
  itemPreview: {
    width: "15%",
    aspectRatio: 1 / 1,
    borderWidth: 1,
  },
  ebay: {
    paddingVertical: defaultSpacing / 4,
    paddingHorizontal: defaultSpacing / 2,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    alignItems: "center",
    paddingHorizontal: defaultSpacing / 2,
    gap: defaultSpacing / 2,
  },
  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
});
