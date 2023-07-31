export const Flags = {
	WeatherApiState: {
		RAINY: 'rain',
		SUNNY: 'clear',
		SNOW: 'snow',
		CLOUDY: 'clouds',
	},
	errors: {
		NOCONNECTION: 'connection/no-connection',
		LOCATIONPERMISSIONDENIED: 'user/permission-denied',
	},
	requestStatus: {
		IDLE:'request/idle',
		PENDING:'request/pending',
		SUCCESS:'request/success',
		FAILED:'request/failed',
	}
};
