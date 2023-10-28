import { TConditions } from "./openWeather/OpenWeatherCurrentResponse";

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
  current: TConditions;
  description: string;
  icon: IconsFeather;
  timestamp: string;
  sunrise: string;
  sunset: string;
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
  min: number;
  max: number;
}

export interface IPressure extends IMeasurable {}

export interface IHumidity extends IMeasurable {}

export interface IWind extends IMeasurable {}
