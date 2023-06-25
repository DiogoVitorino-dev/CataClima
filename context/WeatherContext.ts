import { createContext } from "react";
import { Weather, WeatherProps } from "../models/Weather";
import { UserWeathersDatabasePublicProps } from "../database/UserWeathersDatabase";

export interface WeatherContextProps extends UserWeathersDatabasePublicProps {
    WeatherData: WeatherProps
    setWeather?:(newWeather: WeatherProps) => Promise<void>        
}
export const WeatherContext = createContext({
    WeatherData: new Weather({}),    
} as WeatherContextProps)

