import { FlatList, ListRenderItemInfo, Platform } from 'react-native';
import {ListItem} from './ListItem';
import { WeatherProps } from '../../constants';
import { ICity } from 'country-state-city';

export function UserCitiesList(
	{userWeathersList,handleSelectedCity,handleRemovedCity,borderColorItem}:
    {
        userWeathersList:Array<WeatherProps>,
        handleSelectedCity:(data:ListRenderItemInfo<WeatherProps>) => void,
        handleRemovedCity:(data:ListRenderItemInfo<WeatherProps>) => void,
        borderColorItem:string
    }) {
    
	return (         
		<FlatList
			data={userWeathersList}
			style = {{
				width: '100%',
				flex: 1,
				maxWidth: 500,
			}}
			showsVerticalScrollIndicator={Platform.OS === 'web'}      
			contentContainerStyle={{borderRadius: 5}}      
			renderItem={data => (
				<ListItem
					data = {data}
					city={`${data.item.city}`}
					state={`${data.item.state}`}
					country={`${data.item.country}`}
					onPress = {item => handleSelectedCity(item)}
					onPressDeleteButton = {item => handleRemovedCity(item)}
					borderColor = {borderColorItem}
					showDeleteButton
				/>
			)}        
		/>
	);
    
}