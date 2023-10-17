import * as Location from "expo-location";
import { Platform } from "react-native";

import { CoordinatesProps, Flags } from "../../constants";
import { ICoordinates } from "../../models/WeatherModel";

// Permissions
const requestPermissions = async () => {
	return (
		(await Location.requestForegroundPermissionsAsync()).status === "granted"
	);
};

export const getMyLocation = async () => {
	if (Platform.OS !== "web") {
		const permission = await requestPermissions();

		if (!permission) throw Flags.errors.LOCATION_PERMISSION_DENIED;
	}

	const coords: ICoordinates = (await Location.getCurrentPositionAsync())
		.coords;

	return coords;
};
