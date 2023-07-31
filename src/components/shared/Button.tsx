import {Pressable, StyleProp, StyleSheet, ViewStyle, useColorScheme} from 'react-native';
import { View } from './Themed';
import { Colors } from '../../constants';
import { OpenTextStyled } from './StyledText';

export function Button({
	label,
	disabled,
	onPress,
	style,
}: {
  label: string;  
  disabled?: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}) {
	const colorScheme = useColorScheme();

	return (
    
		<View 
			style={[
				styles.container,
				style,{
					borderColor:Colors[colorScheme ?? 'light'].borderColor,
					borderWidth:StyleSheet.hairlineWidth
				}
			]}
			lightColor="#FAFAFA"
			darkColor="#1A1A1A">
			<Pressable 
				style={styles.button}
				testID='pressableTestID'
				onPress={() => onPress()} disabled={disabled}>          
				{({pressed}) => (
					<OpenTextStyled 
						style={[styles.label, {opacity: pressed ? 0.5 : 1}]}>
						{label}
					</OpenTextStyled>
				)}
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		maxHeight: 40,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 20,
		shadowColor: 'rgba(0,0,0,0.3)',
		shadowOffset: {width: 5, height: 5},
		shadowRadius: 10,
		elevation: 5,
	},

	button: {
		width: '100%',
		height: '100%',
		paddingHorizontal: 20,
		paddingVertical: 5,
		justifyContent: 'center',
		alignItems: 'center',
	},

	label: {
		textAlign: 'center',
		fontSize: 16,
	},
});
