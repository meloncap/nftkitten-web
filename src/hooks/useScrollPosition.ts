// useScrollPosition.js

import { useEffect, useState } from "react";

const useScrollPosition = (): [number, number, number] => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const updatePosition = () => {
      setScrollY(window.scrollY);
    }
    window.addEventListener("scroll", updatePosition);
    updatePosition();
    return () => window.removeEventListener("scroll", updatePosition);
  }, []);

  if (typeof document !== 'undefined' && document.documentElement) {
    return [scrollY, document.documentElement.scrollHeight, document.documentElement.clientHeight];
  }
  return [scrollY, 0, 0]
};

export default useScrollPosition;