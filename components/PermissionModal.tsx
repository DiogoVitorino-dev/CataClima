import React, {useState} from 'react';
import {Alert, Modal, StyleSheet, Pressable, View, useColorScheme, Platform} from 'react-native';
import {Text} from './Themed';
import Colors from '../constants/Colors';

export default function PermissionModal({
  isModalVisible,
  onRequestClose,
  onPressFirstButton,
  onPressSecondButton,
}: {
  isModalVisible: boolean;
  onRequestClose: Function;
  onPressFirstButton: Function;
  onPressSecondButton: Function;
}) {
  const colorScheme = useColorScheme();
  return (
    <Modal 
      animationType="fade" 
      transparent={true} 
      visible={isModalVisible} 
      onRequestClose={() => onRequestClose()}
    >
      <View style={styles.centeredView}>
        <View
          style={[
            styles.modalView,
            {
              backgroundColor: Colors[colorScheme ?? 'light'].background,
            },
          ]}>
          <Text style={styles.modalText}>
            CataClima necessita da sua permissão para usar o seu local e entregar a previsão do tempo da sua cidade.
          </Text>
          {Platform.OS === 'web' ? (
            <Text 
              style={[
                styles.modalText, 
              {fontSize: 16, opacity: 0.8}]}>
              Recarregue a página, caso necessário, verifique a permissão de localização do seu navegador.
            </Text>
          ) : null}
          <Pressable
            style={[
              styles.button,
              {
                backgroundColor: '#198754',
              },
            ]}
            onPress={() => {
              onPressFirstButton();
              onRequestClose();
            }}>
            <Text style={styles.textStyle}>Usar a minha localização</Text>
          </Pressable>
          <Pressable
            style={[
              styles.button,
              {
                backgroundColor: '#808080',
              },
            ]}
            onPress={() => {
              onPressSecondButton();
              onRequestClose();
            }}>
            <Text style={styles.textStyle}>Escolher uma cidade</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 35,
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
    borderRadius: 20,
    padding: 10,
    marginVertical: 5,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    fontSize: 20,
    textAlign: 'justify',
  },
});
