import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, ScrollView, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import HomeBackground from "@/components/home/HomeBackground";
import TimeAgo from "@/components/home/TimeAgo";
import WeatherDetail from "@/components/home/WeatherDetail";
import WeatherNoData from "@/components/home/WeatherNoData";
import WeatherStatus from "@/components/home/WeatherStatus";
import HeaderButton from "@/components/shared/HeaderButton";
import { Loading } from "@/components/shared/Loading";
import NoConnection from "@/components/shared/NoConnection";
import { View } from "@/components/shared/Themed";
import Colors from "@/constants/Colors";
import { useAppDispatch, useAppSelector } from "@/hooks/ReduxHooks";
import { ICoordinates } from "@/models/WeatherModel";
import { WeathersSelectors } from "@/store/weather/WeatherSelectors";
import { WeatherThunks } from "@/store/weather/WeatherThunks";

export interface ICoordsParams {
  lat: string;
  lon: string;
  [key: string]: string;
}

export type THomeSearchParams = {
  id?: string;
} & ICoordsParams;

export default function Home() {
  const navigation = useNavigation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const color = Colors["home"];

  const [loading, setLoading] = useState(false);

  const { id, lat, lon } = useLocalSearchParams<THomeSearchParams>();

  const weather = useAppSelector((state) =>
    WeathersSelectors.selectPreference(state),
  );

  const allWeather = useAppSelector(WeathersSelectors.selectAll);

  const status = useAppSelector(WeathersSelectors.selectStatus);

  useEffect(() => {
    updateHeaderTitle();
    addHeaderButtons();
  }, [weather, navigation]);

  useEffect(() => {
    switch (status) {
      case "pending":
        setLoading(true);
        break;

      default:
        setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    if (id) {
      dispatch(WeatherThunks.setWeatherPreference(id));
    } else if (lat && lon) {
      const coords: ICoordinates = {
        latitude: Number(lat),
        longitude: Number(lon),
      };
      const isFound = isAlreadySaved(coords);

      if (!isFound) {
        handleAddWeather(coords);
      } else {
        dispatch(WeatherThunks.setWeatherPreference(isFound.id));
      }
    }
  }, [lat, lon, id]);

  const isAlreadySaved = (coords: ICoordinates) => {
    return allWeather.find(
      (value) =>
        value.coords.latitude === coords.latitude &&
        value.coords.longitude === coords.longitude,
    );
  };

  const updateHeaderTitle = () => {
    navigation.setOptions({
      headerTitle: weather?.location.city || "",
      headerTitleStyle: { color: color.text },
    });
  };

  const addHeaderButtons = () => {
    navigation.setOptions({
      headerLeft: () =>
        HeaderButton({
          icon: "plus",
          color: color.icon,
          onPress: navigate.toManagerCities,
          style: styles.headerButton,
        }),

      headerRight: () =>
        HeaderButton({
          icon: "refresh",
          color: color.icon,
          onPress: handleUpdateWeather,
          style: styles.headerButton,
        }),
    });
  };

  const navigate = {
    toManagerCities: () => {
      router.push("/managerCities");
    },
    toPermissionModal: () => {
      router.push("/permissionModal");
    },
  };

  const handleAddWeather = (coords: ICoordinates) => {
    dispatch(WeatherThunks.weatherAdded(coords));
  };

  const handleUpdateWeather = () => {
    if (weather) dispatch(WeatherThunks.weatherUpdated(weather));
  };

  return (
    <HomeBackground>
      <SafeAreaView style={{ flex: 1 }} mode="padding">
        <StatusBar translucent style="light" />
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          refreshControl={
            <RefreshControl
              progressViewOffset={50}
              refreshing={loading}
              onRefresh={handleUpdateWeather}
            />
          }
        >
          {loading ? (
            <Loading />
          ) : weather ? (
            <>
              <View style={[styles.container, styles.detail]}>
                <TimeAgo date={weather.data.timestamp} />

                <WeatherStatus />
                <WeatherDetail />
              </View>
              <NoConnection />
            </>
          ) : (
            <>
              <WeatherNoData />
              <StatusBar translucent style="light" />
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </HomeBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "column",
    marginTop: 80,
  },

  detail: { flex: 1, backgroundColor: "transparent" },

  headerButton: { marginHorizontal: 10 },

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
