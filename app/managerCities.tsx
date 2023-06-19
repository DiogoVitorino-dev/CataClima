import { StyleSheet, useColorScheme } from 'react-native';
import { Text, View } from '../components/Themed';
import Searchbar from '../components/Searchbar';
import Colors from '../constants/Colors';
import { useEffect, useState } from 'react';
import CitiesList from '../components/CitiesList';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import UserCitiesDatabase from '../database/UserCitiesDatabase';

export default function ManagerCities() {
  const colorScheme = useColorScheme()
  const navigation = useNavigation()  
  const [dataList, setDataList] = useState(Array<string>)
  const [searchText, setSearchText] = useState('')
  const [selectedCity, setSelectedCity] = useState('')  
 
  return (
    <View style={styles.container}>
      <Text style={[styles.title]}>Gerenciar cidades</Text>

      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      <Searchbar 
        placeholder = 'Inserir cidades'
        placeholderTextColor = {Colors[colorScheme ?? 'light'].placeholderText}
        backgroundColor = {colorScheme === 'light' ? '#FAFAFA' : '#333333'}
        iconColor = {Colors[colorScheme ?? 'light'].icon}        
        borderColor = {Colors[colorScheme ?? 'light'].borderColor}
        textColor = {Colors[colorScheme ?? 'light'].text}        
        onChangeText = {setSearchText} />          
      

      <CitiesList 
        list={dataList} 
        onPress={setSelectedCity}
        backgroundColor={Colors[colorScheme ?? 'light'].background}
        itemTextColor = {Colors[colorScheme ?? 'light'].text}
        itemBorderColor = {Colors[colorScheme ?? 'light'].borderColor}
      /> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:'column',
    alignItems:'center',
    padding:18
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
