import { Locale } from "date-fns";

export const LocaleDatefns_BR: Locale = {
  code: "pt",
  formatDistance: (message: string, num: number) => {
    message = message.replace(/about/i, "Há");
    message = message.replace(/lessThanXMinutes/i, "Há poucos segundos");

    message = message.replace(/Hours/i, "Hora");
    message = message.replace(/Minutes/i, "minuto");
    message = message.replace(/Days/i, "dia");
    message = message.replace(/Weeks/i, "semana");
    message = message.replace(/Month/i, "mês");
    message = message.replace(/Year/i, "ano");

    if (num > 1) {
      message = message.replace("mês", "mese");
      message += "s";
    }
    return message.replace(/x/i, ` ${num} `) + " atrás";
  },
};
