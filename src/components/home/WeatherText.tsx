import React from "react";
import { TextStyle } from "react-native";

import { Text } from "../shared/Themed";

import Colors from "@/constants/Colors";

interface IProps {
  children?: React.ReactNode;
  color?: string;
  style?: Omit<TextStyle, "color"> | (Omit<TextStyle, "color"> | undefined)[];
}

export default function WeatherText({ children, color, style }: IProps) {
  const homeColor = Colors["home"];
  return (
    <Text
      numberOfLines={1}
      adjustsFontSizeToFit
      style={[style, { color: color || homeColor.text }]}
    >
      {children}
    </Text>
  );
}
