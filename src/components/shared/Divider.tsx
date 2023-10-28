import React from "react";
import { DimensionValue, View } from "react-native";

import { useAppColor } from "@/hooks/ThemeHooks";

interface IProps {
  color?: string;
  width?: DimensionValue;
  height?: number;
  lineSize?: DimensionValue;
}

export default function Divider({ color, height, lineSize, width }: IProps) {
  const appColor = useAppColor();
  return (
    <View
      style={{
        backgroundColor: color || appColor.borderColor,
        height: lineSize || 1,
        width: width || "100%",
        marginVertical: height || 3,
        borderRadius: 3,
      }}
    />
  );
}
