import { useEffect } from "react";

export default function useNavigationGuard(enabled = true) {
  /*
  |--------------------------------------------------------------------------
  | Prevent Refresh / Tab Close
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = (event) => {
      event.preventDefault();

      // Required for Chrome
      event.returnValue = "";
    };

    window.addEventListener(
      "beforeunload",
      handleBeforeUnload
    );

    return () => {
      window.removeEventListener(
        "beforeunload",
        handleBeforeUnload
      );
    };
  }, [enabled]);

  /*
  |--------------------------------------------------------------------------
  | Prevent Browser Back Button
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    if (!enabled) return;

    // Push current state
    window.history.pushState(
      null,
      "",
      window.location.href
    );

    const handlePopState = () => {
      window.history.pushState(
        null,
        "",
        window.location.href
      );

      alert(
        "You cannot leave the quiz while it is in progress."
      );
    };

    window.addEventListener(
      "popstate",
      handlePopState
    );

    return () => {
      window.removeEventListener(
        "popstate",
        handlePopState
      );
    };
  }, [enabled]);
}