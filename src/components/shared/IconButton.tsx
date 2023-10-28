import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { View, StyleSheet, Pressable, ViewStyle } from "react-native";

import { Text } from "./Themed";

import { IconsFontAwesome } from "@/constants/TypesApp";
import { useAppColor } from "@/hooks/ThemeHooks";

interface IProps {
  icon: IconsFontAwesome;
  iconSize?: number;
  title?: string;
  onPress: () => void;
  style?: ViewStyle;
}

export default function IconButton({
  icon,
  onPress,
  title,
  iconSize,
  style,
}: IProps) {
  const color = useAppColor();
  return (
    <Pressable
      style={[
        styles.button,
        { backgroundColor: style?.backgroundColor || color.backdrop },
        style,
      ]}
      onPress={onPress}
    >
      {({ pressed, hovered }) => {
        let opacity = 1;
        let size = 1;

        if (pressed) {
          opacity = 0.7;
          size = 0.8;
        } else if (hovered) {
          opacity = 0.9;
          size = 0.95;
        }

        if (title)
          return (
            <View
              style={[
                styles.withTitle,
                { opacity, transform: [{ scale: size }] },
              ]}
            >
              <FontAwesome name={icon} size={iconSize} color={color.icon} />
              <Text style={styles.title}>{title}</Text>
            </View>
          );

        return (
          <View
            style={[styles.onlyIcon, { opacity, transform: [{ scale: size }] }]}
          >
            <FontAwesome name={icon} size={iconSize} color={color.icon} />
          </View>
        );
      }}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 18,
  },
  withTitle: {
    alignItems: "center",
    flexDirection: "row",
  },
  onlyIcon: {
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
    marginHorizontal: 4,
  },
});
