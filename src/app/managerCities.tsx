import { ICity } from "country-state-city";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

import { ICoordsParams } from ".";

import SearchList from "@/components/managerCities/SearchList";
import UserList from "@/components/managerCities/UserList";
import { CircularLoading } from "@/components/shared/CircularLoading";
import SearchBar from "@/components/shared/SearchBar";
import { View } from "@/components/shared/Themed";
import Strings from "@/constants/Strings";
import { useAppDispatch, useAppSelector } from "@/hooks/ReduxHooks";
import IWeather from "@/models/WeatherModel";
import { CitiesService } from "@/services/CitiesService";
import { WeathersSelectors } from "@/store/weather/WeatherSelectors";
import { WeatherThunks } from "@/store/weather/WeatherThunks";
import { StatusBar } from "expo-status-bar";

export default function ManagerCities() {
  const [searchText, setSearchText] = useState("");
  const [searchResult, setSearchResult] = useState(Array<ICity>);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const allWeathers = useAppSelector(WeathersSelectors.selectAll);

  const searchTextChanged = (newText: string) => setSearchText(newText);

  useEffect(() => {
    search();
  }, [searchText]);

  const search = async () => {
    if (searchText) {
      const result = await CitiesService.searchCitiesByName(searchText);

      setSearchResult(result);
    } else setSearchResult([]);
  };

  const handleSelectedUserCity = (value: IWeather) => {
    router.push({ pathname: "/", params: { id: value.id } });
  };

  const handleSelectedSearchCity = (value: ICity) => {
    const { latitude, longitude } = value;
    const coords: ICoordsParams = {
      lat: latitude!,
      lon: longitude!,
    };
    router.push({ pathname: "/", params: { ...coords } });
  };

  const handleRemovedCity = async (value: IWeather) => {
    setLoading(true);
    await dispatch(WeatherThunks.weatherRemoved(value.id)).unwrap();
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent style="auto" />
      <SearchBar
        placeholder={Strings.placeholders.searchCities}
        onChangeText={searchTextChanged}
      />
      <CircularLoading visible={loading} />
      {!searchText && allWeathers.length > 0 ? (
        <UserList
          data={allWeathers}
          onSelectedCity={handleSelectedUserCity}
          onRemovedCity={handleRemovedCity}
        />
      ) : (
        <SearchList
          data={searchResult}
          onSelectedCity={handleSelectedSearchCity}
        />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    paddingHorizontal: 18,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
  },
});
