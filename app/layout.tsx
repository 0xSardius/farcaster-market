import "./globals.css";
import { ProvidersClean as Providers } from "./providers-clean";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Farcaster Market",
  description: "The fastest way to trade NFTs without leaving Farcaster",
  openGraph: {
    title: "Farcaster Market",
    description: "The fastest way to trade NFTs without leaving Farcaster",
    url: "https://fcmarket.xyz",
    siteName: "Farcaster Market",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
