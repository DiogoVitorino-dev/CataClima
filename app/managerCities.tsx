import {ListRenderItemInfo, StyleSheet, useColorScheme} from 'react-native';
import {Text, View} from '../components/Themed';
import Searchbar from '../components/Searchbar';
import Colors from '../constants/Colors';
import {useContext, useEffect, useState} from 'react';
import CitiesList from '../components/CitiesList';
import {useNavigation} from 'expo-router';
import { WeatherContext } from '../context/WeatherContext';


export default function ManagerCities() {
  const colorScheme = useColorScheme();
  const {getAllWeathersNames,deleteWeatherInDB} = useContext(WeatherContext)
  const [dataList, setDataList] = useState(Array<string>);
  const [searchText, setSearchText] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  
  useEffect(() => {
    getAllWeathersNames().then(weatherList => setDataList(weatherList))
  },[])

  const handleSelectedCity = (data:ListRenderItemInfo<string>) => 
  setSelectedCity(data.item)
  
  const handleOnPressDeleteButton = (data:ListRenderItemInfo<string>) => {
    deleteWeatherInDB(data.item)
    setDataList(prev => prev.filter(key => key !== data.item))
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title]}>Gerenciar cidades</Text>

      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      <Searchbar
        placeholder="Inserir cidades"
        placeholderTextColor={Colors[colorScheme ?? 'light'].placeholderText}
        backgroundColor={colorScheme === 'light' ? '#FAFAFA' : '#333333'}
        iconColor={Colors[colorScheme ?? 'light'].icon}
        borderColor={Colors[colorScheme ?? 'light'].borderColor}
        textColor={Colors[colorScheme ?? 'light'].text}
        onChangeText={setSearchText}
      />

      <CitiesList
        list={dataList}
        onPressItem={handleSelectedCity}
        onPressDeleteButton = {handleOnPressDeleteButton}
        showDeleteButton={searchText ? false : true}        
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 18,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 18,
    height: 1,
    width: '80%',
  },
});
