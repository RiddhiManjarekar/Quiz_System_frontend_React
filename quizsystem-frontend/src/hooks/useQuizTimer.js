import { useEffect, useMemo, useRef, useState } from "react";

export default function useQuizTimer({
  initialSeconds,
  onExpire,
}) {
  const [remainingSeconds, setRemainingSeconds] =
    useState(initialSeconds);

  const expiredRef = useRef(false);

  /*
  |--------------------------------------------------------------------------
  | Reset timer whenever quiz changes
  |--------------------------------------------------------------------------
  */

 // useQuizTimer.js
useEffect(() => {
  // Don't reset if we have a server-provided time
  if (initialSeconds !== undefined) {
    setRemainingSeconds(initialSeconds);
    expiredRef.current = false;
  }
}, [initialSeconds]);

  /*
  |--------------------------------------------------------------------------
  | Countdown
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (remainingSeconds <= 0) {
      if (!expiredRef.current) {
        expiredRef.current = true;

        if (onExpire) {
          onExpire();
        }
      }

      return;
    }

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingSeconds, onExpire]);

  /*
  |--------------------------------------------------------------------------
  | Derived Values
  |--------------------------------------------------------------------------
  */

  const minutes = Math.floor(
    remainingSeconds / 60
  );

  const seconds = remainingSeconds % 60;

  const formattedTime = useMemo(() => {
    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  }, [minutes, seconds]);

  /*
  |--------------------------------------------------------------------------
  | Warning States
  |--------------------------------------------------------------------------
  */

  const isWarning = remainingSeconds <= 300;

  const isCritical = remainingSeconds <= 60;

  const progressPercentage = useMemo(() => {
    if (!initialSeconds) return 0;

    return (
      (remainingSeconds / initialSeconds) * 100
    );
  }, [
    remainingSeconds,
    initialSeconds,
  ]);

  return {
    remainingSeconds,

    formattedTime,

    progressPercentage,

    isWarning,

    isCritical,
  };
}