import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Platform } from "react-native";

import { ICoordsParams } from ".";

import Button from "@/components/shared/Button";
import { Text, View } from "@/components/shared/Themed";
import Strings from "@/constants/Strings";
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
    const coords: ICoordsParams = {
      lat: latitude.toString(),
      lon: longitude.toString(),
    };

    router.replace({
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
          label={Strings.options.useMyLocation}
          onPress={handleUseMyLocation}
        />
        <Button
          label={Strings.options.alternativeOption}
          onPress={handleAlternativeOption}
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
  },
  modalView: {
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
    borderRadius: 20,
    padding: 10,
    marginVertical: 5,
    elevation: 2,
  },

  modalText: {
    marginBottom: 15,
    fontSize: 20,
    textAlign: "justify",
  },
});
