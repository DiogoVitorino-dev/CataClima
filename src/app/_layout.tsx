import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect } from "react";
import { Platform, useColorScheme } from "react-native";
import { Provider } from "react-redux";

import { Loading } from "../components/shared";
import { WeatherBackgroundFetchTask } from "../services/weather";
import store from "../store/store";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
	initialRouteName: "index",
};

//Background Fetch
//WeatherBackgroundFetchTask().exec();

if (Platform.OS !== "web") SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [loadedFont, errorFont] = useFonts({
		OpenSans: require("../assets/fonts/OpenSans-Regular.ttf"),
		...FontAwesome.font,
	});

	useCallback(() => {
		if (Platform.OS !== "web" && loadedFont) SplashScreen.hideAsync();
	}, [loadedFont]);

	useEffect(() => {
		if (errorFont) throw errorFont;
	}, [errorFont]);

	if (!loadedFont)
		if (Platform.OS === "web") return <Loading />;
		else return null;

	return (
		<Provider store={store}>
			<RootLayoutNav />
		</Provider>
	);
}

function RootLayoutNav() {
	const colorScheme = useColorScheme();

	return (
		<>
			<ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
				<Stack initialRouteName={unstable_settings.initialRouteName}>
					<Stack.Screen
						name="index"
						options={{
							title: "CataClima",
							headerTitleAlign: "center",
							headerTintColor: "#fff",
							headerTransparent: true,
							headerBlurEffect: "regular",
						}}
					/>
					<Stack.Screen
						name="managerCities"
						options={{
							title: "Manager Cities",
							headerTitle: "",
						}}
					/>
				</Stack>
			</ThemeProvider>
		</>
	);
}
