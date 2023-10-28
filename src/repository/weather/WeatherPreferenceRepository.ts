import AsyncStorage from "@react-native-async-storage/async-storage";

import { IPreferenceValue } from "./WeatherRepositoryInterfaces";

export enum EWeatherPreferences {
  WEATHER_PREFERENCE_ID = "WEATHER_PREFERENCE_ID",
}

export default class WeatherPreferenceRepository
  implements IPreferenceValue<string>
{
  async setPreference(item: string): Promise<void> {
    return await AsyncStorage.setItem(
      EWeatherPreferences.WEATHER_PREFERENCE_ID,
      item,
    );
  }
  async getPreference(): Promise<string | null> {
    const result = await AsyncStorage.getItem(
      EWeatherPreferences.WEATHER_PREFERENCE_ID,
    );

    if (result) {
      return result;
    }

    return null;
  }
  async removePreference(nextPreference?: string | undefined): Promise<void> {
    if (nextPreference) {
      await AsyncStorage.setItem(
        EWeatherPreferences.WEATHER_PREFERENCE_ID,
        nextPreference,
      );
      return;
    }

    await AsyncStorage.removeItem(EWeatherPreferences.WEATHER_PREFERENCE_ID);
  }
}
