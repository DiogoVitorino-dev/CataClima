import { FontAwesome5 } from "@expo/vector-icons";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import WeatherText from "./WeatherText";

import Colors from "@/constants/Colors";

interface IProps {
  icon: any;
  label: string;
  value: string;
  style?: StyleProp<ViewStyle>;
}

export default function WeatherItem({ icon, label, value, style }: IProps) {
  const color = Colors["home"];
  return (
    <View style={[styles.container, style]}>
      <FontAwesome5 name={icon} color={color.icon} size={30} />
      <WeatherText style={styles.label}>{label}</WeatherText>
      <WeatherText style={styles.value}>{value}</WeatherText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "20%",
    height: 80,
    padding: 3,
    margin: 3,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  label: {
    fontSize: 12,
    textTransform: "capitalize",
  },

  value: {
    fontSize: 14,
  },
});
