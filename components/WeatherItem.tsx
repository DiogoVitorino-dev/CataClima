import {OpenTextDefault} from './StyledText';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';

export default function WeatherItem({
  iconName,
  iconColor,
  iconSize,
  label,
  textColor,
  value,
  style,
}: {
  iconName: any;
  iconColor: string;
  iconSize: number;
  label: string;
  textColor: string;
  value: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.container, style]}>
      <View>
        <MaterialCommunityIcons name={iconName} color={iconColor} size={iconSize} />
      </View>
      <OpenTextDefault numberOfLines={1} adjustsFontSizeToFit style={[styles.label, {color: textColor}]}>
        {label}
      </OpenTextDefault>
      <OpenTextDefault numberOfLines={1} adjustsFontSizeToFit style={[styles.value, {color: textColor}]}>
        {value}
      </OpenTextDefault>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '20%',
    height: 80,
    padding: 3,
    margin: 3,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  label: {
    fontSize: 12,
  },

  value: {
    fontSize: 14,
  },
});
