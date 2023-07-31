import React, { useEffect, useState } from 'react';
import {Modal, StyleSheet, Pressable, View, useColorScheme, Platform} from 'react-native';
import {Colors} from '../../constants';
import { OpenTextStyled } from './StyledText';

export function PermissionModal({
	visible,
	onDismiss,
	onPressFirstButton,
	onPressSecondButton,
}: {
  visible: boolean;
  onDismiss: () => void;
  onPressFirstButton: () => void;
  onPressSecondButton: () => void;
}) {
	const [visibleState,setVisibleState] = useState(false);
	const colorScheme = useColorScheme();
  
	useEffect(() => setVisibleState(visible), [visible]);
  
	return (
		<Modal 
			animationType="fade"
			visible={visibleState}
			transparent={true}
			onDismiss={onDismiss}
		>
			<View style={styles.centeredView}>
				<View
					style={[
						styles.modalView,
						{
							backgroundColor: Colors[colorScheme ?? 'light'].background,
						},
					]}>
					<OpenTextStyled style={styles.modalText}>
            CataClima necessita da sua permissão para usar o seu local e entregar a previsão do tempo da sua cidade.
					</OpenTextStyled>
					{Platform.OS === 'web' ? (
						<OpenTextStyled 
							style={[
								styles.modalText, 
								{fontSize: 16, opacity: 0.8}]}>
              Recarregue a página, caso necessário, verifique a permissão de localização do seu navegador.
						</OpenTextStyled>
					) : null}
					<Pressable
						style={[
							styles.button,
							{
								backgroundColor: '#198754',
							},
						]}
						accessibilityRole='button'
						onPress={() => {
							onPressFirstButton();
							setVisibleState(false);              
						}}>
						<OpenTextStyled style={styles.textStyle}>Usar a minha localização</OpenTextStyled>
					</Pressable>
					<Pressable
						style={[
							styles.button,
							{
								backgroundColor: '#808080',
							},
						]}
						accessibilityRole='button'
						onPress={() => {
							onPressSecondButton();
							setVisibleState(false);              
						}}>
						<OpenTextStyled style={styles.textStyle}>Escolher uma cidade</OpenTextStyled>
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
