import { Image, StyleSheet, View } from 'react-native';

export function AnimatedBackground() {
	return (
		<View style={styles.animatedBG} >
			<Image style={styles.animatedIMG} 
				source={require('../../assets/images/wave.gif')}
			/>
		</View>
	);    
}

const styles = StyleSheet.create({
	animatedBG:{    
		position:'absolute',
		maxWidth:450,
		maxHeight:230,
		width:'100%',
		height:'100%',                                        
		bottom:0,                             
		zIndex:-10,
		flex:1,
		borderLeftWidth:StyleSheet.hairlineWidth,
		borderRightWidth:StyleSheet.hairlineWidth,
		borderColor:'rgba(250,250,250,0.2)',
		elevation:5,
		shadowRadius:10,
		shadowColor:'rgba(0,0,0,0.2)',               
		shadowOffset:{width:0,height:10}      
	},

	animatedIMG:{    
		width:'100%',
		height:'100%'
	}
});