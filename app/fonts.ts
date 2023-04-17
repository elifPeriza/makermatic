import { Roboto, Roboto_Mono } from "next/font/google";

export const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "auto",
});

export const roboto_mono = Roboto_Mono({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-roboto-mono",
  display: "auto",
});
