import { ICity } from "country-state-city";
import { useEffect, useState } from "react";
import { StyleSheet, useColorScheme } from "react-native";

import { CitiesList } from "../components/managerCities";
import { OpenTextStyled, Searchbar, View } from "../components/shared";
import { CountryStateCities } from "../libs";
import { useAppSelector } from "../store/hooks";
import { selectAllWeathers } from "../store/weather/WeatherSelectors";

export default function ManagerCities() {
	const colorScheme = useColorScheme();
	const [searchText, setSearchText] = useState("");
	const [searchResult, setSearchResult] = useState(Array<ICity>);
	const allWeathers = useAppSelector(selectAllWeathers);

	const searchTextChanged = (newText: string) => setSearchText(newText);

	useEffect(() => {
		if (searchText)
			CountryStateCities()
				.searchCities(searchText, allWeathers)
				.then((result) => setSearchResult(result));
		else setSearchResult([]);
	}, [searchText]);

	return (
		<View style={styles.container}>
			<OpenTextStyled style={[styles.title]}>Gerenciar cidades</OpenTextStyled>

			<View
				style={styles.separator}
				lightColor="#eee"
				darkColor="rgba(255,255,255,0.1)"
			/>

			<Searchbar
				placeholder="Inserir cidades"
				backgroundColor={colorScheme === "light" ? "#FAFAFA" : "#333333"}
				onChangeText={searchTextChanged}
			/>

			<CitiesList searchResultList={searchResult} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
		alignItems: "center",
		padding: 18,
	},
	title: {
		fontSize: 26,
		fontWeight: "bold",
	},
	separator: {
		marginVertical: 18,
		height: 1,
		width: "80%",
	},
});
