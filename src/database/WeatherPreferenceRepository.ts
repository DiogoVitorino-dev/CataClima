import AsyncStorage from "@react-native-async-storage/async-storage";

import { IPreferenceItem } from "./Repositoryinterfaces";
import IWeather from "../models/WeatherModel";

export enum EWeatherPreferences {
	WEATHER_PREFERENCE_ID = "WEATHER_PREFERENCE_ID",
}

export default class WeatherPreferenceRepository
	implements IPreferenceItem<IWeather>
{
	async setPreference(item: IWeather): Promise<void> {
		return await AsyncStorage.setItem(
			EWeatherPreferences.WEATHER_PREFERENCE_ID,
			JSON.stringify(item),
		);
	}
	async getPreference(): Promise<IWeather | null> {
		const result = await AsyncStorage.getItem(
			EWeatherPreferences.WEATHER_PREFERENCE_ID,
		);

		if (result) {
			return JSON.parse(result) as IWeather;
		}

		return null;
	}
	async removePreference(nextPreference?: IWeather | undefined): Promise<void> {
		if (nextPreference) {
			await AsyncStorage.setItem(
				EWeatherPreferences.WEATHER_PREFERENCE_ID,
				JSON.stringify(nextPreference),
			);
			return;
		}

		await AsyncStorage.removeItem(EWeatherPreferences.WEATHER_PREFERENCE_ID);
	}
}
