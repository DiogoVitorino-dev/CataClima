import { ICity } from "country-state-city";
import React from "react";

import SearchListItem from "./SearchListItem";
import List from "../shared/List";

interface IProps {
  data: ICity[];
  onSelectedCity: (value: ICity) => void;
}

export default function SearchList({ data, onSelectedCity }: IProps) {
  return (
    <List
      data={data}
      renderItem={({ item }) => (
        <SearchListItem data={item} onPress={onSelectedCity} />
      )}
    />
  );
}
