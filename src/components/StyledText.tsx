import {Text as TextNative} from 'react-native';
import {Text, TextProps} from './Themed';

export function OpenTextStyled(props: TextProps) {
  return <Text {...props} style={[props.style, {fontFamily: 'OpenSans'}]} />;
}

export function OpenText(props: TextProps) {
  return <TextNative {...props} style={[props.style, {fontFamily: 'OpenSans'}]} />;
}
