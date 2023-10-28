import React, { useEffect, useState } from "react";
import { FlatList, ListRenderItem, Platform, StyleSheet } from "react-native";

import Divider from "../shared/Divider";

interface IProps<T> {
  data: T[];
  renderItem: ListRenderItem<T>;
}

export default function List<Type>({ data, renderItem }: IProps<Type>) {
  const [listData, setListData] = useState(data);

  useEffect(() => setListData(data), [data]);

  return (
    <FlatList
      data={listData}
      style={styles.list}
      contentContainerStyle={styles.contentContainerStyle}
      persistentScrollbar={Platform.OS === "web"}
      ItemSeparatorComponent={() => Divider({})}
      renderItem={renderItem}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    width: "100%",
    flex: 1,
    maxWidth: 500,
  },
  contentContainerStyle: {
    borderRadius: 5,
  },
});
