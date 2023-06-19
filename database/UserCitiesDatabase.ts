import AsyncStorage from '@react-native-async-storage/async-storage';
import { Weather, WeatherProps } from '../models/Weather';

export default function UserCitiesDatabase() {   

    const getCity = async (locationName:string) => {
        if (locationName) {
            try {
                const value = await AsyncStorage.getItem(locationName.toLocaleLowerCase())
                // value previously stored
                if(value !== null)
                    return new Weather(JSON.parse(value))
    
            } catch(e) {
                // error reading value
                console.log(e,'UserCitiesDatabase/getCity');        
            }            
        }        
    }
    
    const addCity = async (key:string,newCity:WeatherProps) => {
        try {        
            const jsonValue = JSON.stringify(newCity)
            key = key.toLocaleLowerCase()
          
            if(await getCity(key))
                await AsyncStorage.mergeItem(key, jsonValue)
            else          
                await AsyncStorage.setItem(key, jsonValue)
        } catch (e) {
          // saving error
          console.log(e,'UserCitiesDatabase/addCity');
        }
    }   

    const getAllCitiesNames = async () => {
        const cities = await AsyncStorage.getAllKeys()
        return cities.slice(1,cities.length)
    }   

    return {getCity,addCity,getAllCitiesNames}
}