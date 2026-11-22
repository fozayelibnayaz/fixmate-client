"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import { store } from "@/store";
import { loadSession } from "@/store/auth";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    void store.dispatch(loadSession());
  }, []);

  // Keep role/plan in sync when a user returns to the tab after an admin or
  // another tab changed the account. This prevents stale upgrade/payment errors.
  useEffect(() => {
    const refresh = () => void store.dispatch(loadSession());
    const onVisibility = () => {
      if (document.visibilityState === "visible") refresh();
    };
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <Provider store={store}>
      {/* Keep next-themes outside Chakra so its hydration script is rendered in
          the same position on the server and on the client. */}
      <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem={false}>
        <ChakraProvider value={defaultSystem}>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </ChakraProvider>
      </ThemeProvider>
    </Provider>
  );
};
