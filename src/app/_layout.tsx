import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { Provider } from "react-redux";

import Strings from "@/constants/Strings";
import { useAppDispatch } from "@/hooks/ReduxHooks";
import store from "@/store/store";
import { WeatherThunks } from "@/store/weather/WeatherThunks";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "index",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    OpenSans: require("../assets/fonts/OpenSans-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <RootLayoutNav />
    </Provider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const dispatch = useAppDispatch();

  useEffect(() => {
    loadFromDatabase();
  }, []);

  const loadFromDatabase = async () => {
    await dispatch(WeatherThunks.getWeatherPreference()).unwrap();
    await dispatch(WeatherThunks.getWeathers()).unwrap();
  };

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerTitleStyle: { fontFamily: "OpenSans" },
            title: "",
            headerTitleAlign: "center",
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="managerCities"
          options={{
            headerTitleStyle: { fontFamily: "OpenSans", fontWeight: "bold" },
            headerTitleAlign: "center",
            title: Strings.headers.managerCities,
          }}
        />
        <Stack.Screen
          name="permissionModal"
          options={{ presentation: "fullScreenModal", headerShown: false }}
        />
      </Stack>
    </ThemeProvider>
  );
}
