import WeatherText from "./WeatherText";

import Colors from "@/constants/Colors";
import { DateTimeService } from "@/services/DateTimeService";

interface IProps {
  date: string;
}

export default function TimeAgo({ date }: IProps) {
  const color = Colors["home"];
  return (
    <WeatherText
      style={{
        fontSize: 14,
      }}
      color={color.subtitle}
    >
      {DateTimeService.formatTimeDistance(date)}
    </WeatherText>
  );
}
