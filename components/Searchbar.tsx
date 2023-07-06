import React from 'react';
import {StyleSheet, TextInput} from 'react-native';
import {View} from './Themed';
import {MaterialIcons} from '@expo/vector-icons';

// caretColor: cursorColor WEB fix

export default function Searchbar({
  placeholder,
  placeholderTextColor,
  iconColor,
  textColor,
  backgroundColor,
  borderColor,
  onChangeText,
}: {
  placeholder: string;
  placeholderTextColor: string;
  iconColor: string;
  backgroundColor?: string;
  borderColor: string;
  textColor: string;
  onChangeText: Function;
}) {
  return (
    <View
      style={[
        styles.containerInput,
        {
          backgroundColor: backgroundColor || '#fff',
          borderWidth: 1,
          borderColor: borderColor,
        },
      ]}>
      <MaterialIcons 
        name="search" 
        color={iconColor} 
        size={20} 
        style={styles.icon} 
      />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        inputMode="text"
        cursorColor={textColor}
        style={[styles.input, {color: textColor}]}
        onChangeText={text => onChangeText(text)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  containerInput: {
    width: '100%',
    maxWidth: 500,
    maxHeight: 40,
    flex: 1,
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    borderRadius: 20,
  },

  input: {
    width: '100%',
  },

  icon: {
    marginHorizontal: 5,
  },
});
