import { Roboto, Roboto_Mono, VT323 } from "next/font/google";

export const vt323 = VT323({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-vt323",
});

export const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-roboto",
});

export const roboto_mono = Roboto_Mono({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-roboto-mono",
});
