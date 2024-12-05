import { searchByImage } from "@/lib/axios";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setHistory, setIsSubmitting } from "@/lib/redux/slices/vision";
import { useMutation } from "@tanstack/react-query";
import { useCameraPermissions, CameraView } from "expo-camera";
import { ImageManipulator } from "expo-image-manipulator";
import { useRef, useImperativeHandle, useEffect, forwardRef } from "react";
import { LayoutAnimation, StyleSheet, ViewProps } from "react-native";
import * as Haptics from "expo-haptics";

export type CameraProps = ViewProps;

export type CameraHandles = {
  handleCameraSearch: () => Promise<void>;
  handleImageSearch: (image: string) => Promise<void>;
};

export const Camera = forwardRef<CameraHandles, CameraProps>(
  ({ style, children, ...otherProps }, ref) => {
    const { colors } = useAppSelector((store) => store.theme);
    const { history } = useAppSelector((store) => store.vision);
    const dispatch = useAppDispatch();
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView>(null);
    const { mutateAsync } = useMutation({ mutationFn: searchByImage });
    useImperativeHandle(ref, () => ({
      handleCameraSearch,
      handleImageSearch,
    }));

    const handleCameraSearch = async () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      dispatch(setIsSubmitting(true));
      if (!cameraRef.current) return;

      const image = await cameraRef.current.takePictureAsync();
      if (!image) return;

      handleSearchByImage(image.uri);
    };

    const handleImageSearch = async (image: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      dispatch(setIsSubmitting(true));
      if (!cameraRef.current) return;

      handleSearchByImage(image);
    };

    const handleSearchByImage = async (image: string) => {
      const ctx = ImageManipulator.manipulate(image);
      const resizedImage = await ctx.resize({ width: 100 }).renderAsync();
      const finalImage = await resizedImage.saveAsync({ base64: true });

      const response = await mutateAsync({ image: finalImage.base64! });
      dispatch(
        setHistory([
          {
            key: image,
            image: { base64: undefined, ...finalImage },
            results: response.data,
            resultIndex: 0,
          },
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
        style={[StyleSheet.absoluteFill, { backgroundColor: colors.black }, style]}
        facing="back"
        {...otherProps}
      >
        {children}
      </CameraView>
    );
  }
);
