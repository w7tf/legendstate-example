import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { ThemedText } from "@/components/ThemedText";
import { observer } from "@legendapp/state/react";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { store$ } from "../lib/store";

function Posts() {
  const { postId } = useLocalSearchParams<{ postId: string }>();

  const post = store$.posts[postId].get();

  const comments = Object.values(store$.comments.get()).filter(
    (c) => c.postId === postId
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
        {post.createdAt && (
          <ThemedText>
            Created at: {new Date(post.createdAt).toLocaleString()}
          </ThemedText>
        )}
        {post.updatedAt && (
          <ThemedText>
            Updated at: {new Date(post.updatedAt).toLocaleString()}
          </ThemedText>
        )}
      </View>
      <View style={styles.commentsContainer}>
        <View style={styles.commentsHeadingContainer}>
          <ThemedText style={styles.heading}>Comments:</ThemedText>
          <Link href={`/comments/create/${postId}`} asChild>
            <TabBarIcon name={"create"} />
          </Link>
        </View>
        {comments.map((comment) => (
          <View key={comment.id} style={styles.commentContainer}>
            <View>
              <ThemedText>
                {comment.content} ({comment.author})
              </ThemedText>
              {comment.createdAt && (
                <ThemedText>
                  Created at: {new Date(comment.createdAt).toLocaleString()}
                </ThemedText>
              )}
              {comment.updatedAt && (
                <ThemedText>
                  Updated at: {new Date(comment.updatedAt).toLocaleString()}
                </ThemedText>
              )}
            </View>
            <View>
              <Link href={`/comments/update/${comment.id}`} asChild>
                <TabBarIcon name={"pencil"} />
              </Link>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  commentsHeadingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  commentContainer: {
    padding: 8,
    justifyContent: "space-between",
    rowGap: 12,
    alignContent: "center",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
  },
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
