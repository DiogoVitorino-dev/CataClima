import { Ionicons } from '@expo/vector-icons';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {WeatherText as WeatherTempText} from './WeatherText';

export function WeatherStatus({
	iconName,  
	temp,
	tempMax,  
	tempMin,
	weatherDescription,
	style,
}: {
  iconName: any;
  temp: string;
  tempMax: string;
  tempMin: string;
  weatherDescription: string;
  style?: StyleProp<ViewStyle>;
}) {
	return (
		<View style={[styles.container, style]}>

			<View>
				<Ionicons name={iconName} size={150} color='#fff' />
			</View>

			<View style={styles.containerTemperature}>

				<View style={styles.temperature}>
					<WeatherTempText text={temp} style={{fontSize:80}} />          
				</View>

				<View style={styles.temperatureDetail}>
					<WeatherTempText text={tempMax} style={{fontSize:26}} />
					<View style={styles.separator} />
					<WeatherTempText text={tempMin} style={{fontSize:26}} />
				</View>

			</View>

			<View>
				<WeatherTempText 
					text={weatherDescription} 
					style={{fontSize:26,textTransform: 'capitalize'}} 
				/>        
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

	separator: {
		height: 1,
		marginVertical: 3,
		width: '100%',
		backgroundColor:'#ccc'
	},
});
