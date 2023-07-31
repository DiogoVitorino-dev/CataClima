import { City } from "country-state-city"
import { WeatherProps } from "../../constants/Interfaces"


export default function CountryStateCities() {

    const searchCities = async (searchText:string,ignoreCities:WeatherProps[] = []) => {        
        const reg = new RegExp(`^${searchText}`,'i')
        let list = City.getCitiesOfCountry('BR')
      
        //filter only the first letter to reduce the size of the list for more complex comparison
        list = list?.filter(city=> new RegExp(`^${searchText[0]}`,'i').test(city.name))
      
        if(list) 
          return list.filter(city => 

            city.name.match(reg) &&

            ignoreCities.findIndex(weather => 
              weather.city === city.name && 
              weather.state === city.stateCode
            ) === -1
          )
         
        return []
        
    }
    
    const findStateCodeOfCity = async (country:string,cityName:string) => {
      const cityfound = City.getCitiesOfCountry(country)
      ?.find(city => new RegExp(`^${city.name}`,'i').test(cityName))

      return cityfound?.stateCode || ''
    }

    return {searchCities,findStateCodeOfCity}
}

