import React from 'react';
import { ListRenderItemInfo, Pressable, StyleSheet } from 'react-native';
import { OpenTextStyled, View } from '../shared';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { WeatherProps } from '../../constants';
import { ICity } from 'country-state-city';

export function ListItem(
	{data,onPress,city,state,country,borderColor,onPressDeleteButton,showDeleteButton} :
    {
      data:ListRenderItemInfo<any>,
      city:string,
      state:string,
      country:string,    
      borderColor?:string,
      onPress:(data:ListRenderItemInfo<any>) => void,
      onPressDeleteButton?:(data:ListRenderItemInfo<WeatherProps>) => void,
      showDeleteButton?:boolean
    }) {
    
	return (
		<Pressable onPress={() => onPress(data)}>
        
			<View
				style={[
					styles.item,            
					{borderBottomColor: borderColor},             
				]}>
				<OpenTextStyled style={styles.text}>{city}</OpenTextStyled>
				<OpenTextStyled style={[styles.text,{opacity:0.8}]}>{state+' - '+country}</OpenTextStyled>
				{showDeleteButton && onPressDeleteButton ? (
					<Pressable style={{right:0,position:'absolute'}} onPress={() => onPressDeleteButton(data)}>
						{({pressed})=>(
							<MaterialCommunityIcons 
								name='delete' 
								color='#FF403D'  
								size={30}
								style={{opacity: pressed ? 0.5 : 1}} />
						)}              
					</Pressable>
				):null}
			</View>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	item: {
		flexDirection:'column',
		height: 80,
		marginVertical: 5,
		paddingHorizontal:10,
		backgroundColor: 'transparent',
		justifyContent:'center',
		borderBottomWidth: 1,
		borderBottomColor: 'rgba(0,0,0,0.2)',
	},
    
	text: {                
		fontSize: 16,
		marginLeft: 5,        
	},
});
