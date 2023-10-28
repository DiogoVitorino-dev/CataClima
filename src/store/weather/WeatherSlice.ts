import {
  SerializedError,
  createEntityAdapter,
  createSlice,
  isFulfilled,
  isPending,
  isRejected,
} from "@reduxjs/toolkit";

import { WeatherThunks } from "./WeatherThunks";
import { RootState } from "../store";

import IWeather from "@/models/WeatherModel";

export interface IStateWeathers {
  idPreference?: string;
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

const initialState = weatherAdapter.getInitialState<IStateWeathers>({
  statusRequest: "idle",
  error: null,
});

const {
  getWeatherPreference,
  getWeathers,
  setWeatherPreference,
  weatherAdded,
  weatherRemoved,
  weatherUpdated,
} = WeatherThunks;

const genericIsPending = isPending(
  weatherAdded,
  weatherUpdated,
  weatherRemoved,
  getWeathers,
  getWeatherPreference,
  setWeatherPreference,
);

const genericIsFulfilled = isFulfilled(
  weatherAdded,
  weatherUpdated,
  weatherRemoved,
  getWeathers,
  getWeatherPreference,
  setWeatherPreference,
);

const genericIsRejected = isRejected(
  weatherAdded,
  weatherUpdated,
  weatherRemoved,
  getWeathers,
  getWeatherPreference,
  setWeatherPreference,
);

const setIdPreference = isFulfilled(getWeatherPreference, setWeatherPreference);

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
      .addCase(weatherUpdated.fulfilled, (state, action) => {
        weatherAdapter.upsertOne(state, action.payload);
      })

      .addCase(weatherAdded.fulfilled, (state, action) => {
        weatherAdapter.upsertOne(state, action.payload);

        state.idPreference = action.payload.id;
      })

      .addCase(weatherRemoved.fulfilled, (state, action) => {
        weatherAdapter.removeOne(state, action.payload);
      })

      .addCase(getWeathers.fulfilled, (state, action) => {
        weatherAdapter.setAll(state, action.payload);
      })

      .addMatcher(setIdPreference, (state, action) => {
        if (action.payload) state.idPreference = action.payload;
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
