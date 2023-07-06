import { 
  StyleSheet, 
  ScrollView, 
  useColorScheme, 
  RefreshControl
} from 'react-native'
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { parseISO } from 'date-fns';

import LocationService from '../services/location/LocationService';
import WeatherService from '../services/weather/WeatherService';

import Colors from '../constants/Colors';
import { CoordinatesProps } from '../constants/Interfaces';

import { View } from '../components/Themed';
import WeatherDetail from '../components/home/WeatherDetail';
import PermissionModal from '../components/PermissionModal';
import HeaderButton from '../components/HeaderButton';
import Flags from '../constants/Flags';
import CustomTheme from '../constants/CustomTheme';
import SimpleModal from '../components/SimpleModal';
import Spinner from '../components/Spinner';
import TimeAgo from '../components/TimeAgo';
import WeatherStatus from '../components/home/WeatherStatus';
import WeatherNoData from '../components/home/WeatherNoData';
import WeatherItem from '../components/home/WeatherItem';

import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { 
  resetError, 
  resetStatus,
  selectAllWeathers, 
  selectWeatherById, 
  selectWeatherRequestError, 
  selectWeatherRequestStatus, 
  fetchAndUpdateWeather, 
  weatherAdded, 
  setCurrentWeatherID,
  getCurrentWeatherIDFromDB,
  fetchWeather
} from '../redux/weather/WeatherSlice';
import { ICity } from 'country-state-city';

function getDayOfWeek(datetime:string) { 
  switch (parseISO(datetime).getDay()) {    
    case 0: return 'Domingo'                
    case 1: return 'Segunda - feira'
    case 2: return 'terça - feira'
    case 3: return 'quarta - feira'
    case 4: return 'quinta - feira'
    case 5: return 'sexta - feira'
    default: return 'sábado'
  }
}

const isNight = (datetime:string) => parseISO(datetime).getHours() >= 18  


export default function Home() {
  const colorScheme = useColorScheme()
  const router = useRouter()
  const navigation = useNavigation()

  const {weatherSelectedID,searchedCity} = useLocalSearchParams()  

  const dispatch = useAppDispatch()
  const weather = useAppSelector(state => 
    selectWeatherById(state.weathers.currentWeatherID)(state)
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
    // if database empty
    if (!weather && weatherRequestStatus === 'idle') {
        getMyLocationWeather()
    } 
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

  // Query weather
  const getMyLocationCoords = async () => {
    try {
      return await LocationService().getMyLocation() as CoordinatesProps

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
        const result = await WeatherService().getWeatherData(coords)
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
          if(isNight(weather.datetime)) return CustomTheme.gradient.night         
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
              <TimeAgo time={weather.datetime} />

              <WeatherStatus 
                iconName='sunny'
                temp={weather.temperature + '°'}
                tempMax={weather.maxTemperature + '°'}
                tempMin={weather.minTemperature + '°'}
                weatherDescription={weather.weatherDescription}
              />
        
              <WeatherDetail 
              dayOfWeek={getDayOfWeek(weather.datetime)}                           
              >          
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
            </View>
          ): <Spinner />}

          {PermissionModalJSX()}       
          {NoConnectionModalJSX()}
        </ScrollView>       
      </LinearGradient>            
    )
  } else {    
    return (
      <WeatherNoData 
        onPressMyLocationWeather={getMyLocationWeather}
        onPressNavigate={gotoManagerCities}>
        {PermissionModalJSX()}
        {NoConnectionModalJSX()}
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
