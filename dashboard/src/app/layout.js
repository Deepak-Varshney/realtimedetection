import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import Header from '@/components/Header';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';

export const metadata = {
  title: 'Dashboard',
  description: 'Manage support tickets and payments',
};

export default function RootLayout({ children }) {
  return (

    <html lang="en" suppressHydrationWarning>
      <ClerkProvider>
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </ClerkProvider >
    </html>
  );
}