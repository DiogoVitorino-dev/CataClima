import { Platform, StyleSheet, ScrollView, useColorScheme, RefreshControl, ActivityIndicator } from 'react-native'
import { useNavigation, useRouter } from 'expo-router';
import { useCallback, useContext, useEffect, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'

import { View } from '../components/Themed';
import WeatherStatus from '../components/WeatherStatus';
import Colors from '../constants/Colors';
import WeatherDetail from '../components/WeatherDetail';
import WeatherItem from '../components/WeatherItem';
import LocationService from '../services/location/LocationService';
import WeatherService from '../services/weather/WeatherService';
import PermissionModal from '../components/PermissionModal';
import { OpenText, OpenTextDefault } from '../components/StyledText';
import Button from '../components/Button';
import HeaderButton from '../components/HeaderButton';
import Flags from '../constants/Flags';
import CustomTheme from '../constants/CustomTheme';
import SimpleModal from '../components/SimpleModal';
import { WeatherContext } from '../context/WeatherContext';
import UserWeathersDatabase from '../database/UserWeathersDatabase';

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
  return new Date().getHours() >= 18  
}

export default function Home() {
  const colorScheme = useColorScheme()
  const router = useRouter()
  const navigation = useNavigation()
  
  const {
    WeatherData,
    setWeather
  } = useContext(WeatherContext)
  const [permissionModalVisible, setPermissionModalVisible] = useState(false)
  const [NoConnectionModalVisible, setNoConnectionModalVisible] = useState(false)
  const [isLoading, setIsloading] = useState(true)
  const [backgroundGradient, setBackgroundGradient] = useState(
    [Colors[colorScheme ?? 'light'].background,
    Colors[colorScheme ?? 'light'].background]
  )

  // Hooks
  useEffect( () => {
    checkDatabase()
    .then( async weatherStored => {
      if (weatherStored?.locationName && setWeather){        
        setWeather(weatherStored)
        updateWeather(weatherStored.coords.latitude,weatherStored.coords.longitude)
      }else 
        await getMyLocationWeather()             
    })
    .finally(() => {
      setIsloading(false)
    })
  }, [])  

  useEffect(() => {
    setBackgroundGradient(handleBackgroundGradient(WeatherData.weatherMain))    
    navigation.setOptions({ 
      headerTitle: WeatherData.locationName,
      
      headerLeft:() => HeaderButton({
        href:'/managerCities',
        icon:'add',         
        iconColor:'#fff',
        iconSize:30,
        style:{marginLeft:10}
      }),

      headerRight:() => HeaderButton({
        onPress:updateWeather,
        icon:'refresh',         
        iconColor:'#fff',
        iconSize:30,
        style:{marginRight:10}
      })      
   })
  }, [WeatherData])

  // Checks
  const checkDatabase = async () => {    
    const cityStored = await UserWeathersDatabase().getCurrent()
    
    if (cityStored) return cityStored           
    return null    
  }

  // Query WeatherData
  const getMyLocationWeather = async () => {
    setIsloading(true)  
    try {     
      const {latitude,longitude} = await LocationService().getMyLocation()
      const currentLocationWeather = 
        await WeatherService().getWeatherData({longitude, latitude})
                
      
      if(currentLocationWeather && setWeather) setWeather(currentLocationWeather)       
      
    } catch (error:any) {

      if (error === Flags.ErrorFlags.LOCATIONPERMISSIONDENIED || error.code === 1) 
        setPermissionModalVisible(true) 

      else if(error === Flags.ErrorFlags.NOCONNECTION)
        setNoConnectionModalVisible(true)
          
    } finally {
      setIsloading(false)
    }
    
  }

  const updateWeather = (latitude?: number, longitude?: number) => {
    setIsloading(true)
    let coords = WeatherData.coords

    if (latitude && longitude) coords = {latitude, longitude}         
    
    WeatherService().getWeatherData(coords)
    .then(updatedWeather => {

      if(updatedWeather && setWeather) setWeather(updatedWeather)
    })

    .catch(error => {
      if (error === Flags.ErrorFlags.NOCONNECTION)
        setNoConnectionModalVisible(true)
    })

    .finally(() => setIsloading(false))   
  }

  // Theme control
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

  // Navigation
  const gotoManagerCities = () => router.push({pathname:'/managerCities'})

  // Modals
  const ClosePermissionModal = () => setPermissionModalVisible(false)

  const CloseNoConnectionModal = () => setNoConnectionModalVisible(false)

  const PermissionModalJSX = useCallback(() => (
    <PermissionModal 
      isModalVisible={permissionModalVisible} 
      onPressFirstButton={getMyLocationWeather}
      onPressSecondButton={gotoManagerCities}
      onRequestClose={ClosePermissionModal}
    />
  ),[permissionModalVisible])

  const NoConnectionModalJSX = useCallback(() => (
    <SimpleModal 
      message='Sem conexão com a internet !'
      modalVisible={NoConnectionModalVisible} 
      onCloseModal={CloseNoConnectionModal} />
    ),[NoConnectionModalVisible])

  
  // Viewers 
  if(WeatherData.locationName || isLoading) {
    return (      
      <LinearGradient 
        colors={backgroundGradient} 
        start={{x:0,y:0}}
        end={{x:0.5,y:1}}
        style={{flex:1}}>
          
        <ScrollView        
        contentContainerStyle={{flex:1}}      
        refreshControl = {
          <RefreshControl
          progressViewOffset={50}
          refreshing={isLoading} 
          onRefresh={() => updateWeather()}/>      
        }>
          {isLoading && 
          !WeatherData.locationName && 
          Platform.OS === 'web' ? (
            <View style={styles.centeredView}>
                <ActivityIndicator 
                size="large" 
                color={Colors[colorScheme ?? 'light'].icon} />
            </View>

          ) : (
            <View style={[styles.container,{flex:1,backgroundColor:'transparent'}]}>
              <OpenTextDefault style={styles.updateTimeText} >
                Atualizado: {WeatherData.datetime}
              </OpenTextDefault>

              <WeatherStatus 
                iconName={WeatherData.icon}
                iconColor='#fff'
                iconSize={150}
                separatorColor='#ccc'
                textColor='#fff'
                temp={WeatherData.temperature + '°'}
                tempMax={WeatherData.maxTemperature + '°'}
                tempMin={WeatherData.minTemperature + '°'}
                weatherDescription={WeatherData.weatherDetail}
                
              />
        
              <WeatherDetail 
                dayOfWeek={getDayOfWeek(WeatherData.datetime)}
                textColor='#fff'
                separatorColor='#ccc'           
                >          
                  <WeatherItem 
                    iconColor = '#fff'            
                    iconName='sun-thermometer-outline'
                    textColor='#fff'
                    iconSize={30}
                    label='Sensação'
                    value={WeatherData.feelsLike + '°c '}
                  />
                  <WeatherItem 
                    iconColor = '#fff'            
                    iconName='water-percent'
                    textColor='#fff'
                    iconSize={30}
                    label='Humidade'
                    value={WeatherData.humidity + '%'}
                  />
                  <WeatherItem 
                    iconColor = '#fff'            
                    iconName='weather-windy'
                    textColor='#fff'
                    iconSize={30}
                    label='Vento'
                    value={WeatherData.wind + ' km/h'}
                  />
                  <WeatherItem 
                    iconColor = '#fff'            
                    iconName='thermostat-box'
                    textColor='#fff'
                    iconSize={30}
                    label='Pressão'
                    value={WeatherData.pressure + ' mbar'}
                  />                               
              </WeatherDetail>
            </View>
          )}

          {PermissionModalJSX()}       
          {NoConnectionModalJSX()}
        </ScrollView>       
      </LinearGradient>            
    )
  } else {    
    return (
      <View style={styles.centeredView}>
        <OpenText style={styles.noDataText}>
          Ainda não escolheu uma cidade?  
        </OpenText>
        <OpenText style={[styles.noDataText,{opacity:0.5,fontSize:16}]}>
          Escolha uma das opções abaixo.
        </OpenText>
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
        {NoConnectionModalJSX()}
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
