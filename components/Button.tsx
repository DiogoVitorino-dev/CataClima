import { Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";
import { View } from '../components/Themed';
import { OpenText } from "./StyledText";

export default function Button({label,borderColor,disabled,onPress,style} : 
    {label:string,borderColor?:string,disabled?:boolean, onPress:Function,style?:StyleProp<ViewStyle> }) {
    return (
        <View style={[styles.container,style,{            
            borderColor:borderColor || '#D4D4D4',
            borderWidth:StyleSheet.hairlineWidth,}]}
            lightColor="#FAFAFA"
            darkColor="#1A1A1A">
            <Pressable style={styles.button} onPress={() => onPress()} disabled={disabled} >
            {({ pressed }) => (
                <OpenText style={[styles.label,{opacity:pressed ? 0.5 : 1}]}>
                    {label}
                </OpenText>                
            )}            
            </Pressable>
        </View>
    )   
}

const styles = StyleSheet.create({
    container:{
        maxHeight:40,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:20,
        shadowColor:'rgba(0,0,0,0.3)',
        shadowOffset:{width:5,height:5},
        shadowRadius:10,
        elevation:5,        
    },

    button:{
        width:'100%',
        height:'100%',
        paddingHorizontal:20,
        paddingVertical:5,       
        justifyContent:'center',
        alignItems:'center',               
    },

    label:{
        textAlign:'center',
        fontSize:16
    }
})