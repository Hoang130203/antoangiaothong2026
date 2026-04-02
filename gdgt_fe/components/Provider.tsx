"use client";
import { SessionProvider } from "next-auth/react";
import React, { ReactNode } from "react";
import { ThemeProvider } from "@/contexts/ThemeContext";

interface Props {
  children: ReactNode;
}

const Providers = (props: Props) => {
  return (
    <SessionProvider>
      <ThemeProvider>
        {props.children}
      </ThemeProvider>
    </SessionProvider>
  );
};

export default Providers;
