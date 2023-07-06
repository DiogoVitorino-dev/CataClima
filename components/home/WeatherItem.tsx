import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import WeatherText from './WeatherText';

export default function WeatherItem({
  iconName,  
  iconSize,
  label,  
  value,
  style,
}: {
  iconName: any;  
  iconSize: number;
  label: string;  
  value: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.container, style]}>
      <View>
        <MaterialCommunityIcons name={iconName} color='#fff' size={iconSize} />
      </View>
      <WeatherText text={label} style={styles.label} />
      <WeatherText text={value} style={styles.value} /> 
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
    color:'#fff'
  },

  value: {
    fontSize: 14,
    color:'#fff'
  },
});
