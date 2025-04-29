import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import Header from '@/components/Header';
import { Toaster } from '@/components/ui/sonner';
// import { ThemeProvider } from '@/components/theme-provider';

export const metadata = {
  title: 'Dashboard',
  description: 'Manage support tickets and payments',
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      {/* <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      > */}
        <html lang="en">
          <body>
            <Header />
            {children}
            <Toaster />
          </body>
        </html>
      {/* </ThemeProvider> */}
    </ClerkProvider>
  );
}