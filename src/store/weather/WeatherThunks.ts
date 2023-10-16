import { createAsyncThunk, nanoid } from "@reduxjs/toolkit";

import { CoordinatesProps, WeatherProps } from "../../constants";
import UserWeathersDatabase from "../../database/UserWeathersDatabase";
import { WeatherService } from "../../services/weather";

export const fetchAndUpdateWeather = createAsyncThunk(
	"weathers/fetchAndUpdateWeather",
	async (state: WeatherProps) => {
		const result = await WeatherService().getWeatherData(state.coords);
		result.id = state.id;
		await UserWeathersDatabase().updateWeatherDB(result);
		return result;
	},
);

export const fetchWeather = createAsyncThunk(
	"weathers/fetchWeather",
	async (coords: CoordinatesProps) => WeatherService().getWeatherData(coords),
);

export const retrieveWeathersFromDB = createAsyncThunk(
	"weathers/retrieveWeathersFromDB",
	async () => await UserWeathersDatabase().getAllWeathersDB(),
);

export const getCurrentWeatherIDFromDB = createAsyncThunk(
	"weathers/getCurrentWeatherIDFromDB",
	async () => await UserWeathersDatabase().getCurrentWeatherID(),
);

export const setCurrentWeatherID = createAsyncThunk(
	"weathers/setCurrentWeatherID",
	async (newCurrentWeatherID: string) =>
		await UserWeathersDatabase().setCurrentWeatherID(newCurrentWeatherID),
);

export const weatherAdded = createAsyncThunk(
	"weathers/weatherAdded",
	async (weather: WeatherProps) => {
		weather.id = nanoid();
		await UserWeathersDatabase().addWeatherDB(weather);
		await UserWeathersDatabase().setCurrentWeatherID(weather.id);
		return weather;
	},
);

export const weatherRemoved = createAsyncThunk(
	"weathers/weatherRemoved",
	async (weatherID: string, { dispatch }) => {
		await UserWeathersDatabase().deleteWeatherDB(weatherID);
		await dispatch(getCurrentWeatherIDFromDB()).unwrap();
		return weatherID;
	},
);
