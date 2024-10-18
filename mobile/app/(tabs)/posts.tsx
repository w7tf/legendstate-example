import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { For, observer } from "@legendapp/state/react";
import { StyleSheet, Button } from "react-native";
import { store$ } from "../lib/store";
import { Link } from "expo-router";

function TabThreeScreen() {
  const posts = store$.posts;

  return (
    <ThemedView style={styles.container}>
      <For each={posts}>
        {(post) => (
          <Link href={`/posts/${post.id.get()}`}>
            <ThemedText key={post.id.get()}>
              {post.title.get()}
            </ThemedText>
          </Link>
        )}
      </For>
      <Link href={"/posts/create"} asChild>
        <Button title="Create new post" />
      </Link>
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
