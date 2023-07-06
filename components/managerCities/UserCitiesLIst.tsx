import { FlatList, Platform } from "react-native";
import ListItem from "./ListItem";
import { WeatherProps } from "../../constants/Interfaces";

export default function UserCitiesList(
    {userWeathersList,handleSelectedcity,handleRemovedCity,borderColorItem}:
    {
        userWeathersList:Array<WeatherProps>,
        handleSelectedcity:Function,
        handleRemovedCity:Function,
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
            onPress = {item => handleSelectedcity(item)}
            onPressDeleteButton = {item => handleRemovedCity(item)}
            borderColor = {borderColorItem}
            showDeleteButton
          />
        )}        
        />
    )
    
}