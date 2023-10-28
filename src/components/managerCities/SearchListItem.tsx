import { ICity } from "country-state-city";
import React from "react";

import ItemList from "../shared/ItemList";

interface IProps {
  data: ICity;
  onPress: (data: ICity) => void;
}

export default function SearchListItem({ data, onPress }: IProps) {
  return (
    <ItemList
      title={data.name}
      subtitle={`${data.stateCode} - ${data.countryCode}`}
      onPress={() => onPress(data)}
    />
  );
}
