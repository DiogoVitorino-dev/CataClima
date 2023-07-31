import { 
  StyleSheet, 
  ScrollView, 
  useColorScheme, 
  RefreshControl,
} from 'react-native'
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'

import LocationLib from '../src/libs/Location/Location';

import Colors from '../src/constants/Colors';
import { CoordinatesProps } from '../src/constants/Interfaces';

import { View } from '../src/components/Themed';
import WeatherDetail from '../src/components/home/WeatherDetail';
import PermissionModal from '../src/components/PermissionModal';
import HeaderButton from '../src/components/HeaderButton';
import Flags from '../src/constants/Flags';
import CustomTheme from '../src/constants/CustomTheme';
import SimpleModal from '../src/components/SimpleModal';
import Spinner from '../src/components/Spinner';
import TimeAgo from '../src/components/TimeAgo';
import WeatherStatus from '../src/components/home/WeatherStatus';
import WeatherNoData from '../src/components/home/WeatherNoData';
import WeatherItem from '../src/components/home/WeatherItem';

import { useAppDispatch, useAppSelector } from '../src/store/hooks';
import { 
  resetError, 
  resetStatus,
  selectWeatherById, 
  selectWeatherRequestError, 
  selectWeatherRequestStatus, 
  fetchAndUpdateWeather, 
  weatherAdded, 
  setCurrentWeatherID,
  fetchWeather,
  retrieveWeathersFromDB,
  getCurrentWeatherIDFromDB
} from '../src/store/weather/WeatherSlice';
import { ICity } from 'country-state-city';
import AnimatedBackground from '../src/components/home/AnimatedBackground';
import DatetimeUtils from '../src/utils/DatetimeUtils';
import { StatusBar } from 'expo-status-bar';

export default function Home() {
  const colorScheme = useColorScheme()
  const router = useRouter()
  const navigation = useNavigation()

  const {weatherSelectedID,searchedCity} = useLocalSearchParams()  

  const dispatch = useAppDispatch()
  const weather = useAppSelector(state =>{ 
    const a = selectWeatherById(state,state.weathers.currentWeatherID)
    console.log(state.weathers.entities);
    console.log(state.weathers.currentWeatherID);
    
    
    
    return a 
  }
  )
  
  

  const weatherRequestStatus = useAppSelector(selectWeatherRequestStatus)  
  const weatherRequestError = useAppSelector(selectWeatherRequestError)  
  
  const[isLoading,setLoadingState] = useState(false)

  const [permissionModalVisible, setPermissionModalVisible] = useState(false)
  const [NoConnectionModalVisible, setNoConnectionModalVisible] = useState(false)
  
  const [backgroundGradient, setBackgroundGradient] = useState(
    [Colors[colorScheme ?? 'light'].background,
    Colors[colorScheme ?? 'light'].background]
  )

  // Hooks
  useEffect(() => {
    if (!weather && weatherRequestStatus === 'idle')
        checkDatabase().then(saved => {saved || getMyLocationWeather()})
  }, [])
  

  useEffect(() => {    
    if (weather) {
      setBackgroundGradient(handleBackgroundGradient())

      navigation.setOptions({ 
        headerTitle: weather.city,
        
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
    }    
  }, [weather])

  useEffect(() => { 
     
    switch (weatherRequestStatus) {
      case 'pending':
        setLoadingState(true)        
        break;      
      
      case 'failed':
      case 'success': {        
        setLoadingState(false)              
        break;
      }        
    }    
  }, [weatherRequestStatus])
  
  useEffect(() => {
    if (weatherRequestError) {

      switch (weatherRequestError) {
        case Flags.errors.NOCONNECTION:
          setNoConnectionModalVisible(true)         
          break;

        default: console.error(weatherRequestError.message);        
      }
      dispatch(resetError)
    } 
  }, [weatherRequestError])
  
  useEffect(() => {
    console.log(weatherSelectedID,searchedCity);
    
    if (weatherSelectedID && typeof weatherSelectedID === 'string') 
      dispatch(setCurrentWeatherID(weatherSelectedID))

    else if (searchedCity && typeof searchedCity === 'string') {
      const {latitude,longitude} = JSON.parse(searchedCity.trim()) as ICity
      
      
      if (latitude && longitude)
        dispatch(
          fetchWeather({
            latitude:parseFloat(latitude),
            longitude:parseFloat(longitude)
          }))
        .unwrap()
        .then(response => dispatch(weatherAdded(response)))
    }
      
    
    
  }, [weatherSelectedID,searchedCity])

  // check

  const checkDatabase = async () => {   
    const saved = await dispatch(retrieveWeathersFromDB()).unwrap()
    if(saved.length > 0){    
      await dispatch(getCurrentWeatherIDFromDB()).unwrap()
      return true
    }

    return false
  }

  // Query weather
  const getMyLocationCoords = async () => {
    try {
      return await LocationLib().getMyLocation() as CoordinatesProps

    } catch (error:any) {
      if (
        error.message === Flags.errors.LOCATIONPERMISSIONDENIED || 
        error.code === 1
      ) 
        setPermissionModalVisible(true)            
    }

  }

  const getMyLocationWeather = async () => {      
    try {
      const coords = await getMyLocationCoords() 

      if(coords) {
        const result = await dispatch(fetchWeather(coords)).unwrap()

        if (result) 
          await dispatch(weatherAdded(result)).unwrap()
        
      }
    } catch (error:any) {
        if (error.message === Flags.errors.NOCONNECTION)
          setNoConnectionModalVisible(true)
            
    } finally {
      dispatch(resetStatus)   
    } 
    
  }  

  const updateWeather = async () => {
    try {
      if (weather)
        await dispatch(fetchAndUpdateWeather(weather)).unwrap()
      
    } finally {
      dispatch(resetStatus)
    }         
  }

  // Theme control
  const handleBackgroundGradient = () => {
    if(weather)  
      switch (weather.weatherMain) {
        case Flags.WeatherApiState.SUNNY: {
          if(DatetimeUtils().isNight(weather.datetime)) return CustomTheme.gradient.night         
          else return CustomTheme.gradient.sunny       
        }
        case Flags.WeatherApiState.CLOUDY: return CustomTheme.gradient.cloudy
        case Flags.WeatherApiState.SNOW:
        case Flags.WeatherApiState.RAINY: return CustomTheme.gradient.rainy      
      }

    return [
      Colors[colorScheme ?? 'light'].background,
      Colors[colorScheme ?? 'light'].background
    ]  
  }
  
  const handleIcon = () => {
    if(weather)  
      switch (weather.weatherMain) {
        case Flags.WeatherApiState.SUNNY: {
          if(DatetimeUtils().isNight(weather.datetime)) return 'moon'       
          else return 'sunny'     
        }
        case Flags.WeatherApiState.CLOUDY: return 'cloud'
        case Flags.WeatherApiState.SNOW:
        case Flags.WeatherApiState.RAINY: return 'rainy'    
      }

    return ''
  }  

  // Navigation
  const gotoManagerCities = () => router.push({pathname:'/managerCities'})

  // Modals
  const ClosePermissionModal = () => setPermissionModalVisible(false)

  const CloseNoConnectionModal = () => setNoConnectionModalVisible(false)

  const PermissionModalJSX = useCallback(() => (
    <PermissionModal 
      visible={permissionModalVisible} 
      onPressFirstButton={getMyLocationWeather}
      onPressSecondButton={gotoManagerCities}
      onDismiss={ClosePermissionModal}
    />
  ),[permissionModalVisible])

  const NoConnectionModalJSX = useCallback(() => (
    <SimpleModal 
      message='Sem conexão com a internet !'
      visible={NoConnectionModalVisible} 
      onDismiss={CloseNoConnectionModal} />
    ),[NoConnectionModalVisible])    
  
  // Viewers 
  if(weather || isLoading) {
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
          {!isLoading && weather       
          ? (
            <View style={[styles.container,{flex:1,backgroundColor:'transparent'}]}>
              <TimeAgo dateIsoFormat={weather.datetime} />

              <WeatherStatus 
                iconName={handleIcon()}
                temp={weather.temperature + '°'}
                tempMax={weather.maxTemperature + '°'}
                tempMin={weather.minTemperature + '°'}
                weatherDescription={weather.weatherDescription}
              />
        
              <WeatherDetail dayOfWeek={DatetimeUtils().getDayOfWeek(weather.datetime)}>
                <WeatherItem  
                  iconName='sun-thermometer-outline'
                  iconSize={30}
                  label='Sensação'
                  value={`${weather.feelsLike}°${weather.temperatureUnit}`}
                />
                <WeatherItem                                
                  iconName='water-percent'                    
                  iconSize={30}
                  label='Humidade'
                  value={weather.humidity + '%'}
                />
                <WeatherItem 
                  iconName='weather-windy'                    
                  iconSize={30}
                  label='Vento'
                  value={`${weather.wind} ${weather.windUnit}`}
                />
                <WeatherItem                                 
                  iconName='thermostat-box'                    
                  iconSize={30}
                  label='Pressão'
                  value={`${weather.pressure} ${weather.pressureUnit}`}
                />
              </WeatherDetail>
              <AnimatedBackground />
              
            </View>
          ): <Spinner />}

          {PermissionModalJSX()}       
          {NoConnectionModalJSX()}
        </ScrollView>
        <StatusBar style='light' />       
      </LinearGradient>            
    )
  } else {    
    return (
      <WeatherNoData 
        onPressMyLocationWeather={getMyLocationWeather}
        onPressNavigate={gotoManagerCities}>
        {PermissionModalJSX()}
        {NoConnectionModalJSX()}
        <StatusBar style='auto' />
      </WeatherNoData>
      
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
});
