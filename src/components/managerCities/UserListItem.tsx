import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { StyleSheet } from "react-native";

import IconButton from "../shared/IconButton";
import ItemList from "../shared/ItemList";
import { View } from "../shared/Themed";

import { useAppColor } from "@/hooks/ThemeHooks";
import IWeather from "@/models/WeatherModel";

interface IProps {
  data: IWeather;
  current?: boolean;
  onPress: (data: IWeather) => void;
  onPressDeleteButton: (data: IWeather) => void;
}

export default function UserListItem({
  data,
  onPress,
  current,
  onPressDeleteButton,
}: IProps) {
  const color = useAppColor();
  return (
    <View style={styles.item}>
      <ItemList
        onPress={() => onPress(data)}
        title={data.location.city}
        subtitle={`${data.location.state} - ${data.location.country}`}
      />
      {current ? (
        <FontAwesome5
          name="map-marker-alt"
          color={color.icon}
          size={20}
          style={styles.currentIndicator}
        />
      ) : null}

      <IconButton
        icon="remove"
        style={styles.button}
        onPress={() => {
          onPressDeleteButton(data);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    alignItems: "center",
    flexDirection: "row",
  },
  currentIndicator: {
    marginHorizontal: 10,
  },

  button: {
    right: 0,
    position: "absolute",
  },
});
