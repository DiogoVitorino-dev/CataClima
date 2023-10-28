import { useEffect, useState } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import WeatherItem from "./WeatherItem";
import WeatherText from "./WeatherText";
import Divider from "../shared/Divider";

import Colors from "@/constants/Colors";
import Strings from "@/constants/Strings";
import { useAppSelector } from "@/hooks/ReduxHooks";
import { DateTimeService } from "@/services/DateTimeService";
import { WeathersSelectors } from "@/store/weather/WeatherSelectors";

interface IProps {
  style?: StyleProp<ViewStyle>;
}

export default function WeatherDetail({ style }: IProps) {
  const color = Colors["home"];
  const [dayOfWeek, setDayOfWeek] = useState<string>("");
  const weather = useAppSelector((state) =>
    WeathersSelectors.selectPreference(state),
  );

  useEffect(() => {
    if (weather)
      setDayOfWeek(DateTimeService.getDayOfWeek(weather.data.timestamp));
  }, [weather]);

  if (!weather) return <></>;

  return (
    <View style={[styles.container, style]}>
      <WeatherText style={styles.dayOfWeek}>{dayOfWeek}</WeatherText>

      <Divider width={300} color={color.borderColor} />

      <View style={styles.detail}>
        <WeatherItem
          icon="temperature-low"
          label={Strings.labels.feelsLike}
          value={`${weather.temperature.feelsLike}°${weather.temperature.unit}`}
        />
        <WeatherItem
          icon="tint"
          label={Strings.labels.humidity}
          value={`${weather.humidity.value} ${weather.humidity.unit}`}
        />
        <WeatherItem
          icon="wind"
          label={Strings.labels.wind}
          value={`${weather.wind.value} ${weather.wind.unit}`}
        />
        <WeatherItem
          icon="weight"
          label={Strings.labels.pressure}
          value={`${weather.pressure.value} ${weather.pressure.unit}`}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
  },

  backgroundImage: {
    width: 500,
    height: 500,
  },

  detail: {
    width: "100%",
    maxWidth: 500,
    flexDirection: "row",
    marginVertical: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  dayOfWeek: {
    fontSize: 26,
    textTransform: "capitalize",
    marginVertical: 18,
  },
});
