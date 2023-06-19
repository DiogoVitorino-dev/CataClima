import { OpenTextDefault } from "./StyledText";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

export default function WeatherDetail(
    {dayOfWeek,textColor, separatorColor, style, children} : 
    {dayOfWeek:string,textColor:string, separatorColor?:string, style?:StyleProp<ViewStyle>, children?:Array<JSX.Element> | JSX.Element}) {

    return (
        <View style={[styles.container,style]}>
            <View>
                <OpenTextDefault style={[styles.dayOfWeek,{color:textColor}]}>
                    {dayOfWeek}
                </OpenTextDefault>
            </View>

            <View style={[styles.separator,{backgroundColor:separatorColor}]}  />

            <View style={styles.detail}>{children}</View>                        
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        width:'100%',        
        flexDirection:'column',
        alignItems:'center'
    },
    
    detail:{
        width:'100%',
        maxWidth:500,      
        flexDirection:'row',        
        marginVertical:18,        
        justifyContent:'center',
        alignItems:'center',               
    },   

    dayOfWeek:{
        fontSize:26,
        textTransform:'capitalize',          
        marginVertical:18
    },

    separator:{
        height:1,
        borderRadius:20,
        marginVertical:3,
        width:'100%',
        maxWidth:300
        
    }

})