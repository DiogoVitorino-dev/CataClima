import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";

import Colors from "@/constants/Colors";
import { useAppSelector } from "@/hooks/ReduxHooks";
import { ConversionService } from "@/services/ConversionService";
import { DateTimeService } from "@/services/DateTimeService";
import { WeathersSelectors } from "@/store/weather/WeatherSelectors";

interface IProps {
  children?: React.JSX.Element | React.JSX.Element[];
}

export default function HomeBackground({ children }: IProps) {
  const [gradient, setGradient] = useState<string[]>(Colors.gradient.default);

  const weather = useAppSelector((state) =>
    WeathersSelectors.selectPreference(state),
  );

  useEffect(() => {
    handleGradient();
  }, [weather]);

  const handleGradient = () => {
    if (weather) {
      const { gradient } = ConversionService.getWeatherTheme(
        weather.data.current,
        weather.data.isNight,
      );
      setGradient(Colors.gradient[gradient]);
    }
  };

  return (
    <LinearGradient
      colors={gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ flex: 1 }}
    >
      {children}
    </LinearGradient>
  );
}
