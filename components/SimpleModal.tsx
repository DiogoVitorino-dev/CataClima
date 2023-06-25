import React from 'react';
import {Modal, StyleSheet, Pressable, useColorScheme} from 'react-native';
import {OpenText} from './StyledText';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {View} from './Themed';
import Colors from '../constants/Colors';

export default function SimpleModal({
  message,
  modalVisible,
  onCloseModal,
}: {
  message: string;
  modalVisible: boolean;
  onCloseModal: Function;
}) {
  const colorScheme = useColorScheme()
  return (
    <Modal 
    animationType="slide" 
    transparent={true} 
    visible={modalVisible} 
    onRequestClose={() => onCloseModal()} 
    >
      <View style={styles.centeredView} lightColor="transparent" darkColor="transparent">
        <View style={styles.modalView}>
          <OpenText style={styles.modalText}>{message}</OpenText>
          <Pressable style={[styles.button]} onPress={() => onCloseModal()}>
            <MaterialCommunityIcons 
            name="close" 
            size={20} 
            color={Colors[colorScheme ?? 'light'].icon}/>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 20,
    borderRadius: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
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
    padding: 10,
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
