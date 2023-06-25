import Flags from '../constants/Flags';

export class Weather implements WeatherProps {
  public locationName: string;
  public temperature: number;
  public maxTemperature: number;
  public minTemperature: number;
  public feelsLike: number;
  public humidity: number;
  public pressure: number;
  public wind: number;
  public weatherDetail: string;
  public coords: {latitude: number; longitude: number};
  public datetime: string;
  public weatherMain: string;
  public icon: string;

  constructor({
    locationName,
    temperature,
    maxTemperature,
    minTemperature,
    feelsLike,
    humidity,
    pressure,
    wind,
    weatherDetail,
    coords,
    weatherMain,
    datetime,
    icon,
  } : {
    locationName?: string;
    temperature?: number;
    maxTemperature?: number;
    minTemperature?: number;
    feelsLike?: number;
    humidity?: number;
    pressure?: number;
    wind?: number;
    weatherDetail?: string;
    coords?: {latitude: number; longitude: number};
    icon?: string;
    weatherMain?: string;
    datetime?: string;
  }) {
    this.locationName = locationName || '';
    this.temperature = temperature || 0;
    this.maxTemperature = maxTemperature || 0;
    this.minTemperature = minTemperature || 0;
    this.feelsLike = feelsLike || 0;
    this.humidity = humidity || 0;
    this.pressure = pressure || 0;
    this.wind = wind || 0;
    this.weatherDetail = weatherDetail || '';
    this.coords = coords || {latitude: 0, longitude: 0};
    (this.datetime = datetime || ''), (this.weatherMain = weatherMain || '');
    this.icon = icon || '';
  }

  static convertToIonicIcon(name: string | any) {
    if (name) {    
      
      name = name.toLowerCase();
      switch (name) {
        case Flags.WeatherApiState.SUNNY:
          return 'sunny';
        case Flags.WeatherApiState.CLOUDY:
          return 'cloud';
        case Flags.WeatherApiState.RAINY:
          return 'rain';
        case Flags.WeatherApiState.SNOW:
          return 'snow';
      }
    }
    return '';
  }
}

export interface WeatherProps {
  locationName: string;
  temperature: number;
  maxTemperature: number;
  minTemperature: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  wind: number;
  weatherDetail: string;
  coords: {latitude: number; longitude: number};
  icon: string;
  weatherMain: string;
  datetime: string;
}
