import Arrow from "@icons/arrow-left.svg";

export const PaginationButtons = ({
  onNextPage,
  onPrevPage,
  showNext,
  showPrev,
}: Partial<{
  onNextPage: () => void;
  onPrevPage: () => void;
  showNext: boolean;
  showPrev: boolean;
}>) => {
  const nextClicked = () => {
    onNextPage?.();
  };

  const prevClicked = () => {
    onPrevPage?.();
  };

  return (
    <>
      {showPrev && (
        <div
          className="hidden fixed -left-5 top-0 w-40 pl-5 h-full z-40 opacity-0
            lg:flex justify-center items-center
          transition-all duration-200 -translate-x-2/4 hover:translate-x-0 hover:opacity-100"
        >
          <div
            className="rounded-full bg-black/50 p-5 cursor-pointer hover:bg-black/80 active:scale-90"
            onClick={prevClicked}
          >
            <Arrow className="fill-white h-20 w-20" />
            <div />
          </div>
        </div>
      )}
      {showNext && (
        <div
          className="hidden fixed -right-5 top-0 w-40 pr-5 h-full z-40 opacity-0
          lg:flex justify-center items-center
          transition-all duration-200 translate-x-2/4 hover:translate-x-0 hover:opacity-100"
        >
          <div
            className="rounded-full bg-black/50 p-5 cursor-pointer hover:bg-black/80 active:scale-90"
            onClick={nextClicked}
          >
            <Arrow className="fill-white h-20 w-20 rotate-180" />
          </div>
        </div>
      )}
    </>
  );
};
