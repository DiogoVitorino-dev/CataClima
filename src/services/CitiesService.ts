import { City, ICity } from "country-state-city";

import { ICoordinates } from "@/models/WeatherModel";

const searchCitiesByName = async (searchText: string, country?: string) => {
  const reg = new RegExp(`^${searchText}`, "i");
  let list: ICity[] = [];

  if (country) {
    const citiesCountry = City.getCitiesOfCountry(country);
    if (citiesCountry) {
      list = citiesCountry;
    }
  }

  if (list.length === 0) {
    list = City.getAllCities();
  }

  return list
    .filter((value) => {
      if (value.longitude && value.latitude) return value.name.match(reg);
      return false;
    })
    .slice(0, 20);
};

const findCityByCoords = async (coords: ICoordinates) => {
  const list = City.getAllCities();

  const { latitude, longitude } = coords;

  return list.reduce((prev, curr) => {
    if (
      !curr.latitude ||
      !prev.latitude ||
      !curr.longitude ||
      !prev.longitude
    ) {
      return prev;
    }

    // diff between library coords and api coords
    const latCurrent = latitude - Number(curr.latitude);
    const latPrevious = latitude - Number(prev.latitude);

    const lonCurrent = longitude - Number(curr.longitude);
    const lonPrevious = longitude - Number(prev.longitude);

    //calc distance of zero and compare with previous item
    const latClosestToZero =
      Math.abs(latCurrent - 0) < Math.abs(latPrevious - 0);

    const lonClosestToZero =
      Math.abs(lonCurrent - 0) < Math.abs(lonPrevious - 0);

    //return the item closest to the api coords
    return latClosestToZero && lonClosestToZero ? curr : prev;
  });
};

function convertCountryCodeToName(countryCode: string) {
  return countryCode;
}

export const CitiesService = {
  searchCitiesByName,
  findCityByCoords,
  convertCountryCodeToName,
};
