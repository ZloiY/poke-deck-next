import { useRouter } from "next/router";
import { useState, useEffect } from "react";

type LoadingState = "Started" | "Finished" | "Hold";

export const useLoadingState = () => {
  const router = useRouter();
  const [loadingState, setLoadingState] = useState<LoadingState>("Hold");

  useEffect(() => {
    const loadStarted = () => {
      setLoadingState("Started");
    };
    const loadCompleted = () => {
      setLoadingState("Finished");
    };

    router.events.on("routeChangeStart", loadStarted);
    router.events.on("routeChangeError", loadCompleted);
    router.events.on("routeChangeComplete", loadCompleted);
    return () => {
      router.events.off("routeChangeStart", loadStarted);
      router.events.off("routeChangeError", loadCompleted);
      router.events.off("routeChangeComplete", loadCompleted);
    };
  }, [router]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (loadingState == "Finished") {
      timeoutId = setTimeout(() => {
        setLoadingState("Hold");
      }, 500);
    }
    return () => {
      timeoutId && clearTimeout(timeoutId);
    };
  }, [loadingState]);

  return loadingState;
}