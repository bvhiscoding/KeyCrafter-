import { useState, useCallback } from "react";

/**
 * useDisclosure — manage open/close state for modals, drawers, dropdowns
 * @param {boolean} [initial=false]
 */
const useDisclosure = (initial = false) => {
  const [isOpen, setIsOpen] = useState(initial);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  return { isOpen, open, close, toggle };
};

export default useDisclosure;
