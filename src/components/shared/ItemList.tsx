import React, { useRef } from "react";
import { Pressable, StyleSheet, Animated } from "react-native";

import { Text } from "../shared/Themed";

import { useAppColor } from "@/hooks/ThemeHooks";

interface IProps {
  title: string;
  subtitle: string;
  onPress: () => void;
}

export default function ItemList({ subtitle, title, onPress }: IProps) {
  const background = useRef(new Animated.Value(0)).current;
  const color = useAppColor();

  const fadeIn = () => {
    Animated.timing(background, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(background, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };
  return (
    <Pressable
      onPress={() => onPress()}
      onPressIn={fadeIn}
      onPressOut={fadeOut}
      onHoverIn={fadeIn}
      onHoverOut={fadeOut}
    >
      <Animated.View
        style={[
          styles.item,
          {
            backgroundColor: background.interpolate({
              inputRange: [0, 1],
              outputRange: [color.background, color.backdrop],
            }),
          },
        ]}
      >
        <Text style={styles.text}>{title}</Text>
        <Text style={[styles.text, { color: color.subtitle }]}>{subtitle}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "column",
    height: 80,
    marginVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "transparent",
    justifyContent: "center",
  },

  button: {
    right: 0,
    position: "absolute",
  },

  text: {
    fontSize: 16,
    marginLeft: 5,
  },
});
