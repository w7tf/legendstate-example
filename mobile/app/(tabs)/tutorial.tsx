import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { observer } from "@legendapp/state/react";
import { StyleSheet } from "react-native";
import { store$ } from "../lib/store";

function TabThreeScreen() {
  const res = store$.ping.get();

  console.log(res);

  return (
    <ThemedView style={styles.container}>
      <ThemedText>Tab</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});

export default observer(TabThreeScreen);
