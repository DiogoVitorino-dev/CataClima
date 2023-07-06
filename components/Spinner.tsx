import { ActivityIndicator, useColorScheme } from "react-native";
import { View } from "./Themed";
import Colors from "../constants/Colors";

export default function Spinner() {
    const colorScheme = useColorScheme()

    return (
        <View style={{
            flex:1,
            justifyContent:'center',
            alignItems:'center'}}
        >
            <ActivityIndicator 
            size="large" 
            color={Colors[colorScheme ?? 'light'].icon} />
        </View>
    )
    
}