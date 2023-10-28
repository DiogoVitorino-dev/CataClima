import {
  getCurrentPositionAsync,
  requestForegroundPermissionsAsync,
} from "expo-location";

import { ICoordinates } from "../models/WeatherModel";

import { EFlags } from "@/constants/EnumApp";

// Permissions
const requestPermissions = async () => {
  const result = await requestForegroundPermissionsAsync();
  return result.status === "granted";
};

const getMyLocation = async (): Promise<ICoordinates> => {
  if (await requestPermissions()) {
    const { coords } = await getCurrentPositionAsync();
    return coords;
  }
  throw new Error(EFlags.LOCATION_PERMISSION_DENIED);
};

export const LocationService = {
  getMyLocation,
};
