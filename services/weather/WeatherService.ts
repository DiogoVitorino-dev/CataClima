import NetInfo from '@react-native-community/netinfo';
import Flags from '../../constants/Flags';
import project from '../../cache/project.json';
import { WeatherProps, CoordinatesProps } from '../../constants/Interfaces';
import { City } from 'country-state-city';
import convertCountryCodeToName from '../../scripts/convertCountryCodeToName';

// WeatherFetch
const getWeatherData = async (coords:CoordinatesProps) => {  
  const {isConnected} = await NetInfo.fetch();

  if (isConnected) {
    const resultsInfo = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${project.WeatherApiKey}&units=metric&lang=pt_br`)    

    const minmaxTempInfoJSON = await fetch(
      `http://api.openweathermap.org/data/2.5/forecast?lat=${coords.latitude}&lon=${coords.longitude}&cnt=1&appid=${project.WeatherApiKey}&units=metric`,
    )

    const informationJSON = await resultsInfo.json();
    const minMaxInfoJSON = await minmaxTempInfoJSON.json();
    
    const cityfound = City.getCitiesOfCountry(informationJSON.sys.country)
    ?.find(city => new RegExp(`^${city.name}`,'i').test(informationJSON.name))

    const newWeather:WeatherProps = {
      id:'',
      city: informationJSON.name,
      country: convertCountryCodeToName(informationJSON.sys.country),
      state: cityfound?.stateCode || '',
      feelsLike: parseInt(minMaxInfoJSON.list[0].main.feels_like),
      maxTemperature: parseInt(minMaxInfoJSON.list[0].main.temp_max),
      minTemperature: parseInt(minMaxInfoJSON.list[0].main.temp_min),
      humidity: informationJSON.main.humidity,
      pressure: informationJSON.main.pressure,
      pressureUnit:'mBar',
      temperature: informationJSON.main.temp.toFixed(0),
      temperatureUnit:'c',
      wind: parseFloat((informationJSON.wind.speed * 3.6).toFixed(1)),
      windUnit:'km/h',
      weatherDescription: informationJSON.weather[0].description,
      coords:coords,
      datetime: new Date().toISOString(),
      weatherMain: informationJSON.weather[0].main.toLowerCase()
    };

    console.log('fetch');
    
    
    return newWeather;

    } else 
      throw new Error(Flags.errors.NOCONNECTION)
};



export default function WeatherService() {
  return {getWeatherData};
}

