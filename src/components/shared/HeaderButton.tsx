import { FontAwesome } from "@expo/vector-icons";
import { Pressable, StyleProp, TextStyle } from "react-native";

import { IconsFontAwesome } from "@/constants/TypesApp";

interface IProps {
  onPress: () => void;
  icon: IconsFontAwesome;
  color?: string;
  style?: StyleProp<TextStyle>;
}

export default function HeaderButton({ onPress, icon, color, style }: IProps) {
  return (
    <Pressable accessibilityRole="button" style={style} onPress={onPress}>
      {({ pressed }) => (
        <FontAwesome
          name={icon}
          size={30}
          color={color}
          style={{ opacity: pressed ? 0.5 : 1 }}
        />
      )}
    </Pressable>
  );
}
