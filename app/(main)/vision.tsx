import { StyleSheet, Platform, Dimensions, View, Pressable } from "react-native";
import { Buffer } from "buffer";
import React, { useEffect, useState } from "react";
import { cameraWithTensors } from "@tensorflow/tfjs-react-native";
import * as COCO from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
import { Camera, CameraType } from "expo-camera/legacy";
import { Canvas, Group, interpolateColors, Paint, RoundedRect } from "@shopify/react-native-skia";
import {
  runOnJS,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { ThemedText } from "@/components/themedText";
import { LinearGradient } from "expo-linear-gradient";
import { useAppSelector } from "@/lib/hooks";
import { ThemedView } from "@/components/themedView";
import { useMutation } from "@tanstack/react-query";
import { searchByImage } from "@/lib/axios";
import { ExpoWebGLRenderingContext } from "expo-gl";

const textureDimensions =
  Platform.OS === "ios" ? { width: 1080, height: 1920 } : { width: 1200, height: 1600 };

const tensorShape = {
  width: 200,
  height: 200,
  depth: 3,
};

const TensorCamera = cameraWithTensors(Camera);

const idleAnimDuration = 2000;

export default function Vision() {
  const { width, height } = Dimensions.get("window");
  const [isReady, setIsReady] = useState(false);
  const [idle, setIdle] = useState(true);
  const idleRotation = useSharedValue(0);
  const idleTransform = useDerivedValue(() => {
    return [{ rotate: Math.PI * idleRotation.value }];
  }, [idleRotation]);
  const { colors, colorsRGBA } = useAppSelector((store) => store.theme);
  const [detectionStrokeColors] = useState([
    `rgba(${colorsRGBA.white[0]},${colorsRGBA.white[1]},${colorsRGBA.white[2]},0.5)`,
    `rgba(${colorsRGBA.brand[0]},${colorsRGBA.brand[1]},${colorsRGBA.brand[2]},0.5)`,
  ]);
  const [detectionFillColors] = useState([
    `rgba(${colorsRGBA.white[0]},${colorsRGBA.white[1]},${colorsRGBA.white[2]},0.25)`,
    `rgba(${colorsRGBA.brand[0]},${colorsRGBA.brand[1]},${colorsRGBA.brand[2]},0.25)`,
  ]);
  const detectionStrokeColor = useDerivedValue(() => {
    return interpolateColors(idle ? 0 : 1, [0, 1], detectionStrokeColors);
  });
  const detectionFillColor = useDerivedValue(() => {
    return interpolateColors(idle ? 0 : 1, [0, 1], detectionFillColors);
  });
  const detectionX = useSharedValue(width / 2 - 25);
  const detectionY = useSharedValue(height / 2 - 25);
  const detectionWidth = useSharedValue(50);
  const detectionHeight = useSharedValue(50);
  const cornerRadius = useSharedValue(4);
  const [detectionClass, setDetectionClass] = useState("");
  const [model, setModel] = useState<COCO.ObjectDetection>();
  const [currentTensor, setCurrentTensor] = useState<tf.Tensor3D>();
  const [predictions, setPredictions] = useState<COCO.DetectedObject[]>([]);
  const user = useAppSelector((store) => store.auth.credentials?.user);
  const { mutateAsync } = useMutation({ mutationFn: searchByImage });

  const handleCameraStream = (
    images: IterableIterator<tf.Tensor3D>,
    gl: ExpoWebGLRenderingContext
  ) => {
    const loop = async () => {
      try {
        const next: tf.Tensor3D = await images.next().value;
        const shouldFlipX = Platform.OS !== "ios";
        const scaleWidth = width / tensorShape.width;
        const scaleHeight = height / tensorShape.height;
        if (!!model && !!next) {
          setCurrentTensor(tf.clone(next));

          const nextPredictions = await model.detect(next);
          setPredictions(nextPredictions);

          if (nextPredictions.length > 0) {
            setIdle(false);
            const topPrediction = nextPredictions.reduce(
              (curr, prev) => (curr.score >= prev.score ? curr : prev),
              { bbox: [0, 0, 0, 0], class: "", score: 0 }
            );
            const bbox = {
              x: topPrediction.bbox[0],
              y: topPrediction.bbox[1],
              width: topPrediction.bbox[2],
              height: topPrediction.bbox[3],
            };
            const scaleX = shouldFlipX
              ? width - bbox.x * scaleWidth - bbox.width * scaleWidth
              : bbox.x * scaleWidth;
            const scaleY = bbox.y * scaleHeight;

            detectionX.value = withSpring(scaleX);
            detectionY.value = withSpring(scaleY);
            detectionWidth.value = withSpring(bbox.width * scaleWidth);
            detectionHeight.value = withSpring(bbox.height * scaleHeight);
            setDetectionClass(topPrediction.class);
          } else {
            detectionX.value = withSpring(width / 2 - 25);
            detectionY.value = withSpring(height / 2 - 25);
            detectionWidth.value = withSpring(50);
            detectionHeight.value = withSpring(50);
            setIdle(true);
          }

          tf.dispose([next]);
        }
        gl.endFrameEXP();
      } catch (error) {
        console.log("stream error: ", error);
      }

      requestAnimationFrame(loop);
    };

    loop();
  };

  // const handleImageSearch = async () => {
  //   console.log(1);
  //   if (!currentTensor) return;
  //   console.log(2);
  //   const bytes = await currentTensor.data();
  //   console.log(3);
  //   const base64Image = Buffer.from(bytes).toString("base64");
  //   console.log(4);
  //   await mutateAsync(base64Image);
  // };

  useEffect(() => {
    idleRotation.value = idle
      ? withRepeat(
          withSequence(
            withTiming(1, { duration: idleAnimDuration }),
            withTiming(
              0,
              { duration: idleAnimDuration * 2 },
              () =>
                (cornerRadius.value = withTiming(detectionWidth.value / 2, {
                  duration: idleAnimDuration,
                }))
            ),
            withTiming(
              2,
              { duration: idleAnimDuration },
              () => (cornerRadius.value = withTiming(4, { duration: idleAnimDuration }))
            )
          ),
          -1,
          false
        )
      : 0;
  }, [idle]);

  useEffect(() => {
    const init = async () => {
      await Camera.requestCameraPermissionsAsync();
      await tf.ready();
      const coco = await COCO.load();
      setModel(coco);
      setIsReady(true);
    };

    try {
      init();
    } catch (error) {
      console.log("init error: ", error);
    }
  }, []);

  return (
    <>
      {isReady && (
        <TensorCamera
          style={styles.camera}
          type={1}
          cameraTextureHeight={textureDimensions.height}
          cameraTextureWidth={textureDimensions.width}
          resizeHeight={tensorShape.height}
          resizeWidth={tensorShape.width}
          resizeDepth={tensorShape.depth}
          autorender={false}
          onReady={(images, _, gl) => {
            try {
              runOnJS(handleCameraStream)(images, gl);
            } catch (error) {
              console.log("camera error: ", error);
            }
          }}
          useCustomShadersToResize={false}
        />
      )}
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={[colors.black, "transparent"]}
          style={[styles.gradient, { bottom: 0 }]}
          start={{ x: 0.5, y: 1 }}
          end={{ x: 0.5, y: 0 }}
        />
        <LinearGradient
          colors={[colors.black, "transparent"]}
          style={[styles.gradient, { top: 0 }]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
        <Canvas style={styles.canvas}>
          <Group origin={{ x: width / 2, y: height / 2 }} transform={idleTransform}>
            <RoundedRect
              x={detectionX}
              y={detectionY}
              width={detectionWidth}
              height={detectionHeight}
              r={cornerRadius}
              color="transparent"
            >
              <Paint color={detectionStrokeColor} style="stroke" strokeWidth={2} />
              <Paint color={detectionFillColor} style="fill" />
            </RoundedRect>
          </Group>
        </Canvas>
        <ThemedView style={styles.classes} noBackgroundColor horizontalPadding>
          <ThemedText
            style={{
              color: predictions.length > 0 ? colors.white : colors.accent,
              textAlign: "right",
            }}
            type="mFat"
          >
            //onscreen
          </ThemedText>
          {predictions.map((p, i) => (
            <ThemedText
              style={{
                color: p.class === detectionClass ? colors.brand : colors.accent,
                textAlign: "right",
              }}
              key={i}
              type="xs"
            >
              {p.class === detectionClass ? `${p.class} - ${p.score}` : p.class}
            </ThemedText>
          ))}
        </ThemedView>
        <ThemedView style={styles.greeting} noBackgroundColor statusBarPadding horizontalPadding>
          <ThemedText style={{ color: colors.accent }} type="mFat">
            Good Morning
          </ThemedText>
          <ThemedText type="xlFat" style={{ color: colors.white }}>
            {user?.Username ?? "Welcome"}
          </ThemedText>
        </ThemedView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  gradient: {
    width: "100%",
    height: "25%",
    position: "absolute",
  },
  camera: {
    width: "100%",
    height: "100%",
  },
  canvas: {
    width: "100%",
    height: "100%",
  },
  greeting: {
    position: "absolute",
    top: 0,
  },
  classes: {
    position: "absolute",
    top: "25%",
    right: 0,
  },
  web: {
    width: "100%",
    height: "25%",
    zIndex: 1,
  },
});
