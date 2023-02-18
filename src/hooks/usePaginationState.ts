import { useAtom } from "jotai"
import { getPaginationState } from "../components/PaginationButtons"

export const usePaginationState = () => {
  const [state] = useAtom(getPaginationState);

  return state;
}