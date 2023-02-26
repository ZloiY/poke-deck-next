import { twMerge } from "tailwind-merge";
import { useLoadingState } from "../hooks"

export const PageLoader = () => {
  const loadingState = useLoadingState();

  return <div
  className={twMerge(
    "absolute h-[3px] left-0 top-0 bg-yellow-500 shadow-[0_0_15px_2px] shadow-yellow-300 transition-all ",
    loadingState == "Hold" && "w-0",
    loadingState == "Started" && "w-1/3 duration-1000 ease-in",
    loadingState == "Finished" && "w-full duration-500 ease-out",
  )}
></div>
}