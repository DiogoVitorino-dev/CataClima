import { createAsyncThunk, nanoid } from "@reduxjs/toolkit";

import { RootState } from "../store";

import IWeather, { ICoordinates } from "@/models/WeatherModel";
import WeatherPreferenceRepository from "@/repository/weather/WeatherPreferenceRepository";
import WeatherRepository from "@/repository/weather/WeatherRepository";
import { WeatherService } from "@/services/api/weather/WeatherService";

const weatherAdded = createAsyncThunk(
  "weathers/weatherAdded",
  async (coords: ICoordinates) => {
    const result = await WeatherService().getWeatherData(coords);
    result.id = nanoid();
    await new WeatherRepository().set(result.id, result);
    await new WeatherPreferenceRepository().setPreference(result.id);
    return result;
  },
);

const weatherUpdated = createAsyncThunk(
  "weathers/weatherUpdated",
  async (oldValue: IWeather) => {
    const result = await WeatherService().getWeatherData(
      oldValue.coords,
      oldValue.id,
    );
    await new WeatherRepository().set(result.id, result);
    return result;
  },
);

const getWeathers = createAsyncThunk(
  "weathers/getWeathers",
  async () => await new WeatherRepository().get(),
);

const getWeatherPreference = createAsyncThunk(
  "weathers/getWeatherPreference",
  async () => await new WeatherPreferenceRepository().getPreference(),
);

const setWeatherPreference = createAsyncThunk(
  "weathers/setWeatherPreference",
  async (idPreference: string) => {
    await new WeatherPreferenceRepository().setPreference(idPreference);
    return idPreference;
  },
);

const weatherRemoved = createAsyncThunk<string, string, { state: RootState }>(
  "weathers/weatherRemoved",
  async (key: string, { getState }) => {
    await new WeatherRepository().delete(key);
    if (getState().weathers.idPreference === key)
      await new WeatherPreferenceRepository().removePreference();

    return key;
  },
);

export const WeatherThunks = {
  weatherAdded,
  weatherRemoved,
  weatherUpdated,
  getWeathers,
  getWeatherPreference,
  setWeatherPreference,
};
