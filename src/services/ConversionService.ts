import Colors from "@/constants/Colors";
import { IconsFeather } from "@/constants/TypesApp";
import { EConditions } from "@/models/WeatherModel";
import WeatherApiConditions from "@/models/weatherApi/WeatherApiConditions";

function toLowerCase<Type>(value: string): Type {
  return value.toLowerCase() as Type;
}

function toFixed(value: number, fractionDigits = 1): number {
  return parseFloat(value.toFixed(fractionDigits));
}

function toConditionsApp(value: any): EConditions {
  const message = WeatherApiConditions.find(
    (condition) => condition.code === value,
  )?.day.toLowerCase();

  if (!message) {
    return EConditions.NONE;
  }

  const rain = /rain|drizzle|sleet/;
  const storm = /thundery|heavy rain|heavy sleet|torrential rain/;
  const cloud = /cloudy|overcast|mist|fog/;
  const clear = /sunny/;
  const snow = /snow|sleet|blizzard|ice/;

  if (storm.test(message)) {
    return EConditions.STORMY;
  }

  if (rain.test(message)) {
    return EConditions.RAINY;
  }

  if (cloud.test(message)) {
    return EConditions.CLOUDY;
  }

  if (clear.test(message)) {
    return EConditions.CLEAR;
  }

  if (snow.test(message)) {
    return EConditions.SNOWY;
  }

  return EConditions.NONE;
}

interface IWeatherTheme {
  icon: IconsFeather;
  gradient: keyof typeof Colors.gradient;
}

const getWeatherTheme = (
  condition: EConditions,
  isNight?: boolean,
): IWeatherTheme => {
  switch (condition) {
    case EConditions.STORMY:
      return {
        icon: "cloud-rain",
        gradient: "stormy",
      };

    case EConditions.CLEAR:
      if (isNight) {
        return {
          icon: "moon",
          gradient: "night",
        };
      }

      return {
        icon: "sun",
        gradient: "sunny",
      };

    case EConditions.RAINY:
      return {
        icon: "cloud-drizzle",
        gradient: "rainy",
      };

    case EConditions.SNOWY:
      return {
        icon: "cloud-snow",
        gradient: "snowy",
      };

    case EConditions.CLOUDY:
      return {
        icon: "cloud",
        gradient: "cloudy",
      };
    default:
      return {
        icon: "cloud-off",
        gradient: "default",
      };
  }
};

export const ConversionService = {
  toLowerCase,
  getWeatherTheme,
  toConditionsApp,
  toFixed,
};
