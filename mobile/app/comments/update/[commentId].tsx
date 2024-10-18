import { observer, useObservable } from "@legendapp/state/react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Button, StyleSheet, TextInput, View } from "react-native";
import { store$ } from "../../lib/store";

function Comments() {
  const { commentId } = useLocalSearchParams<{
    commentId: string;
  }>();

  const router = useRouter();
  const comment$ = store$.comments[commentId];

  const data$ = useObservable({
    comment: comment$.get().content,
    author: comment$.get().author,
  });

  const handleCommentUpdate = () => {
    comment$.assign({
      content: data$.comment.get(),
      author: data$.author.get(),
    });

    router.back();
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Update comment",
          headerBackTitleVisible: false,
        }}
      />
      <TextInput
        onChangeText={(t) => data$.comment.set(t)}
        style={styles.input}
        value={data$.comment.get()}
        placeholder="Comment"
      />
      <TextInput
        onChangeText={(t) => data$.author.set(t)}
        style={styles.input}
        value={data$.author.get()}
        placeholder="Author"
      />
      <Button title="Update comment" onPress={() => handleCommentUpdate()} />
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
