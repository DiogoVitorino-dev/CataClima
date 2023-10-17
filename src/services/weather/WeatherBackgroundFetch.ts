import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import { Platform } from "react-native";

import { WeatherService } from "./WeatherService";
import UserWeathersDatabase from "../../database/WeatherRepository";

export function WeatherBackgroundFetchTask() {
	// Background task
	const WEATHER_FETCH_TASK = "cataclima-weather-fetch";

	TaskManager.defineTask(WEATHER_FETCH_TASK, async () => {
		try {
			const weatherStored = await UserWeathersDatabase().getWeatherDB(
				await UserWeathersDatabase().getCurrentWeatherID(),
			);

			if (weatherStored) {
				const weather = await WeatherService().getWeatherData(
					weatherStored.coords,
				);
				weather.id = weatherStored.id;
				await UserWeathersDatabase().updateWeatherDB(weather);
				return BackgroundFetch.BackgroundFetchResult.NewData;
			}
			//Failed to get city on database
			return BackgroundFetch.BackgroundFetchResult.NoData;
		} catch (error) {
			BackgroundFetch.unregisterTaskAsync(WEATHER_FETCH_TASK);
			return BackgroundFetch.BackgroundFetchResult.Failed;
		}
	});

	async function registerBackgroundFetchAsync() {
		return BackgroundFetch.registerTaskAsync(WEATHER_FETCH_TASK, {
			minimumInterval: 60 * 30, // 30 minutes
			stopOnTerminate: false,
			startOnBoot: true,
		});
	}

	const checkStatusAsync = async () => {
		const status = await BackgroundFetch.getStatusAsync();
		const isRegistered =
			await TaskManager.isTaskRegisteredAsync(WEATHER_FETCH_TASK);
		return { status, isRegistered };
	};

	const checkIsBackgroundAvailable = (
		status: BackgroundFetch.BackgroundFetchStatus | null,
	) => {
		if (status != null)
			switch (status) {
				case BackgroundFetch.BackgroundFetchStatus.Restricted:
				case BackgroundFetch.BackgroundFetchStatus.Denied:
					console.log("Background está restrito");
					return false;

				default:
					return true;
			}
		return false;
	};

	// executing
	const exec = async () => {
		if (Platform.OS === "android" || Platform.OS === "ios") {
			const { isRegistered, status } = await checkStatusAsync();
			if (!isRegistered)
				if (checkIsBackgroundAvailable(status))
					await registerBackgroundFetchAsync();
		}
	};
	return { exec };
}
