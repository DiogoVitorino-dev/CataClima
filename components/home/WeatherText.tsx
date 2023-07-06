import { StyleProp, TextStyle } from "react-native"
import { OpenTextDefault } from "../StyledText"

export default function WeatherText(
    {text,style} : 
    {text:string,style?:StyleProp<TextStyle>}
) {
    return (
        <OpenTextDefault 
            numberOfLines={1} 
            adjustsFontSizeToFit             
            style={[style,{color:'#fff'}]}>
            {text}
        </OpenTextDefault>
    )
}