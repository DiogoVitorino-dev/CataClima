import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import NetInfo from '@react-native-community/netinfo';
import UserCitiesDatabase from '../../database/UserWeathersDatabase';
import {Platform} from 'react-native';
import Flags from '../../constants/Flags';
import { Weather, WeatherProps } from '../../models/Weather';
import project from '../../cache/project.json';

// WeatherFetch
const getWeatherData = async ({latitude, longitude}: {latitude?: number; longitude?: number}) => {
  if (latitude && longitude) {
    const {isConnected} = await NetInfo.fetch();

  if (isConnected) {
    const resultsInfo = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${project.WeatherApiKey}&units=metric&lang=pt_br`)    

    const minmaxTempInfoJSON = await fetch(
      `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&cnt=1&appid=${project.WeatherApiKey}&units=metric`,
    )

    const informationJSON = await resultsInfo.json();
    const minMaxInfoJSON = await minmaxTempInfoJSON.json();    

      const newCity = {
        locationName: informationJSON.name,
        feelsLike: minMaxInfoJSON.list[0].main.feels_like.toFixed(0),
        maxTemperature: minMaxInfoJSON.list[0].main.temp_max.toFixed(0),
        minTemperature: minMaxInfoJSON.list[0].main.temp_min.toFixed(0),
        humidity: informationJSON.main.humidity,
        pressure: informationJSON.main.pressure,
        temperature: informationJSON.main.temp.toFixed(0),
        wind: informationJSON.wind.speed,
        weatherDetail: informationJSON.weather[0].description,
        coords: {
          latitude: latitude,
          longitude: longitude,
        },
        datetime: new Date().toLocaleString('pt-br'),
        weatherMain: informationJSON.weather[0].main.toLowerCase(),
        icon: Weather.convertToIonicIcon(informationJSON.weather[0].main.toLowerCase()),
      } as WeatherProps;

      UserCitiesDatabase().addWeatherInDB(newCity);

      return newCity;

    } else throw Flags.ErrorFlags.NOCONNECTION
    
  }

  return null;
};

async function weatherBackgroundFetchTask() {
  // Background task
  const WEATHER_FETCH_TASK = 'cataclima-weather-fetch';

  TaskManager.defineTask(WEATHER_FETCH_TASK, async () => {
    try {
      const weatherStored = await UserCitiesDatabase().getCurrent()   

      if (weatherStored) {
        const receivedNewData = await getWeatherData(weatherStored.coords);
        return receivedNewData !== null
          ? BackgroundFetch.BackgroundFetchResult.NewData
          : BackgroundFetch.BackgroundFetchResult.NoData;
      }
      //Failed to get city on database
      return BackgroundFetch.BackgroundFetchResult.Failed;
    } catch (error) {
      BackgroundFetch.unregisterTaskAsync(WEATHER_FETCH_TASK);
      return BackgroundFetch.BackgroundFetchResult.Failed;
    }
  });

  async function registerBackgroundFetchAsync() {
    return BackgroundFetch.registerTaskAsync(WEATHER_FETCH_TASK, {
      minimumInterval: 60 * 20, // 20 minutes
      stopOnTerminate: false,
      startOnBoot: true,
    });
  }

  const checkStatusAsync = async () => {
    const status = await BackgroundFetch.getStatusAsync();
    const isRegistered = await TaskManager.isTaskRegisteredAsync(WEATHER_FETCH_TASK);
    return {status, isRegistered};
  };

  const checkIsBackgroundAvailable = (status: BackgroundFetch.BackgroundFetchStatus | null) => {
    if (status != null)
      switch (status) {
        case BackgroundFetch.BackgroundFetchStatus.Restricted:
        case BackgroundFetch.BackgroundFetchStatus.Denied:
          console.log('Background está restrito');
          return false;

        default:
          return true;
      }
    return false;
  };

  // executing
  // Background fetch
  const {isRegistered, status} = await checkStatusAsync();

  if (!isRegistered) if (checkIsBackgroundAvailable(status)) await registerBackgroundFetchAsync();
}

export default function WeatherService() {
  if (Platform.OS !== 'web') weatherBackgroundFetchTask();
  return {getWeatherData};
}

