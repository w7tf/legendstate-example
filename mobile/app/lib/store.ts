import { observable } from "@legendapp/state";
import { syncedCrud } from "@legendapp/state/sync-plugins/crud";
import { api, RouterOutputs } from "./trpc";
import { configureSynced } from "@legendapp/state/sync";
import { observablePersistAsyncStorage } from "@legendapp/state/persist-plugins/async-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
    persist: {
      name: "posts",
    },
  }),
  comments: synced({
    as: "array",
    initial: [] as RouterOutputs["comments"]["list"],
    list: async ({ lastSync }) => await api.comments.list.query({ lastSync }),
    persist: {
      name: "comments",
    },
  }),
});
