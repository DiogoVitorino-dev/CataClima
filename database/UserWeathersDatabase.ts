import AsyncStorage from '@react-native-async-storage/async-storage';
import {Weather, WeatherProps} from '../models/Weather';

export default function UserWeathersDatabase() {
  const addWeatherInDB = async (newWeather: WeatherProps) => {
    try {
        const current = await getCurrent()
        
        
            
        //If Current item was created but it's empty or it's receiving new data for it
        if(
          !current.locationName || 
          current.locationName === newWeather.locationName
        ) 
            AsyncStorage.mergeItem('current',JSON.stringify(newWeather))

        // if already exists, merge
        if (await checkIsAlreadyInDB(newWeather.locationName))
          AsyncStorage.mergeItem(
            newWeather.locationName,
            JSON.stringify(newWeather)
          )                
        else
          AsyncStorage.setItem(
            newWeather.locationName,
            JSON.stringify(newWeather)
          )             
    
    } catch (e) {
      console.log(e,'UserWeathersDatabase/addWeatherInDB')
    }
  };

  const getWeatherOnDB = async (locationName: string) => {
    if (locationName) {
      try {
        const weatherStored = await AsyncStorage.getItem(locationName.toLocaleLowerCase());

        if (weatherStored !== null) return new Weather(JSON.parse(weatherStored));
      } catch (e) {        
        console.log(e, 'UserWeathersDatabase/getWeatherOnDB');
      }
    }
  };
  
  const deleteWeatherInDB = async (locationName:string) => {
    const currentWeather = await getCurrent()
    
    if (currentWeather?.locationName === locationName) {
      const weathersStored = await getAllWeathersNames()
      const newcurrentWeather = await getWeatherOnDB(weathersStored[0]) || new Weather({})
      setCurrent(newcurrentWeather) 
    }

    AsyncStorage.removeItem(locationName)
  }

  const checkIsAlreadyInDB = async (key:string) => 
      (await AsyncStorage.getAllKeys()).includes(key)

  const getCurrent = async () => {  
    const currentValue = await AsyncStorage.getItem('current')

    if(currentValue) 
      return JSON.parse(currentValue) as WeatherProps
    else {
      createCurrent()
      return new Weather({})
    }
  };
  
  const setCurrent =  (newCurrent:WeatherProps) => 
    AsyncStorage.setItem('current', JSON.stringify(newCurrent))
  

  const createCurrent = async () => {
      if (!await checkIsAlreadyInDB('current'))
        setCurrent(new Weather({}))                  
  }

  const getAllWeathersNames = async () => {
    const cities = await AsyncStorage.getAllKeys();
    return cities.filter(key => 
      key !== 'current' && 
      key !== 'EXPO_CONSTANTS_INSTALLATION_ID')
  };

  return {
    addWeatherInDB, 
    getWeatherOnDB,
    deleteWeatherInDB, 
    getCurrent, 
    getAllWeathersNames
};
}

export interface UserWeathersDatabasePublicProps {  
  deleteWeatherInDB: (locationName:string) => Promise<void>  
  getAllWeathersNames: () => Promise<string[]>
}
