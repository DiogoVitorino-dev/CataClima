import NetInfo from "@react-native-community/netinfo";

import WeatherAxios from "./AxiosConfig";
import { CoordinatesProps, Flags, WeatherProps } from "../../constants";
import { CountryStateCities } from "../../libs";
import { convertCountryCodeToName } from "../../utils";

import { OpenWeatherCurrentResponse } from "@/models/OpenWeather/OpenWeatherCurrentResponse";
import { OpenWeatherForecastResponse } from "@/models/OpenWeather/OpenWeatherForecastResponse";

// WeatherFetch
const getWeatherData = async (coords: CoordinatesProps) => {
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

		const state = await CountryStateCities().findStateCodeOfCity(
			weatherData.sys.country,
			weatherData.name,
		);

		const country = convertCountryCodeToName(weatherData.sys.country);

		const newWeather: WeatherProps = {
			id: "",
			city: weatherData.name,
			country,
			state,
			feelsLike: forecastData.list[0].main.feels_like,
			maxTemperature: forecastData.list[0].main.temp_max,
			minTemperature: forecastData.list[0].main.temp_min,
			humidity: weatherData.main.humidity,
			pressure: weatherData.main.pressure,
			pressureUnit: "mBar",
			temperature: weatherData.main.temp,
			temperatureUnit: "c",
			wind: parseFloat((weatherData.wind.speed * 3.6).toFixed(1)),
			windUnit: "km/h",
			weatherDescription: weatherData.weather[0].description,
			coords: {
				latitude: coords.latitude,
				longitude: coords.longitude,
			},
			datetime: new Date().toISOString(),
			weatherMain: weatherData.weather[0].main.toLowerCase(),
		};

		return newWeather;
	} else throw new Error(Flags.errors.NOCONNECTION);
};

export function WeatherService() {
	return { getWeatherData };
}
