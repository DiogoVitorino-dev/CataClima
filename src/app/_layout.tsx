import { useCallback, useEffect, useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Stack } from 'expo-router';
import { Platform, useColorScheme } from 'react-native';
import { Provider } from 'react-redux';
import store from '../store/store';
import { getCurrentWeatherIDFromDB, retrieveWeathersFromDB } from '../store/weather/WeatherSlice';
import { WeatherBackgroundFetchTask } from '../services/weather';
import { Loading } from '../components/shared';

export {  
	ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {  
	initialRouteName: 'index',
};

//Background Fetch
WeatherBackgroundFetchTask().exec();

if (Platform.OS !== 'web')
	SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [loaded,setLoaded] = useState(false);
	const [loadedFont, errorFont] = useFonts({
		OpenSans: require('../assets/fonts/OpenSans-Regular.ttf'),
		...FontAwesome.font,
	});

	useEffect(() => { 
		(async function(){
			const saved = await store.dispatch(retrieveWeathersFromDB()).unwrap();
      
			if(saved.length > 0)
				await store.dispatch(getCurrentWeatherIDFromDB()).unwrap();
		})()   
			.finally(() => {
				if (Platform.OS === 'web')
					setTimeout(()=>setLoaded(true),500);
				else
					setLoaded(true);
			});
	},[]);

	useCallback(() => {
		if (Platform.OS !== 'web' && loaded && loadedFont) SplashScreen.hideAsync();
	} , [loaded,loadedFont] );
    

	useEffect(() => {
		if (errorFont) throw errorFont;
	}, [errorFont]);
  
	if (!loadedFont || !loaded) 
		if (Platform.OS === 'web')return <Loading />;
		else return null;

	return (
		<Provider store={store} >        
			<RootLayoutNav />
		</Provider>
	);    
  
}

function RootLayoutNav() {
	const colorScheme = useColorScheme();

	return (
		<>
			<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>        
				<Stack initialRouteName={unstable_settings.initialRouteName}>
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
						headerTitle: ''}} />
				</Stack>        
			</ThemeProvider>
		</>
	);
}
