import { formatDistanceToNow, isAfter, parseISO } from "date-fns";

import { LocaleDatefns_BR } from "./LocaleDatefns_BR";

import Strings from "@/constants/Strings";

const getDayOfWeek = (dateTime: string): string => {
  switch (parseISO(dateTime).getDay()) {
    case 0:
      return Strings.daysOfWeek.sun;
    case 1:
      return Strings.daysOfWeek.mon;
    case 2:
      return Strings.daysOfWeek.tue;
    case 3:
      return Strings.daysOfWeek.wed;
    case 4:
      return Strings.daysOfWeek.thu;
    case 5:
      return Strings.daysOfWeek.fri;
    default:
      return Strings.daysOfWeek.sat;
  }
};

const isNight = (current: string, sunset: string) =>
  isAfter(parseISO(current), parseISO(sunset));

const formatTimeDistance = (date: string) => {
  const dateFormat = parseISO(date);
  return formatDistanceToNow(dateFormat, { locale: LocaleDatefns_BR });
};

export const DateTimeService = {
  getDayOfWeek,
  formatTimeDistance,
  isNight,
};
