export type EventTypes = {
  dashboardMessage: { from: string; text: string };
  themeChange: 'light' | 'dark';
  userUpdated: { id: number; name: string };
};

type Callback<T> = (value: T) => void;

const eventsStore = new Map<keyof EventTypes, any>();
const subscribers = new Map<keyof EventTypes, Set<Callback<any>>>();

export const emit = <K extends keyof EventTypes>(key: K, value: EventTypes[K]) => {
  eventsStore.set(key, value);
};

export const subscribe = <K extends keyof EventTypes>(key: K, callback: Callback<EventTypes[K]>) => {
  if (!subscribers.has(key)) {
    subscribers.set(key, new Set());
  }
  (subscribers.get(key) as Set<Callback<EventTypes[K]>>).add(callback);

  if (eventsStore.has(key)) {
    callback(eventsStore.get(key));
  }
};

export const unsubscribe = <K extends keyof EventTypes>(key: K) => {
  if (!subscribers.has(key)) return;
  subscribers.delete(key);
};
