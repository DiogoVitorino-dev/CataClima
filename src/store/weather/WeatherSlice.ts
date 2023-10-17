import {
	SerializedError,
	createEntityAdapter,
	createSlice,
	isFulfilled,
	isPending,
	isRejected,
} from "@reduxjs/toolkit";

import {
	addWeather,
	updateWeather,
	getCurrentWeatherIDFromDB,
	retrieveWeathersFromDB,
	setCurrentWeatherID,
	weatherRemoved,
} from "./WeatherThunks";
import IWeather from "../../models/WeatherModel";
import { RootState } from "../store";

export interface WeatherStateProps {
	currentWeatherID: string;
	statusRequest: "idle" | "pending" | "success" | "failed";
	error: null | SerializedError;
}

const weatherAdapter = createEntityAdapter<IWeather>({
	sortComparer: (a, b) => {
		if (a.location.city > b.location.city) return 1;
		if (a.location.city < b.location.city) return -1;
		return 0;
	},
});

const initialState = weatherAdapter.getInitialState({
	currentWeatherID: "",
	statusRequest: "idle",
	error: null,
} as WeatherStateProps);

const genericIsPending = isPending(
	addWeather,
	updateWeather,
	weatherRemoved,
	retrieveWeathersFromDB,
	setCurrentWeatherID,
	getCurrentWeatherIDFromDB,
);

const genericIsFulfilled = isFulfilled(
	addWeather,
	updateWeather,
	weatherRemoved,
	retrieveWeathersFromDB,
	setCurrentWeatherID,
	getCurrentWeatherIDFromDB,
);

const genericIsRejected = isRejected(
	addWeather,
	updateWeather,
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
			.addCase(updateWeather.fulfilled, (state, action) => {
				weatherAdapter.upsertOne(state, action.payload);
			})

			.addCase(addWeather.fulfilled, (state, action) => {
				weatherAdapter.upsertOne(state, action.payload);
				console.log(action.payload);

				state.currentWeatherID = action.payload.id;
			})

			.addCase(weatherRemoved.fulfilled, (state, action) => {
				weatherAdapter.removeOne(state, action.payload);
			})

			.addCase(retrieveWeathersFromDB.fulfilled, (state, action) => {
				weatherAdapter.setAll(state, action.payload);
			})

			.addCase(getCurrentWeatherIDFromDB.fulfilled, (state, action) => {
				if (action.payload) state.currentWeatherID = action.payload.id;
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
