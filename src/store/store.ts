import { configureStore } from '@reduxjs/toolkit';
import WeatherSlice from './weather/WeatherSlice';

const store = configureStore({
	reducer: {
		weathers: WeatherSlice
	}
});

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export default store;
