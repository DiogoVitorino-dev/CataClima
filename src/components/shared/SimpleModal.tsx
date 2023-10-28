import { FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  Pressable,
  ViewStyle,
  StyleProp,
} from "react-native";

import { Text, View } from "./Themed";

import { useAppColor } from "@/hooks/ThemeHooks";

interface IProps {
  message: string;
  visible: boolean;
  onDismiss?: () => void;
  style?: StyleProp<ViewStyle>;
}

export default function SimpleModal({
  message,
  visible,
  onDismiss,
  style,
}: IProps) {
  const color = useAppColor();
  const [visibleState, setVisibleState] = useState(false);

  useEffect(() => setVisibleState(visible), [visible]);

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visibleState}
      onDismiss={onDismiss}
      style={style}
    >

        <View
          style={styles.centeredView}
          lightColor="transparent"
          darkColor="transparent"
        >
          <View
            style={[
              styles.modalView,
              {
                borderColor: color.borderColor,
                borderWidth: StyleSheet.hairlineWidth,
              },
            ]}
          >
            <Text style={styles.modalText}>{message}</Text>
            <Pressable
              accessibilityRole="button"
              focusable
              style={[styles.button]}
              onPress={() => setVisibleState(false)}
            >
              <FontAwesome name="close" size={20} color={color.icon} />
            </Pressable>
          </View>
        </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 20,
    borderRadius: 20,
    paddingHorizontal: 10,
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
    margin: 10,
    elevation: 2,
  },
  textStyle: {
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginHorizontal: 15,
    textAlign: "center",
  },
});
