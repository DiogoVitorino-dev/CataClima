import NetInfo from "@react-native-community/netinfo";
import { fromUnixTime } from "date-fns";

import WeatherAxios from "./AxiosConfig";

import { EFlags } from "@/constants/EnumApp";
import IWeather, { ICoordinates } from "@/models/WeatherModel";
import { OpenWeatherCurrentResponse } from "@/models/openWeather/OpenWeatherCurrentResponse";
import { OpenWeatherForecastResponse } from "@/models/openWeather/OpenWeatherForecastResponse";
import { CitiesService } from "@/services/CitiesService";
import { ConversionService } from "@/services/ConversionService";

// WeatherFetch
const getWeatherData = async (coords: ICoordinates, id = "") => {
  const { isConnected } = await NetInfo.fetch();
  if (isConnected) {
    const customAxios = new WeatherAxios().instance;

    const currentWeather = await customAxios.get<OpenWeatherCurrentResponse>(
      `/weather?lat=${coords.latitude}&lon=${coords.longitude}`,
    );

    const forecastWeather = await customAxios.get<OpenWeatherForecastResponse>(
      `/forecast?lat=${coords.latitude}&lon=${coords.longitude}`,
    );

    const weatherData = currentWeather.data;
    const forecastData = forecastWeather.data;

    const locationInfo = await CitiesService.findCityByCoords(coords);

    const { getWeatherTheme, toLowerCase, toFixed } = ConversionService;

    const newWeather: IWeather = {
      id,
      coords: {
        latitude: weatherData.coord.lat,
        longitude: weatherData.coord.lon,
      },
      data: {
        current: toLowerCase(weatherData.weather[0].main),
        description: weatherData.weather[0].description,
        timestamp: fromUnixTime(weatherData.dt).toISOString(),
        icon: getWeatherTheme(toLowerCase(weatherData.weather[0].main)).icon,
        sunrise: fromUnixTime(weatherData.sys.sunrise).toISOString(),
        sunset: fromUnixTime(weatherData.sys.sunset).toISOString(),
      },
      humidity: {
        value: toFixed(weatherData.main.humidity),
        unit: "%",
      },
      wind: {
        value: toFixed(weatherData.wind.speed * 3.6),
        unit: "km/h",
      },
      location: {
        city: weatherData.name,
        state: locationInfo.stateCode,
        country: weatherData.sys.country,
      },
      pressure: {
        value: weatherData.main.pressure,
        unit: "mBar",
      },
      temperature: {
        value: toFixed(weatherData.main.temp, 0),
        feelsLike: toFixed(forecastData.list[0].main.feels_like, 0),
        max: toFixed(forecastData.list[0].main.temp_max, 0),
        min: toFixed(forecastData.list[0].main.temp_min, 0),
        unit: "c",
      },
    };

    return newWeather;
  } else throw new Error(EFlags.NO_CONNECTION);
};

export function WeatherService() {
  return { getWeatherData };
}
