import type {Metadata} from 'next';
import './globals.css'; // Global styles
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: 'GBiblio',
  description: 'Your personal library, beautifully organized.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
