import { observer, useObservable } from "@legendapp/state/react";
import { randomUUID } from "expo-crypto";
import { Stack, useRouter } from "expo-router";
import { Button, StyleSheet, TextInput, View } from "react-native";
import { store$ } from "../lib/store";

function createPost() {
  const router = useRouter();
  const data = useObservable({
    title: "",
    content: "",
    author: "",
  });

  const handleCreatePost = () => {
    store$.posts.push({
      author: data.author.get(),
      content: data.content.get(),
      title: data.title.get(),
      id: randomUUID(),
      createdAt: null, // this will be updated by the server
      updatedAt: null, // this will be updated by the server
    });
    router.push("/tutorial");
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Create Post",
        }}
      />
      <TextInput
        onChangeText={(t) => data.title.set(t)}
        style={styles.input}
        placeholder="Title"
      />
      <TextInput
        onChangeText={(t) => data.content.set(t)}
        style={styles.input}
        placeholder="Content"
      />
      <TextInput
        onChangeText={(t) => data.author.set(t)}
        style={styles.input}
        placeholder="Author"
      />
      <Button title="Create Post" onPress={() => handleCreatePost()} />
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

export default observer(createPost);
