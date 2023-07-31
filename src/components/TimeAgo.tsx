import { formatDistanceToNow,Locale, parseISO } from "date-fns"
import { OpenText } from "./StyledText"

const localeTranslated = {
    code:'pt',
    formatDistance:(message:string,num:number) => { 
                       
        message = message.replace(/about/i,'Há')        
        message = message.replace(/lessThanXMinutes/i,'Há poucos segundos')

        message = message.replace(/Hours/i,'Hora')
        message = message.replace(/Minutes/i,'minuto')
        message = message.replace(/Month/i,'mês')
        message = message.replace(/Year/i,'ano')
        
        if (num > 1){                             
            message = message.replace('mês','mese')
            message += 's'
        }
        return message.replace(/x/i,` ${num} `) + ' atrás'
    }                   
} as Locale

export default function TimeAgo({dateIsoFormat}:{dateIsoFormat:string}) {

    const formatDate = () => {
        try {
            const dateFormat = parseISO(dateIsoFormat)
            return formatDistanceToNow(dateFormat,{locale:localeTranslated})
        } catch (error:any) {
            console.log(error.message);            
        }

        return ''
    }
    

   
    return (
        <OpenText style={{
            fontSize:14,
            color:'#fff',
            opacity:0.8
        }}>
            {formatDate()}  
        </OpenText>
    )        
}