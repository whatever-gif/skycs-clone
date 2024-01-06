import React from "react";

export type VisibilityControl = {
  set: React.Dispatch<React.SetStateAction<boolean>>;
  open: () => void;
  close: () => void;
  toggle: () => void;
  visible: boolean;
};

type Props = {
  defaultVisible?: boolean;
  onOpen?: Function;
  onClose?: Function;
};

export const useVisibilityControl = (props?: Props) => {
  const { defaultVisible, onOpen, onClose } = props ?? {};
  const [visible, setVisible] = React.useState(!!defaultVisible);

  const open = React.useCallback(() => {
    setVisible(true);
    onOpen?.();
  }, [onOpen]);

  const close = React.useCallback(() => {
    setVisible(false);
    onClose?.();
  }, [onClose]);

  const toggle = React.useCallback(() => {
    setVisible((prev) => {
      if (prev) {
        onClose?.();
      } else {
        onOpen?.();
      }

      return !prev;
    });
  }, [onClose, onOpen]);

  return React.useMemo<VisibilityControl>(
    () => ({ open, close, visible: visible, toggle, set: setVisible }),
    [open, close, visible, toggle]
  );
};
