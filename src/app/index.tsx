import { ICity } from "country-state-city";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import {
	StyleSheet,
	ScrollView,
	useColorScheme,
	RefreshControl,
} from "react-native";

import {
	AnimatedBackground,
	WeatherDetail,
	WeatherItem,
	WeatherNoData,
	WeatherStatus,
} from "../components/home";
import {
	HeaderButton,
	Loading,
	PermissionModal,
	SimpleModal,
	TimeAgo,
	View,
} from "../components/shared";
import { Colors, CoordinatesProps, CustomTheme, Flags } from "../constants";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
	selectWeatherById,
	selectWeatherRequestError,
	selectWeatherRequestStatus,
} from "../store/weather/WeatherSelectors";
import { resetError, resetStatus } from "../store/weather/WeatherSlice";
import {
	addWeather,
	retrieveWeathersFromDB,
	getCurrentWeatherIDFromDB,
	updateWeather,
} from "../store/weather/WeatherThunks";
import { DatetimeUtils } from "../utils";
import { getMyLocation } from "../services/location";

export default function Home() {
	const colorScheme = useColorScheme();
	const router = useRouter();
	const navigation = useNavigation();

	const { weatherSelectedID, searchedCity } = useLocalSearchParams();

	const dispatch = useAppDispatch();
	const weather = useAppSelector((state) =>
		selectWeatherById(state, state.weathers.currentWeatherID),
	);

	const weatherRequestStatus = useAppSelector(selectWeatherRequestStatus);
	const weatherRequestError = useAppSelector(selectWeatherRequestError);

	const [isLoading, setLoadingState] = useState(false);

	const [permissionModalVisible, setPermissionModalVisible] = useState(false);
	const [NoConnectionModalVisible, setNoConnectionModalVisible] =
		useState(false);

	const [backgroundGradient, setBackgroundGradient] = useState([
		Colors[colorScheme ?? "light"].background,
		Colors[colorScheme ?? "light"].background,
	]);

	// Hooks
	useEffect(() => {
		if (!weather && weatherRequestStatus === "idle")
			checkDatabase().then((saved) => {
				saved || getMyLocationWeather();
			});
	}, []);

	useEffect(() => {
		if (weather) {
			setBackgroundGradient(handleBackgroundGradient());

			navigation.setOptions({
				headerTitle: weather.location.city,

				headerLeft: () =>
					HeaderButton({
						href: "/managerCities",
						icon: "add",
						iconColor: "#fff",
						iconSize: 30,
						style: { marginLeft: 10 },
					}),

				headerRight: () =>
					HeaderButton({
						onPress: handleUpdateWeather,
						icon: "refresh",
						iconColor: "#fff",
						iconSize: 30,
						style: { marginRight: 10 },
					}),
			});
		}
	}, [weather]);

	useEffect(() => {
		switch (weatherRequestStatus) {
			case "pending":
				setLoadingState(true);
				break;

			case "failed":
			case "success": {
				setLoadingState(false);
				break;
			}
		}
	}, [weatherRequestStatus]);

	useEffect(() => {
		if (weatherRequestError) {
			switch (weatherRequestError) {
				case Flags.errors.NOCONNECTION:
					setNoConnectionModalVisible(true);
					break;

				default:
					console.error(weatherRequestError.message);
			}
			dispatch(resetError);
		}
	}, [weatherRequestError]);

	/*useEffect(() => {
		if (weatherSelectedID && typeof weatherSelectedID === "string")
			dispatch(setCurrentWeatherID(weatherSelectedID));
		else if (searchedCity && typeof searchedCity === "string") {
			const { latitude, longitude } = JSON.parse(searchedCity.trim()) as ICity;

			if (latitude && longitude) dispatch(addWeather({ latitude, longitude }));
		}
	}, [weatherSelectedID, searchedCity]);*/

	// check

	const checkDatabase = async () => {
		const saved = await dispatch(retrieveWeathersFromDB()).unwrap();
		if (saved.length > 0) {
			await dispatch(getCurrentWeatherIDFromDB()).unwrap();
			return true;
		}

		return false;
	};

	// Query weather
	const getMyLocationCoords = async () => {
		try {
			return (await getMyLocation());
		} catch (error: any) {
			if (
				error.message === Flags.errors.LOCATION_PERMISSION_DENIED ||
				error.code === 1
			)
				setPermissionModalVisible(true);
		}
	};

	const getMyLocationWeather = async () => {
		try {
			const coords = await getMyLocationCoords();

			if (coords) {
				await dispatch(addWeather(coords)).unwrap();
			}
		} catch (error: any) {
			if (error.message === Flags.errors.NOCONNECTION)
				setNoConnectionModalVisible(true);
		} finally {
			dispatch(resetStatus);
		}
	};

	const handleUpdateWeather = async () => {
		try {
			if (weather) await dispatch(updateWeather(weather)).unwrap();
		} finally {
			dispatch(resetStatus);
		}
	};

	// Theme control
	const handleBackgroundGradient = () => {
		if (weather)
			switch (weather.data.current) {
				case Flags.WeatherApiState.SUNNY: {
					if (DatetimeUtils().isNight(weather.data.timeStamp.toString()))
						return CustomTheme.gradient.night;
					else return CustomTheme.gradient.sunny;
				}
				case Flags.WeatherApiState.CLOUDY:
					return CustomTheme.gradient.cloudy;
				case Flags.WeatherApiState.SNOW:
				case Flags.WeatherApiState.RAINY:
					return CustomTheme.gradient.rainy;
			}

		return [
			Colors[colorScheme ?? "light"].background,
			Colors[colorScheme ?? "light"].background,
		];
	};

	const handleIcon = () => {
		return "sunny";
	};

	// Navigation
	const gotoManagerCities = () => router.push({ pathname: "/managerCities" });

	// Modals
	const ClosePermissionModal = () => setPermissionModalVisible(false);

	const CloseNoConnectionModal = () => setNoConnectionModalVisible(false);

	const PermissionModalJSX = useCallback(
		() => (
			<PermissionModal
				visible={permissionModalVisible}
				onPressFirstButton={getMyLocationWeather}
				onPressSecondButton={gotoManagerCities}
				onDismiss={ClosePermissionModal}
			/>
		),
		[permissionModalVisible],
	);

	const NoConnectionModalJSX = useCallback(
		() => (
			<SimpleModal
				message="Sem conexão com a internet !"
				visible={NoConnectionModalVisible}
				onDismiss={CloseNoConnectionModal}
			/>
		),
		[NoConnectionModalVisible],
	);

	// Viewers
	if (weather || isLoading) {
		return (
			<LinearGradient
				colors={backgroundGradient}
				start={{ x: 0, y: 0 }}
				end={{ x: 0.5, y: 1 }}
				style={{ flex: 1 }}
			>
				<ScrollView
					contentContainerStyle={{ flex: 1 }}
					refreshControl={
						<RefreshControl
							progressViewOffset={50}
							refreshing={isLoading}
							onRefresh={() => handleUpdateWeather()}
						/>
					}
				>
					{!isLoading && weather ? (
						<View
							style={[
								styles.container,
								{ flex: 1, backgroundColor: "transparent" },
							]}
						>
							<TimeAgo dateIsoFormat={weather.data.timeStamp.toString()} />

							<WeatherStatus
								iconName={handleIcon()}
								temp={weather.temperature.value + "°"}
								tempMax={weather.temperature.max + "°"}
								tempMin={weather.temperature.min + "°"}
								weatherDescription={weather.data.description}
							/>

							<WeatherDetail
								dayOfWeek={DatetimeUtils().getDayOfWeek(new Date().toString())}
							>
								<WeatherItem
									iconName="sun-thermometer-outline"
									iconSize={30}
									label="Sensação"
									value={`${weather.temperature.feelsLike}°${weather.temperature.unit}`}
								/>
								<WeatherItem
									iconName="water-percent"
									iconSize={30}
									label="Umidade"
									value={`${weather.humidity.value} ${weather.humidity.unit}`}
								/>
								<WeatherItem
									iconName="weather-windy"
									iconSize={30}
									label="Vento"
									value={`${weather.wind.value} ${weather.wind.unit}`}
								/>
								<WeatherItem
									iconName="thermostat-box"
									iconSize={30}
									label="Pressão"
									value={`${weather.pressure.value} ${weather.pressure.unit}`}
								/>
							</WeatherDetail>
							<AnimatedBackground />
						</View>
					) : (
						<Loading />
					)}

					{PermissionModalJSX()}
					{NoConnectionModalJSX()}
				</ScrollView>
				<StatusBar style="light" />
			</LinearGradient>
		);
	} else {
		return (
			<WeatherNoData
				onPressMyLocationWeather={getMyLocationWeather}
				onPressNavigate={gotoManagerCities}
			>
				{PermissionModalJSX()}
				{NoConnectionModalJSX()}
				<StatusBar style="auto" />
			</WeatherNoData>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "space-between",
		flexDirection: "column",
		paddingTop: 80,
	},

	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},

	noDataText: {
		fontSize: 18,
		textAlign: "center",
	},
});
