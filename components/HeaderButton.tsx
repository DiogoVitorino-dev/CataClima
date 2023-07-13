import {MaterialIcons} from '@expo/vector-icons';
import {Link} from 'expo-router';
import {Pressable, StyleProp, TextStyle} from 'react-native';

export default function HeaderButton({
  href,
  params,
  onPress,
  icon,
  iconSize,
  iconColor,
  style,
}: {
  href?: string;
  params?: object;
  onPress?:() => void;
  iconSize: number;
  icon: string | any;
  iconColor: string;
  style?: StyleProp<TextStyle>;
}) {
  return (
    <Link 
      href={{pathname: href, params: params}} 
      style={style} 
      asChild
    >
      <Pressable 
        accessibilityRole='button'
        onPress={() => onPress ? onPress() : null}>
        {({pressed}) => (
          <MaterialIcons 
            name={icon} 
            size={iconSize} 
            color={iconColor} 
            style={{opacity: pressed ? 0.5 : 1}} 
          />
        )}
      </Pressable>
    </Link>
  );
}
