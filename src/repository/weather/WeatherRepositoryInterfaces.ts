export interface IKeyValueStorage<T> {
  set: (key: string, value: T) => Promise<void>;
  get: () => Promise<T[]>;
  delete: (key: string) => Promise<void>;
}

export interface IPreferenceValue<T> {
  setPreference: (value: T) => Promise<void>;
  getPreference: () => Promise<T | null>;
  removePreference: (nextPreference?: T) => Promise<void>;
}
