import axios, { Axios } from "axios";

export default class WeatherAxios {
  instance: Axios;

  constructor() {
    const baseURL = process.env.EXPO_PUBLIC_OPEN_WEATHER_URL;
    const apiKey = process.env.EXPO_PUBLIC_OPEN_WEATHER_APIKEY;

    if (!baseURL || !apiKey) {
      throw new Error("baseUrl / apiKey not found in environment variables");
    }

    this.instance = axios.create({
      baseURL,
    });

    this.setRequestInterceptor();
  }

  private setRequestInterceptor() {
    this.instance.interceptors.request.use((config) => {
      const apiKey = process.env.EXPO_PUBLIC_OPEN_WEATHER_APIKEY;

      if (!apiKey) {
        throw new Error("apiKey not found in environment variables");
      }

      config.url += `&appid=${apiKey}&units=metric&lang=pt_br`;

      return config;
    });
  }
}
