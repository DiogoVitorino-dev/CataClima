import { IconsFeather } from "@/constants/TypesApp";

export default interface IWeather {
  id: string;
  location: ILocation;
  humidity: IHumidity;
  temperature: ITemperature;
  data: IWeatherData;
  wind: IWind;
  pressure: IPressure;
  coords: ICoordinates;
}

export interface IWeatherData {
  current: EConditions;
  description: string;
  icon: IconsFeather;
  isNight: boolean;
  timestamp: string;
}

export interface ICoordinates {
  latitude: number;
  longitude: number;
}

export interface ILocation {
  city: string;
  state: string;
  country: string;
}

export interface IMeasurable {
  value: number;
  unit: string;
}

export interface ITemperature extends IMeasurable {
  feelsLike: number;
}

export interface IPressure extends IMeasurable {}

export interface IHumidity extends IMeasurable {}

export interface IWind extends IMeasurable {}

export enum EConditions {
  NONE = "NONE",
  CLEAR = "CLEAR",
  RAINY = "RAINY",
  STORMY = "STORMY",
  CLOUDY = "CLOUDY",
  SNOWY = "SNOWY",
}
