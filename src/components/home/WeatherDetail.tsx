import {OpenText} from '../shared';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';

export function WeatherDetail({
	dayOfWeek,  
	style,
	children,
}: {
  dayOfWeek: string;
  style?: StyleProp<ViewStyle>;
  children?: Array<JSX.Element> | JSX.Element;
}) {
	return (
		<View style={[styles.container, style]}>            
			<View>
				<OpenText 
					style={styles.dayOfWeek}>
					{dayOfWeek}
				</OpenText>
			</View>

			<View style={styles.separator} />
			<View style={styles.detail}>{children}</View>

      
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		flexDirection: 'column',
		alignItems: 'center',
	},

	backgroundImage:{
		width:500,
		height:500 

	},

	detail: {
		width: '100%',
		maxWidth: 500,
		flexDirection: 'row',
		marginVertical: 18,
		justifyContent: 'center',
		alignItems: 'center',
	},

	dayOfWeek: {
		color:'#fff',
		fontSize: 26,
		textTransform: 'capitalize',
		marginVertical: 18,
	},

	separator: {
		height: 1,
		backgroundColor:'#ccc',
		borderRadius: 20,
		marginVertical: 3,
		width: '100%',
		maxWidth: 300,
	},
});
