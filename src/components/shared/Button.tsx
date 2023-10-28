import { Pressable, StyleSheet, TextStyle, ViewStyle } from "react-native";

import { Text, View } from "./Themed";

import { useAppColor } from "@/hooks/ThemeHooks";

interface IProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  textStyle?: TextStyle;
  style?: ViewStyle;
}

export default function Button({
  label,
  disabled,
  onPress,
  textStyle,
  style,
}: IProps) {
  const color = useAppColor();

  return (
    <View
      style={[
        styles.container,
        style,
        {
          backgroundColor: style?.backgroundColor || color.backdrop,
          borderColor: style?.borderColor || color.borderColor,
          borderWidth: style?.borderWidth || StyleSheet.hairlineWidth,
        },
      ]}
    >
      <Pressable
        style={styles.button}
        testID="pressableTestID"
        onPress={onPress}
        disabled={disabled}
      >
        {({ pressed }) => (
          <Text
            style={[
              styles.label,
              { opacity: pressed ? 0.5 : 1, color: textStyle.color },
            ]}
          >
            {label}
          </Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxHeight: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    shadowColor: "rgba(0,0,0,0.3)",
    shadowOffset: { width: 5, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },

  button: {
    width: "100%",
    height: "100%",
    paddingHorizontal: 20,
    paddingVertical: 5,
    justifyContent: "center",
    alignItems: "center",
  },

  label: {
    textAlign: "center",
    fontSize: 16,
  },
});
