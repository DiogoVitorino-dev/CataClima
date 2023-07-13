import { StyleProp, TextStyle } from "react-native"
import { OpenText } from "../StyledText"

export default function WeatherText(
    {text,style} : 
    {text:string,style?:StyleProp<TextStyle>}
) {
    return (
        <OpenText 
            numberOfLines={1} 
            adjustsFontSizeToFit             
            style={[style,{color:'#fff'}]}>
            {text}
        </OpenText>
    )
}