import { useColorScheme } from "react-native";

import Colors from "@/constants/Colors";

export const useAppColor = () => {
  const colorScheme = useColorScheme();
  return Colors[colorScheme ?? "light"];
};
