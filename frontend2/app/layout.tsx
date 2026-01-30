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
    <html lang="en">
      <body className="bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 text-gray-900 min-h-screen">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
