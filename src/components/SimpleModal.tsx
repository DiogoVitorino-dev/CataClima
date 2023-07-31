import React, { useEffect, useState } from 'react';
import {Modal, StyleSheet, Pressable, useColorScheme} from 'react-native';
import {OpenTextStyled} from './StyledText';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {View} from './Themed';
import Colors from '../constants/Colors';

export default function SimpleModal({
  message,
  visible,
  onDismiss
} : {
  message: string;
  visible: boolean;
  onDismiss?: () => void;
}) {
  const colorScheme = useColorScheme()
  const [visibleState,setVisibleState] = useState(false)

  useEffect(() => setVisibleState(visible), [visible])

  return (
    <Modal       
    animationType="slide" 
    transparent={true} 
    visible={visibleState}
    onDismiss={onDismiss}
    >
      <Pressable accessibilityRole='button' style={{flex:1}} onPress={() => {setVisibleState(false)}}>
        <View style={styles.centeredView} lightColor="transparent" darkColor="transparent">
          <View style={[styles.modalView,{
          borderColor:Colors[colorScheme ?? 'light'].borderColor,
          borderWidth:StyleSheet.hairlineWidth
          }]}>
            <OpenTextStyled style={styles.modalText}>{message}</OpenTextStyled>
            <Pressable accessibilityRole='button' focusable style={[styles.button]} onPress={() => setVisibleState(false)}>
              <MaterialCommunityIcons 
              name="close" 
              size={20} 
              color={Colors[colorScheme ?? 'light'].icon}/>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex:1,       
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'center',
    margin: 20,
    borderRadius: 20,
    paddingHorizontal: 10,    
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    margin: 10,
    elevation: 2,
  },
  textStyle: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginHorizontal: 15,
    textAlign: 'center',
  },
});
