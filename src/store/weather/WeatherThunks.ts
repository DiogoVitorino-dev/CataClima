import { createAsyncThunk, nanoid } from "@reduxjs/toolkit";

import WeatherPreferenceRepository from "../../database/WeatherPreferenceRepository";
import WeatherRepository from "../../database/WeatherRepository";
import IWeather, { ICoordinates } from "../../models/WeatherModel";
import { WeatherService } from "../../services/weather";
import { RootState } from "../store";

export const addWeather = createAsyncThunk(
	"weathers/addWeather",
	async (coords: ICoordinates) => {
		const result = await WeatherService().getWeatherData(coords);
		result.id = nanoid();
		await new WeatherRepository().set(result.id, result);
		return result;
	},
);

export const updateWeather = createAsyncThunk(
	"weathers/fetchWeather",
	async (oldValue: IWeather) => {
		const result = await WeatherService().getWeatherData(
			oldValue.coords,
			oldValue.id,
		);
		await new WeatherRepository().set(result.id, result);
		return result;
	},
);

export const retrieveWeathersFromDB = createAsyncThunk(
	"weathers/retrieveWeathersFromDB",
	async () => await new WeatherRepository().get(),
);

export const getCurrentWeatherIDFromDB = createAsyncThunk(
	"weathers/getCurrentWeatherIDFromDB",
	async () => await new WeatherPreferenceRepository().getPreference(),
);

export const setCurrentWeatherID = createAsyncThunk(
	"weathers/setCurrentWeatherID",
	async (newCurrentWeatherID: IWeather) => {
		await new WeatherPreferenceRepository().setPreference(newCurrentWeatherID);
		return newCurrentWeatherID.id;
	},
);

export const weatherRemoved = createAsyncThunk<
	string,
	string,
	{ state: RootState }
>("weathers/weatherRemoved", async (key: string, { getState }) => {
	await new WeatherRepository().delete(key);
	if (getState().weathers.currentWeatherID === key)
		await new WeatherPreferenceRepository().removePreference();

	return key;
});
