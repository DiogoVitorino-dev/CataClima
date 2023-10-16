import FontAwesome from '@expo/vector-icons/FontAwesome';

export interface CoordinatesProps {
    latitude:number
    longitude:number
}

export const InitialWeatherProps:WeatherProps = {
	id:'',
	city:'',
	state:'',
	country:'',
	temperature:0,
	maxTemperature:0,
	minTemperature:0,
	temperatureUnit:'',
	feelsLike:0,
	coords:{latitude:0,longitude:0},
	datetime:'',
	humidity:0,
	pressure:0,
	pressureUnit:'',
	weatherDescription:'',
	weatherMain:'',
	wind:0,
	windUnit:''

};

export interface WeatherProps {
    id:string
    city: string;
    state:string;
    country:string;
    temperature: number;
    maxTemperature: number;
    minTemperature: number;
    temperatureUnit:string
    feelsLike: number;
    humidity: number;
    pressure: number;
    pressureUnit: string;
    wind: number;
    windUnit: string
    weatherDescription: string;
    coords: {latitude:number,longitude:number}
    weatherMain: string;
    datetime: string;
}

export type IconsFontAwesome = keyof typeof FontAwesome.glyphMap;

