import * as Location from 'expo-location';
import {Platform} from 'react-native';
import Flags from '../../constants/Flags';
import { CoordinatesProps } from '../../constants/Interfaces';

// Permissions
const requestPermissions = async () => {
  return (await Location.requestForegroundPermissionsAsync()).status === 'granted';
};

export default function LocationService() {
  const getMyLocation = async () => {
    if (Platform.OS !== 'web') {
      const permission = await requestPermissions();
      
      if (!permission) throw Flags.errors.LOCATIONPERMISSIONDENIED
    }

    const coords:CoordinatesProps = (await Location.getCurrentPositionAsync()).coords

    return coords
  };

  return {getMyLocation};
}
