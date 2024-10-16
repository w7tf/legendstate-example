import { ThemedText } from "@/components/ThemedText";
import { Stack, useLocalSearchParams } from "expo-router";
import { Button, ScrollView, StyleSheet, View } from "react-native";
import { store$ } from "../lib/store";
import { observer } from "@legendapp/state/react";

function Posts() {
  const { postId } = useLocalSearchParams<{ postId: string }>();

  const post = store$.posts
    .get()
    .filter((post) => post.id.toString() === postId)[0];

  const comments = store$.comments.filter(
    (comment) => comment.postId.get() === post.id
  );

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          title: `Post ${post.id}`,
        }}
      />
      <View style={styles.separator}>
        <ThemedText style={styles.heading}>{post.title}</ThemedText>
        <ThemedText>{post.author}</ThemedText>
        <ThemedText>{post.content}</ThemedText>
        <ThemedText>
          Created at: {new Date(post.createdAt).toLocaleString()}
        </ThemedText>
        <ThemedText>
          Updated at: {new Date(post.updatedAt).toLocaleString()}
        </ThemedText>
      </View>
      <View style={styles.commentsContainer}>
        <ThemedText style={styles.heading}>Comments:</ThemedText>
        {comments.map((comment) => (
          <View key={comment.id.get()}>
            <ThemedText>
              {comment.content.get()} ({comment.author.get()})
            </ThemedText>
            <ThemedText>
              Created at: {new Date(comment.createdAt.get()).toLocaleString()}
            </ThemedText>
            <ThemedText>
              Updated at: {new Date(comment.updatedAt.get()).toLocaleString()}
            </ThemedText>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  commentsContainer: {
    paddingVertical: 16,
    gap: 8,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
  },
  separator: {
    gap: 8,
  },
  container: {
    flex: 1,
    padding: 6,
  },
});

export default observer(Posts);
