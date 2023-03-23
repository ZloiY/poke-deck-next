import { useEffect, useState } from "react";

import { accessTokenStorage, sessionStorage } from "../services/authStorage";
import type { Token } from "../utils/token";

export const useAuth = () => {
  const [session, setSession] = useState<Token | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const unsub1 = accessTokenStorage.subscribe(setAccessToken);
    const unsub2 = sessionStorage.subscribe(setSession);
    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  return { session, accessToken, setAccessToken, setSession };
};
