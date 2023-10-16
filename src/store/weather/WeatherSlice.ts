import {
	SerializedError,
	createEntityAdapter,
	createSlice,
	isFulfilled,
	isPending,
	isRejected,
} from "@reduxjs/toolkit";

import {
	fetchAndUpdateWeather,
	fetchWeather,
	getCurrentWeatherIDFromDB,
	retrieveWeathersFromDB,
	setCurrentWeatherID,
	weatherAdded,
	weatherRemoved,
} from "./WeatherThunks";
import { WeatherProps } from "../../constants";
import { RootState } from "../store";

export interface WeatherStateProps {
	currentWeatherID: string;
	statusRequest: "idle" | "pending" | "success" | "failed";
	error: null | SerializedError;
}

const weatherAdapter = createEntityAdapter<WeatherProps>();

const initialState = weatherAdapter.getInitialState({
	currentWeatherID: "",
	statusRequest: "idle",
	error: null,
} as WeatherStateProps);

const genericIsPending = isPending(
	fetchAndUpdateWeather,
	fetchWeather,
	weatherAdded,
	weatherRemoved,
	retrieveWeathersFromDB,
	setCurrentWeatherID,
	getCurrentWeatherIDFromDB,
);

const genericIsFulfilled = isFulfilled(
	fetchAndUpdateWeather,
	fetchWeather,
	weatherAdded,
	weatherRemoved,
	retrieveWeathersFromDB,
	setCurrentWeatherID,
	getCurrentWeatherIDFromDB,
);

const genericIsRejected = isRejected(
	fetchAndUpdateWeather,
	fetchWeather,
	weatherAdded,
	weatherRemoved,
	retrieveWeathersFromDB,
	setCurrentWeatherID,
	getCurrentWeatherIDFromDB,
);

const weathersSlice = createSlice({
	name: "weathers",
	initialState,
	reducers: {
		resetStatus: (state) => {
			state.statusRequest = "idle";
		},

		resetError: (state) => {
			state.error = null;
		},
	},
	extraReducers(builder) {
		builder
			.addCase(fetchAndUpdateWeather.fulfilled, (state, action) => {
				weatherAdapter.upsertOne(state, action.payload);
			})

			.addCase(weatherAdded.fulfilled, (state, action) => {
				weatherAdapter.upsertOne(state, action.payload);
				state.currentWeatherID = action.payload.id;
			})

			.addCase(weatherRemoved.fulfilled, (state, action) => {
				weatherAdapter.removeOne(state, action.payload);
			})

			.addCase(retrieveWeathersFromDB.fulfilled, (state, action) => {
				weatherAdapter.setAll(state, action.payload);
			})

			.addCase(getCurrentWeatherIDFromDB.fulfilled, (state, action) => {
				state.currentWeatherID = action.payload;
			})

			.addCase(setCurrentWeatherID.fulfilled, (state, action) => {
				state.currentWeatherID = action.payload;
			})

			.addMatcher(genericIsFulfilled, (state) => {
				state.statusRequest = "success";
			})

			.addMatcher(genericIsPending, (state) => {
				state.statusRequest = "pending";
			})

			.addMatcher(genericIsRejected, (state, action) => {
				state.statusRequest = "failed";
				state.error = action.error;
			});
	},
});

export const { resetStatus, resetError } = weathersSlice.actions;

export const entitySelectors = weatherAdapter.getSelectors<RootState>(
	(state) => state.weathers,
);

export default weathersSlice.reducer;
