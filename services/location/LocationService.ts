import * as Location from 'expo-location';
import {Platform} from 'react-native';
import Flags from '../../constants/Flags';

// Permissions
const requestPermissions = async () => {
  return (await Location.requestForegroundPermissionsAsync()).status === 'granted';
};

export default function LocationService() {
  const getMyLocation = async () => {
    if (Platform.OS !== 'web') {
      const permission = await requestPermissions();
      
      if (!permission) throw Flags.ErrorFlags.LOCATIONPERMISSIONDENIED
    }

    return (await Location.getCurrentPositionAsync()).coords;
  };

  return {getMyLocation};
}
