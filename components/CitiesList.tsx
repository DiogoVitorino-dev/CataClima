import React, {useEffect, useState} from 'react';
import {FlatList, ListRenderItemInfo, Platform, Pressable, StyleSheet, useColorScheme} from 'react-native';
import ListItem from './ListItem';
import Colors from '../constants/Colors';

export default function CitiesList({
  list,  
  showDeleteButton,
  onPressItem,
  onPressDeleteButton,
  ListEmptyComponent
}: {
  list: Array<string>;  
  showDeleteButton?:boolean
  onPressItem: (data:ListRenderItemInfo<string>) => void; 
  onPressDeleteButton: (data:ListRenderItemInfo<string>) => void; 
  ListEmptyComponent?:React.ReactElement<any | string | React.JSXElementConstructor<any>>
}) {
  const [data, setData] = useState(list);
  const colorScheme =  useColorScheme()

  useEffect(() => {
    setData(list);
  }, [list]);

  return (
    <FlatList
      data={data}
      style={styles.list}
      showsVerticalScrollIndicator={Platform.OS === 'web'}
      contentContainerStyle={{borderRadius: 5}}
      ListEmptyComponent={ListEmptyComponent}
      renderItem={data => ListItem({
        data,
        borderColor:Colors[colorScheme ?? 'light'].borderColor,
        onPressDeleteButton,
        onPress:onPressItem,
        showDeleteButton})}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    width: '100%',
    flex: 1,
    maxWidth: 500,
  },  
});
