import { StyleSheet, TextStyle, View, ViewStyle } from "react-native";

import WeatherText from "./WeatherText";
import { getFontScale } from "../shared/Themed";

import Colors from "@/constants/Colors";

interface IProps {
  value: string | number;
  unit: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function WeatherTemperature({
  unit,
  value,
  style,
  textStyle,
}: IProps) {
  const color = Colors["home"];
  return (
    <View style={[style, styles.container]}>
      <WeatherText
        style={[
          textStyle,
          { fontSize: getFontScale(textStyle?.fontSize || 16) },
        ]}
      >
        {value}
      </WeatherText>

      <WeatherText
        style={[
          textStyle,
          {
            fontSize: getFontScale(textStyle?.fontSize || 16) / 1.8,
          },
        ]}
        color={color.subtitle}
      >
        {unit}
      </WeatherText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    justifyContent: "center",
    flexDirection: "row",
  },
});
