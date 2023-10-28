import React from "react";

import UserListItem from "./UserListItem";
import List from "../shared/List";

import { useAppSelector } from "@/hooks/ReduxHooks";
import IWeather from "@/models/WeatherModel";
import { WeathersSelectors } from "@/store/weather/WeatherSelectors";

interface IProps<IWeather> {
  data: IWeather[];
  onSelectedCity: (value: IWeather) => void;
  onRemovedCity: (value: IWeather) => void;
}

export default function UserList({
  data,
  onRemovedCity,
  onSelectedCity,
}: IProps<IWeather>) {
  const weather = useAppSelector(WeathersSelectors.selectPreference);
  return (
    <List
      data={data}
      renderItem={({ item }) => (
        <UserListItem
          data={item}
          onPress={onSelectedCity}
          onPressDeleteButton={onRemovedCity}
          current={weather?.id === item.id}
        />
      )}
    />
  );
}
