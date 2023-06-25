import {MaterialCommunityIcons, MaterialIcons, Ionicons} from '@expo/vector-icons';
import {OpenTextDefault} from './StyledText';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';

export default function WeatherStatus({
  iconName,
  iconColor,
  iconSize,
  temp,
  tempMax,
  separatorColor,
  tempMin,
  weatherDescription,
  textColor,
  style,
}: {
  iconName: any;
  iconColor: string;
  separatorColor?: string;
  iconSize: number;
  temp: string;
  tempMax: string;
  textColor: string;
  tempMin: string;
  weatherDescription: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.container, style]}>
      <View>
        <Ionicons name={iconName} size={iconSize} color={iconColor} />
      </View>
      <View style={styles.containerTemperature}>
        <View style={styles.temperature}>
          <OpenTextDefault numberOfLines={1} adjustsFontSizeToFit style={[styles.textTemp, {color: textColor}]}>
            {temp}
          </OpenTextDefault>
        </View>
        <View style={styles.temperatureDetail}>
          <OpenTextDefault numberOfLines={1} adjustsFontSizeToFit style={[styles.textTempDetail, {color: textColor}]}>
            {tempMax}
          </OpenTextDefault>
          <View style={[styles.separator, {backgroundColor: separatorColor}]} />
          <OpenTextDefault numberOfLines={1} adjustsFontSizeToFit style={[styles.textTempDetail, {color: textColor}]}>
            {tempMin}
          </OpenTextDefault>
        </View>
      </View>
      <View>
        <OpenTextDefault style={[styles.textDescription, {color: textColor}]}>{weatherDescription}</OpenTextDefault>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 300,
    flexDirection: 'column',
    alignItems: 'center',
  },

  containerTemperature: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  temperature: {
    marginHorizontal: 5,
  },

  temperatureDetail: {
    maxWidth: 80,
    marginHorizontal: 5,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  textTemp: {
    fontSize: 80,
  },

  textTempDetail: {
    fontSize: 26,
  },

  textDescription: {
    fontSize: 26,
    textTransform: 'capitalize',
  },

  separator: {
    height: 1,
    marginVertical: 3,
    width: '100%',
  },
});
