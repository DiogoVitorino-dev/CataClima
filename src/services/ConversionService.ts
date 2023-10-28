import Colors from "@/constants/Colors";
import { IconsFeather } from "@/constants/TypesApp";
import { TConditions } from "@/models/openWeather/OpenWeatherCurrentResponse";

function toLowerCase<Type>(value: string): Type {
  return value.toLowerCase() as Type;
}

function toFixed(value: number, fractionDigits = 1): number {
  return parseFloat(value.toFixed(fractionDigits));
}

interface IWeatherTheme {
  icon: IconsFeather;
  gradient: keyof typeof Colors.gradient;
}

const getWeatherTheme = (main: TConditions): IWeatherTheme => {
  switch (main) {
    case "fog":
    case "clouds":
    case "mist":
    case "squall":
      return {
        icon: "cloud",
        gradient: "cloudy",
      };

    case "clear":
      return {
        icon: "sun",
        gradient: "sunny",
      };

    case "rain":
    case "drizzle":
      return {
        icon: "cloud-drizzle",
        gradient: "rainy",
      };

    case "thunderstorm":
    case "tornado":
      return {
        icon: "cloud-rain",
        gradient: "rainy",
      };

    case "snow":
      return {
        icon: "cloud-snow",
        gradient: "snow",
      };

    case "dust":
    case "haze":
    case "sand":
      return {
        icon: "rewind",
        gradient: "dust",
      };

    case "smoke":
      return {
        icon: "flag",
        gradient: "fire",
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
  toFixed,
};
