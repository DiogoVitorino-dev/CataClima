import { parseISO } from 'date-fns';

export function DatetimeUtils() {
	const getDayOfWeek = (datetime:string) => { 
		switch (parseISO(datetime).getDay()) {    
		case 0: return 'Domingo';                
		case 1: return 'Segunda - feira';
		case 2: return 'terça - feira';
		case 3: return 'quarta - feira';
		case 4: return 'quinta - feira';
		case 5: return 'sexta - feira';
		default: return 'sábado';
		}
	};
      
	const isNight = (datetime:string) => parseISO(datetime).getHours() >= 18; 

	return {getDayOfWeek,isNight};
}