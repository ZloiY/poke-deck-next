import { atom, useAtom } from "jotai";
import { ReactNode, useEffect } from "react";
import ReactModal from "react-modal";

import Close from "@icons/close.svg";
import { a, config, useSpring } from "@react-spring/web";

export const isModalShown = atom(false);

ReactModal.setAppElement("main");

export const ModalContainer = ({
  title = "",
  children,
  onClose,
}: {
  children: (onClose: () => void) => ReactNode;
  onClose?: () => void;
  title?: string;
}) => {
  const [modalState, toggleModal] = useAtom(isModalShown);

  const [style, api] = useSpring(
    () => ({
      from: { opacity: 0, scale: 0 },
      to: [{ opacity: 1, scale: 1 }],
      reset: true,
      config: config.stiff,
    }),
    [modalState],
  );

  const onRequestClose = () => {
    api.start({
      from: { opacity: 1, scale: 1 },
      to: { opacity: 0, scale: 0 },
      config: {
        ...config.stiff,
        duration: 100,
      },
    });
    const timeoutId = setTimeout(() => {
      toggleModal(false);
      onClose?.();
      clearTimeout(timeoutId);
    }, 100);
  };

  return (
    <ReactModal
      parentSelector={() => document.getElementById("main")!}
      isOpen={modalState}
      overlayClassName="fixed inset-0 bg-transparent backdrop-blur z-[100] flex justify-center items-center"
      className="static outline-none"
      onRequestClose={onRequestClose}
    >
      <a.div
        style={style}
        className="bg-purple-900 text-white rounded-xl flex flex-col relative p-3 opacity-0"
      >
        <div className="flex justify-between">
          <span className="text-2xl font-coiny">{title}</span>
          <Close
            className="cursor-pointer w-8 h-8 hover:text-yellow-400"
            onClick={onRequestClose}
          />
        </div>
        {children(onRequestClose)}
      </a.div>
    </ReactModal>
  );
};
