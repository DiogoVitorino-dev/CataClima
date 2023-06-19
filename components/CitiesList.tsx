import React, { useEffect, useState } from 'react';
import { FlatList, Platform, Pressable, StyleSheet } from 'react-native';
import { OpenText } from './StyledText';
import { View } from './Themed';

export default function CitiesList(
    {list, itemTextColor, itemBorderColor, backgroundColor, onPress} :
    {list: Array<string>, itemTextColor:string,itemBorderColor:string,backgroundColor:string, onPress: Function}) {
    const [data,setData] = useState(list)

    useEffect(()=>{
        setData(list)
    },[list])
    
    return <FlatList
        data={data}
        style={styles.list}
        showsVerticalScrollIndicator = {Platform.OS === 'web'}
        contentContainerStyle={{borderRadius:5}}        

        renderItem={({item}) => (
            <View style={[styles.item,{borderBottomColor:itemBorderColor,backgroundColor:backgroundColor}]}>
                <Pressable onPress={() => onPress(item)}>
                    <OpenText style={[styles.title,{color:itemTextColor}]}>
                        {item}
                    </OpenText>              
                </Pressable>
            </View>          
        )}
    />
    
}

const styles = StyleSheet.create({
    list: {    
        width:"100%",
        flex:1,
        maxWidth:500,
    },

    item: {
        height:80,        
        marginVertical:5,
        backgroundColor:'transparent',                  
        justifyContent:'center',
        borderBottomWidth:1,
        borderBottomColor:'rgba(0,0,0,0.2)'
    },

    title:{
        fontSize:22,
        marginLeft:5,
        textTransform:'capitalize'    
    }
  
});