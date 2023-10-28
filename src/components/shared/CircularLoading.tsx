import { ActivityIndicator, StyleProp, ViewStyle } from "react-native";

import { useAppColor } from "@/hooks/ThemeHooks";

interface IProps {
  visible?: boolean;
  size?: number | "small" | "large";
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export function CircularLoading({ color, visible, size, style }: IProps) {
  const appColor = useAppColor();
  return (
    <ActivityIndicator
      style={style}
      animating={visible || false}
      size={size}
      color={color || appColor.tint}
    />
  );
}
