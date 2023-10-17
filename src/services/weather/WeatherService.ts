import NetInfo from "@react-native-community/netinfo";
import { parseISO } from "date-fns";

import WeatherAxios from "./AxiosConfig";
import { Flags } from "../../constants";
import { CountryStateCities } from "../../libs";
import IWeather, { ICoordinates } from "../../models/WeatherModel";
import { OpenWeatherCurrentResponse } from "../../models/openWeather/OpenWeatherCurrentResponse";
import { OpenWeatherForecastResponse } from "../../models/openWeather/OpenWeatherForecastResponse";
import { convertCountryCodeToName } from "../../utils";

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

		const state = await CountryStateCities().findStateCodeOfCity(
			weatherData.sys.country,
			weatherData.name,
		);

		const country = convertCountryCodeToName(weatherData.sys.country);

		const newWeather: IWeather = {
			id,
			coords: {
				latitude: weatherData.coord.lat,
				longitude: weatherData.coord.lon,
			},
			data: {
				current: weatherData.weather[0].main.toLowerCase(),
				description: weatherData.weather[0].description,
				timeStamp: weatherData.dt,
				icon: "cloud",
			},
			humidity: {
				value: weatherData.main.humidity,
				unit: "%",
			},
			wind: {
				value: weatherData.wind.speed * 3.6,
				unit: "km/h",
			},
			location: {
				city: weatherData.name,
				country,
				state,
			},
			pressure: {
				value: weatherData.main.pressure,
				unit: "mBar",
			},
			temperature: {
				value: weatherData.main.temp,
				feelsLike: forecastData.list[0].main.feels_like,
				max: forecastData.list[0].main.temp_max,
				min: forecastData.list[0].main.temp_min,
				unit: "c",
			},
		};

		return newWeather;
	} else throw new Error(Flags.errors.NOCONNECTION);
};

export function WeatherService() {
	return { getWeatherData };
}
