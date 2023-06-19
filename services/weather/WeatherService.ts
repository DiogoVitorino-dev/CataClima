import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import NetInfo from '@react-native-community/netinfo';
import UserCitiesDatabase from '../../database/UserCitiesDatabase';
import { Platform } from 'react-native';

// WeatherFetch
const getWeatherData = async ({latitude,longitude}:{latitude:number,longitude:number}) => {
  const {isConnected} = await NetInfo.fetch()

  console.log(latitude,longitude,'fetch')

  if (isConnected) {
    const results = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=189e59cef8761ca837947decee8d7ab9&units=metric&lang=pt_br`)

    const minmax = await fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&cnt=1&appid=189e59cef8761ca837947decee8d7ab9&units=metric`)
    

    const json = await results.json()
    const minMaxJson = await minmax.json()

    const newCity = {
      locationName: json.name,
      feelsLike: minMaxJson.list[0].main.feels_like.toFixed(0),
      maxTemperature: minMaxJson.list[0].main.temp_max.toFixed(0),
      minTemperature: minMaxJson.list[0].main.temp_min.toFixed(0),
      humidity: json.main.humidity,
      pressure: json.main.pressure,
      temperature: json.main.temp.toFixed(0),
      wind: json.wind.speed,
      weatherDetail: json.weather[0].description,
      coords: {
        latitude: latitude,
        longitude: longitude
      },
      datetime:new Date().toLocaleString('pt-br'),
      weatherMain:json.weather[0].main.toLowerCase(),
      icon:json.weather[0].main.toLowerCase(),   
    }
    
    UserCitiesDatabase().addCity(json.name, newCity)
     
    return newCity 
  }

  return null 
}

 
async function weatherBackgroundFetchTask() {  
  // Background task
  const WEATHER_FETCH_TASK = 'cataclima-weather-fetch';

  TaskManager.defineTask(WEATHER_FETCH_TASK, async () => {
      try {
          const receivedNewData = await getWeatherData({
            latitude:-7.9294828, 
            longitude:-34.8605903
          })
            return receivedNewData 
          ? BackgroundFetch.BackgroundFetchResult.NewData 
          : BackgroundFetch.BackgroundFetchResult.NoData;
      } catch (error) {
          BackgroundFetch.unregisterTaskAsync(WEATHER_FETCH_TASK);      
          return BackgroundFetch.BackgroundFetchResult.Failed;
      }    
  });

  async function registerBackgroundFetchAsync() {
    return BackgroundFetch.registerTaskAsync(WEATHER_FETCH_TASK, {
      minimumInterval: 60 * 20, // 20 minutes
      stopOnTerminate: false, // android only,
      startOnBoot: true, // android only
    });
  }

  const checkStatusAsync = async () => {
      const status = await BackgroundFetch.getStatusAsync();
      const isRegistered = await TaskManager.isTaskRegisteredAsync(WEATHER_FETCH_TASK);
      return {status,isRegistered}    
  };

  const checkIsBackgroundAvailable = ( 
      status:BackgroundFetch.BackgroundFetchStatus | null) => {
      if(status != null)
          switch (status) {
              case BackgroundFetch.BackgroundFetchStatus.Restricted:                
              case BackgroundFetch.BackgroundFetchStatus.Denied:
                  console.log('Background está restrito')
                  return false;

              default: return true
                                          
          }
      return false        
  }
  
  // executing
  // Background fetch
    const {isRegistered,status} = await checkStatusAsync()    
    
    if (!isRegistered)    
      if(checkIsBackgroundAvailable(status)) 
        await registerBackgroundFetchAsync()
  
}

export default function WeatherService() { 
  if (Platform.OS !== 'web')  weatherBackgroundFetchTask()
  return {getWeatherData}
}