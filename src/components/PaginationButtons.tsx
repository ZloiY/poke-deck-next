
import Arrow from "@icons/arrow-left.svg";

import { Switcher } from "./Switcher";

export const PaginationButtons = ({ onNextPage, onPrevPage, showNext, showPrev, hideSwitcher }: Partial<{
  onNextPage: () => void,
  onPrevPage: () => void,
  showNext: boolean,
  showPrev: boolean,
  hideSwitcher: boolean
}>) => (
  <>
    {showPrev && (
        <div
          className="fixed -left-5 top-0 w-40 pl-5 h-full z-40 opacity-0
            flex justify-center items-center
          transition-all duration-200 -translate-x-2/4 hover:translate-x-0 hover:opacity-100"
        >
          <div
            className="rounded-full bg-black/50 p-5 cursor-pointer hover:bg-black/80 active:scale-90"
            onClick={onPrevPage}
          >
            <Arrow className="fill-white h-20 w-20" />
            <div />
          </div>
        </div>
      )}
      {showNext && (
        <div
          className="fixed -right-5 top-0 w-40 pr-5 h-full z-40 opacity-0
          flex justify-center items-center
          transition-all duration-200 translate-x-2/4 hover:translate-x-0 hover:opacity-100"
        >
          <div
            className="rounded-full bg-black/50 p-5 cursor-pointer hover:bg-black/80 active:scale-90"
            onClick={onNextPage}
          >
            <Arrow className="fill-white h-20 w-20 rotate-180" />
          </div>
        </div>
      )}
      {showNext && showPrev && !hideSwitcher && (
        <div className="fixed bottom-20 -left-1 flex justify-center w-full z-20 hover:z-50">
          <Switcher
            onNext={onNextPage}
            onPrev={onPrevPage}
          />
        </div>
      )}
  </>
)