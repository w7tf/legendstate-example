import { observable } from "@legendapp/state";
import { syncedCrud } from "@legendapp/state/sync-plugins/crud";
import { api } from "./trpc";
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
});
