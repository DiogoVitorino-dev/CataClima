import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Platform } from "react-native";

import { ICoordsParams } from ".";

import Button from "@/components/shared/Button";
import IconButton from "@/components/shared/IconButton";
import { Text, View } from "@/components/shared/Themed";
import Strings from "@/constants/Strings";
import { ICoordinates } from "@/models/WeatherModel";
import { LocationService } from "@/services/LocationService";

const AdviceWeb = () => (
  <Text style={[styles.modalText, { fontSize: 16, opacity: 0.8 }]}>
    {Strings.permission.adviceWeb}
  </Text>
);

export default function PermissionModal() {
  const router = useRouter();

  const handleUseMyLocation = async () => {
    const { latitude, longitude } = await LocationService.getMyLocation();

    goHome({
      lat: latitude.toString(),
      lon: longitude.toString(),
    });
  };

  const goHome = (coords?: ICoordsParams) => {
    router.push({
      pathname: "/",
      params: { ...coords },
    });
  };

  const handleAlternativeOption = () => router.replace("/managerCities");

  return (
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <Text style={styles.modalText}>
          {Strings.permission.whyLocationPermissionRequested}
        </Text>
        {Platform.OS === "web" ? AdviceWeb() : null}
        <Button
          style={styles.button}
          label={Strings.options.useMyLocation}
          onPress={handleUseMyLocation}
        />
        <Button
          style={styles.button}
          label={Strings.options.alternativeOption}
          onPress={handleAlternativeOption}
        />
        <IconButton
          style={styles.close}
          icon="close"
          onPress={() => goHome()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalView: {
    maxWidth: 600,
    margin: 20,
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    marginVertical: 5,
  },

  close: {
    position: "absolute",
    right: 10,
    top: 10,
  },

  modalText: {
    marginBottom: 15,
    fontSize: 20,
    textAlign: "justify",
  },
});
