import {     
	SerializedError, 
	createAsyncThunk, 
	createEntityAdapter, 
	createSlice, 
	nanoid
} from '@reduxjs/toolkit';
import { RootState } from '../store';
import UserWeathersDatabase from '../../database/UserWeathersDatabase';
import { CoordinatesProps, WeatherProps } from '../../constants';
import { WeatherService } from '../../services/weather';

export interface WeatherStateProps {
    currentWeatherID:string     
    statusRequest: 'idle'|'pending'|'success'|'failed',
    error: null | SerializedError 
}

const weatherAdapter =  createEntityAdapter<WeatherProps>();

const initialState = weatherAdapter.getInitialState({
	currentWeatherID:'',    
	statusRequest:'idle',
	error:null     
} as WeatherStateProps);

export const fetchAndUpdateWeather = createAsyncThunk(
	'weathers/fetchAndUpdateWeather',
	async (state:WeatherProps) => {
		const result = await WeatherService().getWeatherData(state.coords);        
		result.id = state.id;
		await UserWeathersDatabase().updateWeatherDB(result);
		return result;
	}
);

export const fetchWeather = createAsyncThunk(
	'weathers/fetchWeather',
	async (coords:CoordinatesProps) => WeatherService().getWeatherData(coords)
);

export const retrieveWeathersFromDB = createAsyncThunk(
	'weathers/retrieveWeathersFromDB',
	async () => await UserWeathersDatabase().getAllWeathersDB()
);

export const getCurrentWeatherIDFromDB = createAsyncThunk(
	'weathers/getCurrentWeatherIDFromDB',
	async () => await UserWeathersDatabase().getCurrentWeatherID()    
);

export const setCurrentWeatherID = createAsyncThunk(
	'weathers/setCurrentWeatherID',
	async (newCurrentWeatherID:string) => 
		await UserWeathersDatabase().setCurrentWeatherID(newCurrentWeatherID)    
);

export const weatherAdded = createAsyncThunk(
	'weathers/weatherAdded',
	async (weather:WeatherProps) => {
		weather.id = nanoid();
		await UserWeathersDatabase().addWeatherDB(weather);
		await UserWeathersDatabase().setCurrentWeatherID(weather.id);
		return weather;
	}
);

export const weatherRemoved = createAsyncThunk(
	'weathers/weatherRemoved',
	async (weatherID:string,{dispatch}) => {
		await UserWeathersDatabase().deleteWeatherDB(weatherID);
		await dispatch(getCurrentWeatherIDFromDB()).unwrap();
		return weatherID;
	}   
);

const weathersSlice = createSlice({
	name:'weathers',
	initialState:initialState,
	reducers: {        
		resetStatus: state => {
			state.statusRequest = 'idle';            
		},
        
		resetError: state => {
			state.error = null;           
		}
	},
	extraReducers(builder) {
		builder                
			.addCase(fetchAndUpdateWeather.pending, state => {            
				state.statusRequest = 'pending';
			})

			.addCase(fetchAndUpdateWeather.fulfilled, (state, action) => {
				weatherAdapter.upsertOne(state,action.payload);           
				state.statusRequest = 'success';
			}) 
        
			.addCase(fetchAndUpdateWeather.rejected, (state, action) => {
				state.statusRequest = 'failed';
				state.error = action.error;
			})
        
			.addCase(fetchWeather.pending, state => {            
				state.statusRequest = 'pending';
			})
        
			.addCase(fetchWeather.fulfilled, state => {            
				state.statusRequest = 'success';
			})
        
			.addCase(fetchWeather.rejected, (state, action) => {
				state.statusRequest = 'failed';
				state.error = action.error;
			})
        
			.addCase(weatherAdded.fulfilled, (state, action) => {           
				weatherAdapter.upsertOne(state,action.payload);
				state.currentWeatherID = action.payload.id; 
			})
        
			.addCase(weatherRemoved.fulfilled, (state, action) => {
				weatherAdapter.removeOne(state,action.payload);
			})

			.addCase(retrieveWeathersFromDB.fulfilled, (state, action) => {
				weatherAdapter.setAll(state,action.payload);
			})
        
			.addCase(getCurrentWeatherIDFromDB.fulfilled, (state, action) => {                
				state.currentWeatherID = action.payload;           
			})       
        
			.addCase(setCurrentWeatherID.fulfilled, (state, action) => {
				state.currentWeatherID = action.payload;           
			});
	}
});

export const {resetStatus,resetError} = weathersSlice.actions;

export const {
	selectAll:selectAllWeathers,
	selectById:selectWeatherById,
} = weatherAdapter.getSelectors<RootState>(state => state.weathers);

export const selectWeatherRequestStatus = (state:RootState) => state.weathers.statusRequest;
export const selectWeatherRequestError = (state:RootState) => state.weathers.error;

export default weathersSlice.reducer;