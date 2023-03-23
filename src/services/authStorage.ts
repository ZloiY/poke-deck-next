import type { Token } from "../utils/token";
import { decodeToken } from "../utils/token";

const createSubStorage = <T>(initialValue: T | null) => {
  let storage = initialValue;
  const subs = new Map<string, Function>();

  const setValue = (value: T) => {
    storage = value;
    const currentSubs = [...subs.values()];
    currentSubs.forEach((callback) => {
      callback(value);
    });
  };

  const resetStorage = () => {
    storage = null;
    const currentSubs = [...subs.values()];
    currentSubs.forEach((callback) => {
      callback(null);
    });
  };

  const subscribe = (func: (token: T) => void): (() => void) => {
    subs.set(func.toString(), func);
    if (storage) {
      func(storage);
    }
    return () => {
      subs.delete(func.toString());
    };
  };

  return { storage, setValue, subscribe, resetStorage };
};
const access_token =
  typeof window !== "undefined"
    ? localStorage.getItem("poke_deck_next_token")
    : null;
export const accessTokenStorage = createSubStorage(access_token);
export const sessionStorage = createSubStorage<Token>(
  access_token ? decodeToken(access_token) : null,
);

export const setSession = sessionStorage.setValue;
export const setAccessToken = (token: string) => {
  localStorage.setItem("poke_deck_next_token", token);
  accessTokenStorage.setValue(token);
};
export const resetSession = sessionStorage.resetStorage;
export const resetAccessToken = () => {
  accessTokenStorage.resetStorage();
  localStorage.removeItem("poke_deck_next_token");
};
