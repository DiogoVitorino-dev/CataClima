import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { WeatherContext, WeatherContextProps } from '../context/WeatherContext';
import { Weather, WeatherProps } from '../models/Weather';
import UserWeathersDatabase from '../database/UserWeathersDatabase';

export {  
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {  
  initialRouteName: 'index',
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    OpenSans: require('../assets/fonts/OpenSans-Regular.ttf'),
    ...FontAwesome.font,
  });
  const [currentWeather,setCurrentWeather] = useState(new Weather({})) 

  const handleNewWeather = async (newWeather:WeatherProps) => {
  setCurrentWeather(new Weather(newWeather))}
  
  const handleDeleteWeather = async (locationName:string) => {
    await UserWeathersDatabase().deleteWeatherInDB(locationName).then(async () => {      
      setCurrentWeather(await UserWeathersDatabase().getCurrent())
    })
  }

  const weatherState = useMemo(() => ({
    WeatherData: currentWeather,
    setWeather: handleNewWeather,
    getAllWeathersNames: UserWeathersDatabase().getAllWeathersNames,
    deleteWeatherInDB: handleDeleteWeather    
  } as WeatherContextProps),[currentWeather])

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  return (
    <>
      {!loaded && <SplashScreen />}
      {loaded && (
        <WeatherContext.Provider value={weatherState}>
          <RootLayoutNav />
        </WeatherContext.Provider>
      ) }
    </>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>        
          <Stack>
            <Stack.Screen
              name="index"
              options={{
                title: 'CataClima',
                headerTitleAlign: 'center',
                headerTintColor: '#fff',
                headerTransparent: true,
                headerBlurEffect:'regular'                           
              }}
            />
            <Stack.Screen name="managerCities" options={{
              title:'Manager Cities',
              headerTitle: '', 
              presentation: 'modal'}} />
          </Stack>        
      </ThemeProvider>
    </>
  );
}
