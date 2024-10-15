import { searchByImage } from "@/lib/axios";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setHistory, setIsSubmitting } from "@/lib/redux/slices/vision";
import { useMutation } from "@tanstack/react-query";
import { useCameraPermissions, CameraView } from "expo-camera";
import { manipulateAsync } from "expo-image-manipulator";
import { LinearGradient } from "expo-linear-gradient";
import { useRef, useImperativeHandle, useEffect, forwardRef } from "react";
import { LayoutAnimation, StyleSheet, ViewProps } from "react-native";

export type CameraProps = ViewProps;

export type CameraHandles = {
  handleImageSearch: () => Promise<void>;
};

export const Camera = forwardRef<CameraHandles, CameraProps>(({ style, ...otherProps }, ref) => {
  const { colors } = useAppSelector((store) => store.theme);
  const { history } = useAppSelector((store) => store.vision);
  const dispatch = useAppDispatch();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const { mutateAsync } = useMutation({ mutationFn: searchByImage });
  useImperativeHandle(ref, () => ({
    handleImageSearch,
  }));

  const handleImageSearch = async () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    dispatch(setIsSubmitting(true));
    if (!cameraRef.current) return;

    const image = await cameraRef.current.takePictureAsync();
    if (!image) return;

    const resizedImage = await manipulateAsync(image.uri, [{ resize: { width: 100 } }], {
      base64: true,
    });

    const response = await mutateAsync({ image: resizedImage.base64! });
    dispatch(
      setHistory([
        { key: image.uri, image: { base64: undefined, ...resizedImage }, results: response.data },
        ...history,
      ])
    );
    dispatch(setIsSubmitting(false));
  };

  useEffect(() => {
    const init = async () => {
      await requestPermission();
    };

    try {
      init();
    } catch (error) {
      console.log("init error: ", error);
    }
  }, []);

  if (!permission?.granted) return null;

  return (
    <CameraView
      ref={cameraRef}
      style={[StyleSheet.absoluteFill, style]}
      facing="back"
      animateShutter
      {...otherProps}
    >
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
    </CameraView>
  );
});

const styles = StyleSheet.create({
  gradient: {
    width: "100%",
    height: "25%",
    position: "absolute",
  },
});
