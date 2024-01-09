import {
  getCurrentPositionAsync,
  requestForegroundPermissionsAsync,
} from "expo-location";
import { Platform } from "react-native";

import { ICoordinates } from "../models/WeatherModel";

import { EFlags } from "@/constants/EnumApp";

// Permissions
const requestPermissions = async () => {
  const result = await requestForegroundPermissionsAsync();
  return result.status === "granted";
};

const getMyLocation = async (): Promise<ICoordinates> => {
  if (Platform.OS === "web") {
    try {
      const { coords } = await getCurrentPositionAsync();

      if (coords) {
        return coords;
      }
    } catch (error: any) {
      switch (error.code) {
        case 1:
          throw new Error(EFlags.LOCATION_PERMISSION_DENIED);
      }
    }
  }

  if (await requestPermissions()) {
    const { coords } = await getCurrentPositionAsync();
    return coords;
  }
  throw new Error(EFlags.LOCATION_PERMISSION_DENIED);
};

export const LocationService = {
  getMyLocation,
};
