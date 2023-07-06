import {StyleSheet, useColorScheme} from 'react-native';
import {Text, View} from '../components/Themed';
import Searchbar from '../components/Searchbar';
import Colors from '../constants/Colors';
import { useEffect, useState } from 'react';
import CitiesList from '../components/managerCities/CitiesList';
import { City, ICity } from 'country-state-city';
import { useAppSelector } from '../redux/hooks';
import { selectAllWeathers } from '../redux/weather/WeatherSlice';


const searchCities = async (
  searchText:string,
  ignoreCities:string[] = []
) => {      
  const reg = new RegExp(`^${searchText}`,'i')
  return City.getAllCities()
  .filter(city => city.name.match(reg) && !ignoreCities.includes(city.name))
}

export default function ManagerCities() {
  const colorScheme = useColorScheme();
  const [searchText, setSearchText] = useState('');
  const [searchResult, setSearchResult] = useState(Array<ICity>);
  const allWeathersNames = useAppSelector(state => 
    selectAllWeathers(state).map(weather => weather.city)
  )

  const serchTextChanged = (newText:string) => setSearchText(newText)
  
  useEffect(() => {
    if(searchText)   
      searchCities(searchText,allWeathersNames).then(result => setSearchResult(result))
    else setSearchResult([])
  },[searchText])

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
        onChangeText={serchTextChanged}
      />

      <CitiesList
        searchResultList={searchResult}      
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
