import { observer, useObservable } from "@legendapp/state/react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Button, StyleSheet, TextInput, View } from "react-native";
import { store$ } from "../../lib/store";

function editPost() {
  const router = useRouter();
  const { postId } = useLocalSearchParams<{ postId: string }>();

  const post$ = store$.posts[postId];

  const data$ = useObservable({
    title: post$.title.get(),
    content: post$.content.get(),
    author: post$.author.get(),
  });

  const handleUpdatePost = () => {
    post$.assign({
      title: data$.title.get(),
      content: data$.content.get(),
      author: data$.author.get(),
    });
    router.push("/posts");
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Update Post",
        }}
      />
      <TextInput
        value={data$.title.get()}
        onChangeText={(t) => data$.title.set(t)}
        style={styles.input}
        placeholder="Title"
      />
      <TextInput
        value={data$.content.get()}
        onChangeText={(t) => data$.content.set(t)}
        style={styles.input}
        placeholder="Content"
      />
      <TextInput
        value={data$.author.get()}
        onChangeText={(t) => data$.author.set(t)}
        style={styles.input}
        placeholder="Author"
      />
      <Button title="Edit post" onPress={() => handleUpdatePost()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 6,
  },
  input: {
    padding: 8,
    borderRadius: 4,
    margin: 8,
    borderWidth: 1,
    borderColor: "gray",
  },
});

export default observer(editPost);
