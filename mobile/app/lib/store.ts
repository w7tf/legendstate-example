import { observable } from "@legendapp/state";
import { syncedCrud } from "@legendapp/state/sync-plugins/crud";
import { api } from "./trpc";

export const store$ = observable({
  ping: {
    data: syncedCrud({
      as: "value",
      get: async () => await api.ping.query(),
    }),
  },
});
