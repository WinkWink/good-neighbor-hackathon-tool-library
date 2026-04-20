import Link from "next/link";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Good Neighbor Tool Library",
  description: "Borrow tools from people near you",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/not2zby.css" />
      </head>
      <body>
        <header className="border-b">
          <Navbar />
        </header>

        <main className="mx-auto max-w-6xl p-6">{children}</main>
      </body>
    </html>
  );
}
