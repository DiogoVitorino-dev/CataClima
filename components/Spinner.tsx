import { Image, useColorScheme } from "react-native";
import { View } from "./Themed";

export default function Spinner() {
    const colorScheme = useColorScheme()
    
    return (
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            {colorScheme === 'dark' ? (
                <Image style={{width:300,height:300}} source={require('../assets/images/loading-light.gif')} />
            ) : (
                <Image style={{width:300,height:300}} source={require('../assets/images/loading-dark.gif')} />
            )}           
        </View>
    )
    
}