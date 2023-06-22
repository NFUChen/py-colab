import { useEffect, useState } from "react";

export const BlinkingCursor = () => {
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setShowCursor(prevShowCursor => !prevShowCursor);
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return <span className={`${showCursor ? "opacity-100" : "opacity-0"}`}>|</span>;
};
