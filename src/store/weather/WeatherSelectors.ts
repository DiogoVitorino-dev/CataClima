import { entitySelectors } from "./WeatherSlice";
import { RootState } from "../store";

const selectStatus = (state: RootState) => state.weathers.statusRequest;

const selectError = (state: RootState) => state.weathers.error;

const { selectAll, selectById } = entitySelectors;

const selectPreference = (state: RootState) => {
  const { idPreference } = state.weathers;
  if (idPreference) {
    return selectById(state, idPreference);
  }
};

export const WeathersSelectors = {
  selectStatus,
  selectError,
  selectAll,
  selectPreference,
};
