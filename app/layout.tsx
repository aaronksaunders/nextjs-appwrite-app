import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import { get } from "http";
import { getLoggedInUser } from "./services/appwrite";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

// const BUCKET_ID = "TEST-BUCKET-1";

// let client = new Client();
// client
//   .setEndpoint("https://cloud.appwrite.io/v1")
//   .setProject("6619eaae96b93b6c00ea")
//   .setPlatform("com.ci.appwrite1expo");

// const account = new Account(client);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen`} >
        <Header />
        <div className="flex justify-center items-center">{children}</div>
      </body>
    </html>
  );
}
