import {
  StyleSheet,
  TextStyle,
  View,
  StyleProp,
  ViewStyle,
} from "react-native";

import WeatherText from "./WeatherText";
import { getFontScale } from "../shared/Themed";

import Colors from "@/constants/Colors";

interface IProps {
  value: React.ReactNode;
  unit: React.ReactNode;
  style?: StyleProp<ViewStyle>;
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
          styles.value,
          textStyle,
          { fontSize: getFontScale(textStyle?.fontSize || 16) },
        ]}
      >
        {value}
      </WeatherText>

      <WeatherText
        style={[
          styles.unit,
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
  value: {},
  unit: {},
});
