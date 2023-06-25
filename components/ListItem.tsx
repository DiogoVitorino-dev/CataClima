import React from 'react';
import { View } from './Themed';
import { ListRenderItemInfo, Pressable, StyleSheet, useColorScheme } from 'react-native';
import { OpenText } from './StyledText';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ListItem(
    {data,onPress,borderColor,onPressDeleteButton,showDeleteButton} :
    {
      data:ListRenderItemInfo<string>,      
      borderColor?:string,
      onPress:(data:ListRenderItemInfo<string>) => void,
      onPressDeleteButton:(data:ListRenderItemInfo<string>) => void,
      showDeleteButton?:boolean
    }) {
    
    return (
        <View
          style={[
            styles.item,            
            {borderBottomColor: borderColor},             
          ]}>
          <Pressable onPress={() => onPress(data)}>
            <OpenText style={styles.title}>{data.item}</OpenText>
          </Pressable>
          {showDeleteButton ? (
            <Pressable onPress={() => onPressDeleteButton(data)}>
              {({pressed})=>(
                <MaterialCommunityIcons 
                name='delete' 
                color='#FF403D'  
                size={30}
                style={{opacity: pressed ? 0.5 : 1}} />
              )}              
            </Pressable>
          ):null}
        </View>
    )
};

const styles = StyleSheet.create({
    item: {
      flexDirection:'row',
        height: 80,
        marginVertical: 5,
        paddingHorizontal:10,
        backgroundColor: 'transparent',
        justifyContent: 'space-between',
        alignItems:'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.2)',
      },
    
      title: {
        fontSize: 22,
        marginLeft: 5,        
      },
})
