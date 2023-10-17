import { StyleSheet, View } from 'react-native';
import { OpenTextStyled, Button } from '../shared';

export  function WeatherNoData(
	{onPressMyLocationWeather,onPressNavigate,children}:
    {
        onPressMyLocationWeather:() => void,
        onPressNavigate:() => void,
        children?:Array<JSX.Element>
    }) {

	return (
		<View style={styles.centeredView}>
			<OpenTextStyled style={styles.noDataText}>
                Ainda não escolheu uma cidade?
			</OpenTextStyled>
			<OpenTextStyled style={[styles.noDataText,{opacity:0.5,fontSize:16}]}>
                Escolha uma das opções abaixo.
			</OpenTextStyled>
			<Button
				label='Usar minha localização'
				onPress={() => onPressMyLocationWeather()}
				style={{marginTop:30}}
			/>
			<Button
				label='Escolher uma cidade'
				onPress={() => onPressNavigate()}
				style={{marginTop:25}}
			/>
			{children}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent:'space-between',
		flexDirection:'column',
		paddingTop:80
	},

	centeredView:{
		flex:1,
		justifyContent:'center',
		alignItems:'center'
	},

	noDataText:{
		fontSize:18,
		textAlign:'center'
	},
});
