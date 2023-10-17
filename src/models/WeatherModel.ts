import { IconsFontAwesome } from "../constants";

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
	current: string;
	description: string;
	icon: IconsFontAwesome;
	timeStamp: number;
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
