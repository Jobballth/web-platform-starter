"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
// ลบ /dist/types ออก ให้เหลือแค่ "next-themes"
import { type ThemeProviderProps } from "next-themes"; 

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}