import { observable } from "@legendapp/state";
import { observablePersistAsyncStorage } from "@legendapp/state/persist-plugins/async-storage";
import { configureSynced } from "@legendapp/state/sync";
import { syncedCrud } from "@legendapp/state/sync-plugins/crud";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api, RouterOutputs } from "./trpc";
import { randomUUID } from "expo-crypto";

const synced = configureSynced(syncedCrud, {
  fieldUpdatedAt: "updatedAt",
  fieldCreatedAt: "createdAt",
  fieldId: "id",
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
    as: "object",
    initial: {} as Record<string, RouterOutputs["posts"]["list"][number]>,
    list: async ({ lastSync }) => await api.posts.list.query({ lastSync }),
    create: async (input) => {
      return await api.posts.create.mutate(input);
    },
    update: async (input) => await api.posts.update.mutate(input),
    changesSince: "last-sync",
    mode: "merge",
    persist: {
      name: "posts",
    },
  }),
  comments: synced({
    as: "object",
    initial: {} as Record<string, RouterOutputs["comments"]["list"][number]>,
    list: async ({ lastSync }) => await api.comments.list.query({ lastSync }),
    create: async (input) => {
      return await api.comments.create.mutate(input);
    },
    update: async (input) => await api.comments.update.mutate(input),
    generateId: () => randomUUID(),
    changesSince: "last-sync",
    mode: "merge",
    persist: {
      name: "comments",
    },
  }),
});
