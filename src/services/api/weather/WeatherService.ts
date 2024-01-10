import NetInfo from "@react-native-community/netinfo";

import WeatherAxios from "./AxiosConfig";

import { EFlags } from "@/constants/EnumApp";
import IWeather, { ICoordinates } from "@/models/WeatherModel";
import { WeatherApiResponse } from "@/models/weatherApi/WeatherApiResponse";
import { ConversionService } from "@/services/ConversionService";

// WeatherFetch
const getWeatherData = async (coords: ICoordinates, id = "") => {
  const { isConnected } = await NetInfo.fetch();

  if (isConnected) {
    const customAxios = new WeatherAxios().instance;

    const currentWeather = await customAxios.get<WeatherApiResponse>(
      `/current.json?q=${coords.latitude},${coords.longitude}&aqi=no`,
    );

    const { current, location } = currentWeather.data;

    const { getWeatherTheme, toConditionsApp, toFixed } = ConversionService;

    const conditionApp = toConditionsApp(current.condition.code);

    const newWeather: IWeather = {
      id,
      coords: {
        latitude: location.lat,
        longitude: location.lon,
      },
      data: {
        current: conditionApp,
        description: current.condition.text,
        icon: getWeatherTheme(conditionApp, current.is_day === 0).icon,
        isNight: current.is_day === 0,
        timestamp: new Date().toISOString(),
      },
      humidity: {
        value: toFixed(current.humidity),
        unit: "%",
      },
      wind: {
        value: toFixed(current.wind_kph),
        unit: "km/h",
      },
      location: {
        city: location.name,
        state: location.region,
        country: location.country,
      },
      pressure: {
        value: current.pressure_mb,
        unit: "mBar",
      },
      temperature: {
        value: toFixed(current.temp_c, 0),
        feelsLike: toFixed(current.feelslike_c, 0),
        unit: "c",
      },
    };

    return newWeather;
  } else throw new Error(EFlags.NO_CONNECTION);
};

export function WeatherService() {
  return { getWeatherData };
}
