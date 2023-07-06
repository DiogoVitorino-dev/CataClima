import React, {useState} from 'react';
import {FlatList, ListRenderItemInfo, Platform, StyleSheet, useColorScheme} from 'react-native';
import ListItem from './ListItem';
import Colors from '../../constants/Colors';
import { InitialWeatherProps, WeatherProps } from '../../constants/Interfaces';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectAllWeathers, weatherRemoved } from '../../redux/weather/WeatherSlice';
import { useRouter } from 'expo-router';
import { ICity } from 'country-state-city';
import UserCitiesList from './UserCitiesLIst';
import convertCountryCodeToName from '../../scripts/convertCountryCodeToName';


export default function CitiesList(
  {searchResultList}:
  {searchResultList:Array<ICity>}) {  
  const colorScheme =  useColorScheme()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const allWeathers = useAppSelector(selectAllWeathers)  

  const handleSelectedSearchedCity = (data:ListRenderItemInfo<ICity>) => {
    router.push({pathname:'/',params:{searchedCity:JSON.stringify(data.item)}})
  }
  
  const handleSelectedUserCity = (data:ListRenderItemInfo<WeatherProps>) => {
    router.push({pathname:'/',params:{weatherSelectedID:data.item.id}})
  }
  
  const handleRemovedCity = (data:ListRenderItemInfo<WeatherProps>) => {
    dispatch(weatherRemoved(data.item.id)) 
  }
  


  return (
    <FlatList
      data={searchResultList}
      style={styles.list}
      showsVerticalScrollIndicator={Platform.OS === 'web'}      
      contentContainerStyle={{borderRadius: 5}}
      ListEmptyComponent={() => UserCitiesList({
        userWeathersList:allWeathers,
        handleRemovedCity:handleRemovedCity,
        handleSelectedcity:handleSelectedUserCity,
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
