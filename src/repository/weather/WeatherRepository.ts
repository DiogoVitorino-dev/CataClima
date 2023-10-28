import AsyncStorage from "@react-native-async-storage/async-storage";

import { EWeatherPreferences } from "./WeatherPreferenceRepository";
import { IKeyValueStorage } from "./WeatherRepositoryInterfaces";

import IWeather from "@/models/WeatherModel";

export default class WeatherRepository implements IKeyValueStorage<IWeather> {
  async set(key: string, value: IWeather): Promise<void> {
    return await AsyncStorage.setItem(key, JSON.stringify(value));
  }

  async get(): Promise<IWeather[]> {
    let list = await AsyncStorage.getAllKeys();

    list = list.filter((keyItem) => {
      let include = true;
      Object.values(EWeatherPreferences).forEach((value) => {
        if (keyItem === value || keyItem === "EXPO_CONSTANTS_INSTALLATION_ID")
          include = false;
      });

      return include;
    });

    if (list.length === 0) return [];

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
