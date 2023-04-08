import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { accessTokenStorage, resetAccessToken, resetSession, sessionStorage } from "../services/authStorage";
import type { Token } from "../utils/token";

export const useAuth = () => {
  const [session, setSession] = useState<Token | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsub1 = accessTokenStorage.subscribe(setAccessToken);
    const unsub2 = sessionStorage.subscribe(setSession);
    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  useEffect(() => {
    if ((session?.exp ?? 0) < Date.now()) {
      resetSession();
      resetAccessToken();
      router.reload();
    }
  }, [session]);

  return { session, accessToken, setAccessToken, setSession };
};
