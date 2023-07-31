import React from 'react';
import {StyleSheet, TextInput, useColorScheme} from 'react-native';
import {View} from './Themed';
import {MaterialIcons} from '@expo/vector-icons';
import {Colors} from '../../constants';

// caretColor: cursorColor WEB fix

export  function Searchbar({
	placeholder,
	backgroundColor,
	onChangeText,
}: {
  placeholder: string;
  backgroundColor?: string;
  onChangeText: (changedText:string) => void;
}) {
	const colorScheme =  useColorScheme();
	return (
		<View
			style={[
				styles.containerInput,
				{
					backgroundColor: backgroundColor || Colors[colorScheme ?? 'light'].background,
					borderWidth: 1,
					borderColor: Colors[colorScheme ?? 'light'].borderColor,
				},
			]}>
			<MaterialIcons 
				name="search" 
				color={Colors[colorScheme ?? 'light'].icon} 
				size={20} 
				style={styles.icon} 
			/>
			<TextInput
				placeholder={placeholder}
				placeholderTextColor={Colors[colorScheme ?? 'light'].placeholderText}
				inputMode="text"
				cursorColor={Colors[colorScheme ?? 'light'].text}
				style={[styles.input, {color: Colors[colorScheme ?? 'light'].text}]}
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
