import { ActivityIndicator, Platform, StyleSheet, useColorScheme } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { View } from '../components/Themed';
import WeatherStatus from '../components/WeatherStatus';
import Colors from '../constants/Colors';
import WeatherDetail from '../components/WeatherDetail';
import WeatherItem from '../components/WeatherItem';
import LocationService from '../services/location/LocationService';
import WeatherService from '../services/weather/WeatherService';
import PermissionModal from '../components/PermissionModal';
import { OpenTextDefault } from '../components/StyledText';
import Button from '../components/Button';
import {Weather, WeatherProps} from '../models/Weather';
import UserCitiesDatabase from '../database/UserCitiesDatabase';
import HeaderButton from '../components/HeaderButton';
import Flags from '../constants/Flags';
import CustomTheme from '../constants/CustomTheme';

function getDayOfWeek(datetime:string) {
  let split = Platform.OS === 'web'? datetime.split(', ') : datetime.split(' ')
  split = split[0].split('/')

  const date = new Date()
  date.setDate(Number.parseInt(split[0]))
  date.setMonth(Number.parseInt(split[1]))
  date.setFullYear(Number.parseInt(split[2]))
  
  switch (date.getDay()) {    
    case 1: return 'sábado'
    case 2: return 'Domingo'            
    case 3: return 'Segunda - feira'
    case 4: return 'terça - feira'
    case 5: return 'quarta - feira'
    case 6: return 'quinta - feira'
    default: return 'sexta - feira'
  }
}

function isNight() {
  return new Date().getHours() > 18  
}

export default function Home() {
  const colorScheme = useColorScheme()
  const router = useRouter()
  const navigation = useNavigation()
  const [data, setData] = useState(new Weather({}))
  const [permissionModalVisible, setPermissionModalVisible] = useState(false)
  const [isLoading, setIsloading] = useState(true)
  const [backgroundGradient, setBackgroundGradient] = useState(
    [Colors[colorScheme ?? 'light'].background,
    Colors[colorScheme ?? 'light'].background]
  )

  useEffect( () => {    
    verifyConnection()    
    checkDatabase().finally(() => {
      setIsloading(false)
    })
  }, [])  

  useEffect(() => {
    setBackgroundGradient(handleBackgroundGradient(data.weatherMain))
    navigation.setOptions({ 
      headerTitle: data.locationName,
      
      headerLeft:() => HeaderButton({
        href:'/managerCities',
        icon:'add',         
        iconColor:'#fff',
        iconSize:30,
        style:{marginLeft:5}
      })
   })
  }, [data])

  const checkDatabase = async () => {
    const keys = await AsyncStorage.getAllKeys()

    if (keys.length > 0) {
      let number = Platform.OS === 'web' ? 1 : 0 //workaround
      const cityStored = await UserCitiesDatabase().getCity(keys[number])

      if (cityStored) {
        setData(cityStored)          
        await updateWeather(cityStored.coords)
      }
         
    } else await getMyLocationWeather()
  }

  const verifyConnection = () => NetInfo.fetch()

  const updateWeather = ({latitude, longitude}:{latitude:number, longitude:number}) =>
    getWeatherInformation({latitude,longitude})

  const handleNewWeather = (newWeather: WeatherProps | null) => 
  setData(prev => newWeather != null ? new Weather(newWeather) : prev) 

  const getMyLocationWeather = async () => {  
    try {     
      const {latitude,longitude} = await LocationService().getMyLocation()
      await getWeatherInformation({longitude, latitude}) 
      
    } catch (error:any) {
      if (error.message === 'user/permission-denied' || error.code === 1)
        setPermissionModalVisible(true)      
    }
  }

  const getWeatherInformation = async (
    {latitude, longitude} :
    {latitude:number, longitude:number}) => {
    setIsloading(true)
           
    try {
      if ((await verifyConnection()).isConnected) {              
        const weather = await WeatherService()
          .getWeatherData({longitude, latitude})           
        handleNewWeather(weather)
      }

    } catch (error) {
      console.log(error);          
    } finally {
      setIsloading(false)
    }
  }

  const handleBackgroundGradient = (weatherMain:string) => {    
    switch (weatherMain) {
      case Flags.WeatherApiState.SUNNY: {
        if(isNight()) return CustomTheme.gradient.night         
        else return CustomTheme.gradient.sunny       
      }
      case Flags.WeatherApiState.CLOUDY: return CustomTheme.gradient.cloudy
      case Flags.WeatherApiState.SNOW:
      case Flags.WeatherApiState.RAINY: return CustomTheme.gradient.rainy      
    }
    return [Colors[colorScheme ?? 'light'].background,
    Colors[colorScheme ?? 'light'].background]  
  }

  const gotoManagerCities = () => router.push({pathname:'/managerCities'})

  const ClosePermissionModal = () => setPermissionModalVisible(false)

  const PermissionModalJSX = useCallback(() => (
    <PermissionModal 
      isModalVisible={permissionModalVisible} 
      onPressFirstButton={getMyLocationWeather}
      onPressSecondButton={gotoManagerCities}
      onRequestClose={ClosePermissionModal}
    />
  ),[permissionModalVisible])

  if (isLoading) {
    return (
      <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
          <ActivityIndicator 
            size="large" 
            color='#fff' />
      </View>
    )    
  }
  
  if(data.locationName) {
    return (
      <LinearGradient 
        colors={backgroundGradient} 
        start={{x:0,y:0}}
        end={{x:0.5,y:1}}
        style={styles.container}>

        <OpenTextDefault style={styles.updateTimeText} >
          Atualizado: {data.datetime}
        </OpenTextDefault>
        <WeatherStatus 
          iconName={data.icon}
          iconColor='#fff'
          iconSize={150}
          separatorColor='#ccc'
          textColor='#fff'
          temp={data.temperature + '°'}
          tempMax={data.maxTemperature + '°'}
          tempMin={data.minTemperature + '°'}
          weatherDescription={data.weatherDetail}
          
        />
  
        <WeatherDetail 
          dayOfWeek={getDayOfWeek(data.datetime)}
          textColor='#fff'
          separatorColor='#ccc'           
          >          
            <WeatherItem 
              iconColor = '#fff'            
              iconName='sun-thermometer-outline'
              textColor='#fff'
              iconSize={30}
              label='Sensação'
              value={data.feelsLike + '°c '}
            />
            <WeatherItem 
              iconColor = '#fff'            
              iconName='water-percent'
              textColor='#fff'
              iconSize={30}
              label='Humidade'
              value={data.humidity + '%'}
            />
            <WeatherItem 
              iconColor = '#fff'            
              iconName='weather-windy'
              textColor='#fff'
              iconSize={30}
              label='Vento'
              value={data.wind + ' km/h'}
            />
            <WeatherItem 
              iconColor = '#fff'            
              iconName='thermostat-box'
              textColor='#fff'
              iconSize={30}
              label='Pressão'
              value={data.pressure + ' mbar'}
            />                               
        </WeatherDetail>
        {PermissionModalJSX()}        
      </LinearGradient>      
    )
  } else {    
    return (
      <View style={styles.centeredView}>
        <OpenTextDefault style={styles.noDataText}>
          Ainda não escolheu uma cidade?{'\n'}Escolha uma das opções abaixo.
        </OpenTextDefault>
        <Button 
          label='Usar minha localização' 
          onPress={getMyLocationWeather}
          style={{marginTop:30}}
          borderColor={Colors[colorScheme ?? 'light'].borderColor}/>
        <Button 
          label='Escolher uma cidade' 
          onPress={gotoManagerCities}
          style={{marginTop:25}}
          borderColor={Colors[colorScheme ?? 'light'].borderColor}/>
        {PermissionModalJSX()}
      </View>
    )    
  }  
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

  updateTimeText:{
    fontSize:14,
    color:'#fff',
    opacity:0.8
  }
});
