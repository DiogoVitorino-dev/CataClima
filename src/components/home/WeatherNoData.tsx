import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import WeatherText from "./WeatherText";
import Button from "../shared/Button";
import NoConnection from "../shared/NoConnection";

import Colors from "@/constants/Colors";
import { EFlags } from "@/constants/EnumApp";
import Strings from "@/constants/Strings";
import { useAppDispatch } from "@/hooks/ReduxHooks";
import { LocationService } from "@/services/LocationService";
import { WeatherThunks } from "@/store/weather/WeatherThunks";

export default function WeatherNoData() {
  const color = Colors["home"];
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleUseMyLocation = async () => {
    try {
      const coords = await LocationService.getMyLocation();
      dispatch(WeatherThunks.weatherAdded(coords));
    } catch (error: any) {
      switch (error.message) {
        case EFlags.LOCATION_PERMISSION_DENIED:
          router.push("/permissionModal");
          break;
      }
    }
  };

  const handleAlternativeOption = () => {
    router.push("/managerCities");
  };

  return (
    <View style={styles.centeredView}>
      <WeatherText style={styles.title}>
        {Strings.options.iterativeText}
      </WeatherText>
      <WeatherText style={styles.subtitle} color={color.subtitle}>
        {Strings.options.optionText}
      </WeatherText>
      <Button
        label={Strings.options.useMyLocation}
        onPress={handleUseMyLocation}
        textStyle={{ color: color.darkText }}
        style={{ backgroundColor: color.backdrop, marginTop: 30 }}
      />
      <Button
        label={Strings.options.alternativeOption}
        onPress={handleAlternativeOption}
        textStyle={{ color: color.darkText }}
        style={{ backgroundColor: color.backdrop, marginTop: 30 }}
      />
      <NoConnection />
    </View>
  );
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

  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 16,
    textAlign: "center",
  },
});
