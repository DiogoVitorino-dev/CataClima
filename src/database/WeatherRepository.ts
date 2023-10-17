import AsyncStorage from "@react-native-async-storage/async-storage";

import { IKeyValueStorage } from "./Repositoryinterfaces";
import { EWeatherPreferences } from "./WeatherPreferenceRepository";
import IWeather from "../models/WeatherModel";

export default class WeatherRepository implements IKeyValueStorage<IWeather> {
	async set(key: string, value: IWeather): Promise<void> {
		console.log(value);

		return await AsyncStorage.setItem(key, JSON.stringify(value));
	}

	async get(): Promise<IWeather[]> {
		const list = await AsyncStorage.getAllKeys();

		list.filter((keyItem) => {
			let include = true;
			Object.values(EWeatherPreferences).forEach((value) => {
				if (keyItem === value || keyItem === "EXPO_CONSTANTS_INSTALLATION_ID")
					include = false;
			});
			return include;
		});

		const convertedList = (await AsyncStorage.multiGet(list))
			.filter(([key, value]) => typeof value === "string")
			.map(([key, value]) => {
				return JSON.parse(value!) as IWeather;
			});

		return convertedList;
	}

	async delete(key: string): Promise<void> {
		return await AsyncStorage.removeItem(key);
	}
}

/**if (search) {
			return convertedList.filter((value) => {
				let isMatch = value.location.city.match(new RegExp(search, "i"));
				if (isMatch) return true;

				isMatch = value.location.state.match(new RegExp(search, "i"));
				if (isMatch) return true;

				isMatch = value.location.country.match(new RegExp(search, "i"));
				if (isMatch) return true;

				return false;
			});
		} */
