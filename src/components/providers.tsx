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
      <ChakraProvider value={defaultSystem}>
        <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem={false}>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </ThemeProvider>
      </ChakraProvider>
    </Provider>
  );
};
