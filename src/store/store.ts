import { ThunkAction, configureStore } from "@reduxjs/toolkit";
import { UnknownAsyncThunkAction } from "@reduxjs/toolkit/dist/matchers";

import WeatherSlice from "./weather/WeatherSlice";

const store = configureStore({
	reducer: {
		weathers: WeatherSlice,
	},
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
	Promise<ReturnType>,
	RootState,
	unknown,
	UnknownAsyncThunkAction
>;

export default store;
