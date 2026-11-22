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

  return (
    <Provider store={store}>
      {/* Keep next-themes outside Chakra so its hydration script is rendered in
          the same position on the server and on the client. */}
      <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem={false}>
        <ChakraProvider value={defaultSystem}>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </ChakraProvider>
      </ThemeProvider>
    </Provider>
  );
};
