import { observer, useObservable } from "@legendapp/state/react";
import { randomUUID } from "expo-crypto";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Button, StyleSheet, TextInput, View } from "react-native";
import { store$ } from "../../lib/store";

function Comments() {
  const { postId } = useLocalSearchParams<{ postId: string }>();

  const router = useRouter();
  const data = useObservable({
    comment: "",
    author: "",
  });

  const handleCommentUpdate = () => {
    const id = randomUUID();

    store$.comments[id].set({
      postId: postId,
      author: data.author.get(),
      content: data.comment.get(),
      id,
      createdAt: null, // this will be updated by the server
      updatedAt: null, // this will be updated by the server
    });
    router.back();
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Create a comment",
          headerBackTitleVisible: false,
        }}
      />
      <TextInput
        onChangeText={(t) => data.comment.set(t)}
        style={styles.input}
        placeholder="Comment"
      />
      <TextInput
        onChangeText={(t) => data.author.set(t)}
        style={styles.input}
        placeholder="Author"
      />
      <Button title="Create Comment" onPress={() => handleCommentUpdate()} />
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
export default observer(Comments);
