import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TextInput } from "react-native";

import { View } from "./Themed";

import { useAppColor } from "@/hooks/ThemeHooks";

// caretColor: cursorColor WEB fix

interface IProps {
  placeholder: string;
  backgroundColor?: string;
  onChangeText: (changedText: string) => void;
}

export default function SearchBar({
  placeholder,
  backgroundColor,
  onChangeText,
}: IProps) {
  const color = useAppColor();
  return (
    <View
      style={[
        styles.containerInput,
        {
          backgroundColor: backgroundColor || color.backdrop,
          borderWidth: 1,
          borderColor: color.borderColor,
        },
      ]}
    >
      <FontAwesome
        name="search"
        color={color.icon}
        size={20}
        style={styles.icon}
      />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={color.subtitle}
        inputMode="text"
        cursorColor={color.text}
        style={[styles.input, { color: color.text }]}
        onChangeText={(text) => onChangeText(text)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  containerInput: {
    width: "100%",
    maxWidth: 500,
    maxHeight: 40,
    flex: 1,
    marginBottom: 5,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 5,
    borderRadius: 20,
  },

  input: {
    flex: 1,
  },

  icon: {
    marginHorizontal: 5,
  },
});
