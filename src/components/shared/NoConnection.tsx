import { useNetInfo } from "@react-native-community/netinfo";
import React from "react";

import SimpleModal from "./SimpleModal";

import Strings from "@/constants/Strings";

export default function NoConnection() {
  const net = useNetInfo();

  return (
    <SimpleModal message={Strings.noConnection} visible={!net.isConnected} />
  );
}
