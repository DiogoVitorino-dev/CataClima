import React, {useEffect, useState} from 'react';
import {FlatList, ListRenderItemInfo, Platform, StyleSheet, useColorScheme} from 'react-native';
import { WeatherProps,Colors } from '../../constants';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectAllWeathers, weatherRemoved } from '../../store/weather/WeatherSlice';
import { useRouter } from 'expo-router';
import { ICity } from 'country-state-city';
import {UserCitiesList} from './UserCitiesList';
import {convertCountryCodeToName} from '../../utils';
import { ListItem } from './ListItem';

export function CitiesList(
	{searchResultList}:
  {searchResultList:Array<ICity>}) {  
	const [data,setData] = useState<Array<ICity>>([]);
	const colorScheme =  useColorScheme();
	const router = useRouter();
	const dispatch = useAppDispatch();
	const allWeathers = useAppSelector(selectAllWeathers);  

	const handleSelectedSearchedCity = (data:ListRenderItemInfo<ICity>) => {
		router.push({pathname:'/',params:{searchedCity:JSON.stringify(data.item)}});
	};
  
	const handleSelectedUserCity = (data:ListRenderItemInfo<WeatherProps>) => {
		router.push({pathname:'/',params:{weatherSelectedID:data.item.id}});
	};
  
	const handleRemovedCity = (data:ListRenderItemInfo<WeatherProps>) => {
		dispatch(weatherRemoved(data.item.id)); 
	};

	useEffect(() => setData(searchResultList),[searchResultList]);
	
	return (
		<FlatList
			data={data}
			style={styles.list}
			showsVerticalScrollIndicator={Platform.OS === 'web'}      
			contentContainerStyle={{borderRadius: 5}}
			ListEmptyComponent={() => UserCitiesList({
				userWeathersList:allWeathers,
				handleRemovedCity:handleRemovedCity,
				handleSelectedCity:handleSelectedUserCity,
				borderColorItem:Colors[colorScheme ?? 'light'].borderColor
			})}
			renderItem={data => (
				<ListItem
					data = {data}
					city={data.item.name}
					country={convertCountryCodeToName(data.item.countryCode)}
					state={data.item.stateCode}
					onPress = {handleSelectedSearchedCity}
					borderColor = {Colors[colorScheme ?? 'light'].borderColor}
				/>
			)}
		/>
	);
}

const styles = StyleSheet.create({
	list: {
		width: '100%',
		flex: 1,
		maxWidth: 500,
	},  
});
