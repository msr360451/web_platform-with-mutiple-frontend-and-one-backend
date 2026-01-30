import "./globals.css";
import LayoutWrapper from "../components/LayoutWrapper";

export const metadata = {
  title: "Web Platform | Modern Business Solutions",
  description:
    "Contact & Admin Platform - Streamline your business communications",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white text-slate-900 dark:bg-black dark:text-slate-100">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
