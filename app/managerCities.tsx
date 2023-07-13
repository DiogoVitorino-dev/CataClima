import {StyleSheet, useColorScheme} from 'react-native';
import {View} from '../components/Themed';
import Searchbar from '../components/Searchbar';
import { useEffect,  useState } from 'react';
import CitiesList from '../components/managerCities/CitiesList';
import { ICity } from 'country-state-city';
import { useAppSelector } from '../redux/hooks';
import { selectAllWeathers } from '../redux/weather/WeatherSlice';
import { OpenTextStyled } from '../components/StyledText';
import CountryStateCities from '../libs/CountryStateCities/CountryStateCities';


export default function ManagerCities() {
  const colorScheme = useColorScheme();
  const [searchText, setSearchText] = useState('');
  const [searchResult, setSearchResult] = useState(Array<ICity>);
  const allWeathers = useAppSelector(selectAllWeathers)

  const searchTextChanged = (newText:string) => setSearchText(newText)
  
  useEffect(() => {    
    if(searchText)   
      CountryStateCities().searchCities(searchText,allWeathers)
      .then(result => setSearchResult(result))
    else 
      setSearchResult([])
    
  },[searchText])

  return (
    <View style={styles.container}>
      <OpenTextStyled style={[styles.title]}>Gerenciar cidades</OpenTextStyled>

      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      <Searchbar
        placeholder="Inserir cidades"
        backgroundColor={colorScheme === 'light' ? '#FAFAFA' : '#333333'}        
        onChangeText={searchTextChanged}
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
