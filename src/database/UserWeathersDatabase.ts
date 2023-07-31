import AsyncStorage from '@react-native-async-storage/async-storage';
import { InitialWeatherProps, WeatherProps } from '../constants/Interfaces';

export default function UserWeathersDatabase() {
  const addWeatherDB = async (newWeather: WeatherProps) => {
    try {      
        // if already exists, merge
        if (await checkIsAlreadyInDB(newWeather.id))
          AsyncStorage.mergeItem(
            newWeather.id,
            JSON.stringify(newWeather).trim()
          )
        else
          AsyncStorage.setItem(
            newWeather.id,
            JSON.stringify(newWeather).trim()
          )             
    
    } catch (e) {
      console.log(e,'UserWeathersDatabase/addWeatherInDB')
    }
  };

  const updateWeatherDB = async (weatherUpdated:WeatherProps) => {
    if(await checkIsAlreadyInDB(weatherUpdated.id))
      AsyncStorage.mergeItem(weatherUpdated.id,JSON.stringify(weatherUpdated))
  }

  const getWeatherDB = async (id: string) => {
    const weatherStored = await AsyncStorage.getItem(id);
    if (weatherStored !== null) return JSON.parse(weatherStored.trim()) as WeatherProps;
  }; 

  const deleteWeatherDB = async (id:string) => {
    const currentWeather = await getCurrentWeatherID()
    
    if (currentWeather === id) {
      const weathersStored = await getAllWeathersDB()     

      setCurrent(weathersStored[0]?.id || '') 
    }

    AsyncStorage.removeItem(id)
  }

  const getAllWeathersDB = async () => {
    let ids = await AsyncStorage.getAllKeys(); 
    ids = ids.filter(key => 
      key !== 'currentWeatherID' && 
      key !== 'EXPO_CONSTANTS_INSTALLATION_ID'
    )    

    const weathers = await AsyncStorage.multiGet(ids)     

    return weathers.map(([key,value]) => value 
    ? JSON.parse(value.trim()) as WeatherProps 
    : InitialWeatherProps)
  }; 

  const getCurrentWeatherID = async () => {  
    const currentWeatherId = await AsyncStorage.getItem('currentWeatherID')    

    if(currentWeatherId) return currentWeatherId 
    return await createCurrent()
  };
  
  const setCurrentWeatherID = async (newID:string) => {  
    await AsyncStorage.setItem('currentWeatherID',newID.trim())
      
    return newID
  }

  const checkIsAlreadyInDB = async (id:string) => 
      (await AsyncStorage.getAllKeys()).includes(id)
  
  const createCurrent = async () => {
    if (!await checkIsAlreadyInDB('currentWeatherID'))
      await setCurrent('')
      return ''
  }

  const setCurrent =  (id:string) => 
    AsyncStorage.setItem('currentWeatherID', id)  

  return {
    addWeatherDB, 
    getWeatherDB,
    updateWeatherDB,
    deleteWeatherDB, 
    getCurrentWeatherID,
    setCurrentWeatherID,
    getAllWeathersDB
};
}

export interface UserWeathersDatabasePublicProps {  
  deleteWeatherInDB: (id:string) => Promise<void>  
  getAllWeathersNames: () => Promise<string[]>
}
