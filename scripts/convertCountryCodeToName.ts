export default function convertCountryCodeToName (countryCode:string) {  
    const countryName = new Intl.DisplayNames(['pt','en'],{
      type:'region',
      languageDisplay:'standard',
      fallback:'code'
    })
    .of(countryCode)

  if (countryName) return countryName
  return ''
} 