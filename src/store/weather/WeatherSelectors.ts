import { entitySelectors } from "./WeatherSlice";
import { RootState } from "../store";

export const selectWeatherRequestStatus = (state: RootState) =>
	state.weathers.statusRequest;

export const selectWeatherRequestError = (state: RootState) =>
	state.weathers.error;

export const { selectAll: selectAllWeathers, selectById: selectWeatherById } =
	entitySelectors;
