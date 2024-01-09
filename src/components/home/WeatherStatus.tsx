import { Feather } from "@expo/vector-icons";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import WeatherTemperature from "./WeatherTemperature";
import WeatherText from "./WeatherText";

import Colors from "@/constants/Colors";
import { useAppSelector } from "@/hooks/ReduxHooks";
import { WeathersSelectors } from "@/store/weather/WeatherSelectors";

interface IProps {
  style?: StyleProp<ViewStyle>;
}

export default function WeatherStatus({ style }: IProps) {
  const color = Colors["home"];
  const weather = useAppSelector((state) =>
    WeathersSelectors.selectPreference(state),
  );

  if (!weather) return <></>;

  return (
    <View style={[styles.container, style]}>
      <Feather name={weather.data.icon} size={150} color={color.icon} />

      <WeatherTemperature
        value={weather.temperature.value}
        unit={`°${weather.temperature.unit}`}
        textStyle={styles.temperature}
      />

      <WeatherText style={styles.description}>
        {weather.data.description}
      </WeatherText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: 500,
    flexDirection: "column",
    alignItems: "center",
  },

  temperature: {
    fontSize: 76,
  },

  description: {
    fontSize: 28,
    textTransform: "capitalize",
  },
});
