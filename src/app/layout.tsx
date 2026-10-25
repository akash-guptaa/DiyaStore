import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Premium Diya Store - Light Up Every Moment",
  description: "Discover beautiful diyas that bring warmth, tradition, and elegance.",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.has('admin_token');

  return (
    <html lang="en">
      <body className="antialiased bg-stone-50 text-stone-900 font-sans min-h-screen flex flex-col">
        <CartProvider>
          <Header isAdmin={isAdmin} />
          <div className="flex-1">
            {children}
          </div>
          <Footer />
          <WhatsAppWidget />
        </CartProvider>
      </body>
    </html>
  );
}
