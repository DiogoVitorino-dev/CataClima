import { IconsFontAwesome } from "../constants";

export interface Weather {
	id: string;
	temperature: ITemperature;
	information: IWeather;
	wind: IWind;
	coords: ICoordinates;
}

interface IWeather {
	current: string;
	description: string;
	icon: IconsFontAwesome;
	timeStamp: Date;
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

interface IMeasurable {
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
