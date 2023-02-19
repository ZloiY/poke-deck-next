import { useAtom } from "jotai"
import { getFlipState } from "../components/FlipButton"

export const useFlipState = () => {
  const [flipState] = useAtom(getFlipState);

  return flipState;
}