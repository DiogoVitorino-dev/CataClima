import axios, { Axios } from "axios";

export default class WeatherAxios {
	instance: Axios;

	constructor() {
		const baseURL = "https://api.openweathermap.org/data/2.5";
		const apiKey = "1c4e387c9afbeee083b5f3a68b62c8c0";

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
			const apiKey = "1c4e387c9afbeee083b5f3a68b62c8c0";

			if (!apiKey) {
				throw new Error("apiKey not found in environment variables");
			}

			config.url += `&appid=${apiKey}&units=metric&lang=pt_br`;

			console.log(config.url);

			return config;
		});
	}
}
