import { useEffect, useRef, type MouseEvent, type ReactNode } from "react";
import { twx } from "../../utils";

const modalStyles = {
  modalMask: {
    box: "fixed top-0 left-0 z-10 w-screen h-screen bg-black/50",
  },

  modalContainer: {
    position:
      "z-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
    box: "w-72 h-64 p-4 bg-white rounded-2xl shadow-md",
  },
};

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

export default function Modal(props: ModalProps) {
  const { open, onClose, children } = props;
  const modalRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const modalEl = modalRef.current;
    const maskEl = maskRef.current;
    if (open && modalEl && maskEl) {
      [maskEl, modalEl].forEach((el) =>
        el.animate(
          [
            {
              opacity: "0",
            },
            {},
          ],
          { duration: 100 },
        ),
      );
    }
  }, [open]);

  const onMaskClickAnimationClose = (e: MouseEvent) => {
    const { clientX, clientY, target } = e;

    const modalEl = modalRef.current;
    const maskEl = maskRef.current;
    if (!modalEl || target !== maskEl) return;

    const duration = 200;
    maskEl.animate(
      [
        {
          opacity: 1,
        },
        {
          opacity: 0,
        },
      ],
      {
        duration,
        fill: "forwards",
      },
    );

    modalEl.animate(
      [
        {},
        {
          top: `${clientY}px`,
          left: `${clientX}px`,
          width: "0px",
          height: "0px",
          opacity: "0",
        },
      ],
      {
        duration,
        easing: "linear",
        fill: "forwards",
      },
    );

    modalEl.replaceChildren("");
    setTimeout(() => {
      onClose();
    }, duration);
  };

  if (!open) return null;

  return (
    <div className="Modal">
      <div
        ref={maskRef}
        className={twx(modalStyles.modalMask)}
        onClick={onMaskClickAnimationClose}
      >
        <div ref={modalRef} className={twx(modalStyles.modalContainer)}>
          {children}
        </div>
      </div>
    </div>
  );
}
