import * as Location from 'expo-location';
import {Platform} from 'react-native';
import { CoordinatesProps, Flags } from '../constants';

// Permissions
const requestPermissions = async () => {
	return (await Location.requestForegroundPermissionsAsync()).status === 'granted';
};

export function LocationLib() {
	const getMyLocation = async () => {
		if (Platform.OS !== 'web') {
			const permission = await requestPermissions();
      
			if (!permission) throw Flags.errors.LOCATIONPERMISSIONDENIED;
		}

		const coords:CoordinatesProps = (await Location.getCurrentPositionAsync()).coords;

		return coords;
	};

	return {getMyLocation};
}
