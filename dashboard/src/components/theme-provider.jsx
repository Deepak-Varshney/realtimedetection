'use client'

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeProvider({ children, ...props }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Ensure this is client-side only
  }, []);

  if (!mounted) {
    return <>{children}</>; // Don't render anything until mounted on the client
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
