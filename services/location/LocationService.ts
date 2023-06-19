import * as Location from 'expo-location';
import { Platform } from 'react-native';

// Permissions
const requestPermissions = async () => {  
    return (await Location.requestForegroundPermissionsAsync()).status === 'granted'
};

export default function LocationService() {
    const getMyLocation = async () => {
        if(Platform.OS !== 'web'){
            const permission = await requestPermissions()
            
            if (!permission) throw new Error('user/permission-denied')
        }

        return (await Location.getCurrentPositionAsync()).coords
    }

    return {getMyLocation}
}