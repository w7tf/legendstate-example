import { observable } from "@legendapp/state";
import { observablePersistAsyncStorage } from "@legendapp/state/persist-plugins/async-storage";
import { configureSynced } from "@legendapp/state/sync";
import { syncedCrud } from "@legendapp/state/sync-plugins/crud";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api, RouterOutputs } from "./trpc";

const synced = configureSynced(syncedCrud, {
  persist: {
    plugin: observablePersistAsyncStorage({
      AsyncStorage,
    }),
    retrySync: true, // Persist pending changes and retry
  },
  retry: {
    infinite: true, // Retry changes with exponential backoff
  },
});

export const store$ = observable({
  ping: synced({
    as: "value",
    get: async () => await api.ping.query(),
    persist: {
      name: "ping",
    },
  }),
  posts: synced({
    as: "array",
    initial: [] as RouterOutputs["posts"]["list"],
    list: async ({ lastSync }) => await api.posts.list.query({ lastSync }),
    create: async (input) => await api.posts.create.mutate(input),
    update: async (input) => await api.posts.update.mutate(input),
    onSaved: ({ saved }) => {
      const post = store$.posts
        .filter((post) => saved.id === post.id.get())[0]
        .get();
      post.updatedAt = saved.updatedAt;
      post.createdAt = saved.createdAt;
    },
    changesSince: "last-sync",
    fieldUpdatedAt: "updatedAt",
    fieldCreatedAt: "createdAt",
    fieldId: "id",
    mode: "merge",
    persist: {
      name: "posts",
    },
  }),
  comments: synced({
    as: "array",
    initial: [] as RouterOutputs["comments"]["list"],
    list: async ({ lastSync }) => await api.comments.list.query({ lastSync }),
    create: async (input) => await api.comments.create.mutate(input),
    update: async (input) => await api.comments.update.mutate(input),
    onSaved: ({ saved }) => {
      const comment = store$.comments
        .filter((comment) => saved.id === comment.id.get())[0]
        .get();
      comment.updatedAt = saved.updatedAt;
      comment.createdAt = saved.createdAt;
    },
    persist: {
      name: "comments",
    },
  }),
});
