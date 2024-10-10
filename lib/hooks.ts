import { type TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./redux/store";

export function useThemeColors(props: { light?: string; dark?: string }) {
  const { colors, theme } = useAppSelector((store) => store.theme);
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return colors;
  }
}

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
