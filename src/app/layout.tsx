import type { Metadata, Viewport } from "next";
import { Anton, Big_Shoulders, Caveat, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { AnthemProvider } from "@/lib/anthem-audio";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
});

const caveat = Caveat({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-caveat",
});

// Fragments archive DNA (transplanted from the original Living Archive build):
// Big Shoulders for the giant archival words, JetBrains Mono for the museum
// captions printed on the physical-object mounts.
const bigShoulders = Big_Shoulders({
  weight: "900",
  subsets: ["latin"],
  variable: "--font-big-shoulders",
});

const jetbrains = JetBrains_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://djlethalskillz.com/"),
  title: "DJ Lethal Skillz · DJ · Turntablist · Producer",
  description:
    "DJ Lethal Skillz: commercial DJ, turntablist and producer. Available for bookings, festivals, workshops, speaking and creative collaborations.",
  alternates: {
    canonical: "https://djlethalskillz.com/",
  },
  openGraph: {
    title: "DJ Lethal Skillz · DJ · Turntablist · Producer",
    description:
      "DJ Lethal Skillz: commercial DJ, turntablist and producer. Available for bookings, festivals, workshops, speaking and creative collaborations.",
    url: "https://djlethalskillz.com/",
    siteName: "DJ Lethal Skillz",
    type: "website",
    images: [
      {
        url: "https://djlethalskillz.com/assets/djlethalskillz-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "DJ Lethal Skillz",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DJ Lethal Skillz · DJ · Turntablist · Producer",
    description:
      "DJ Lethal Skillz: commercial DJ, turntablist and producer. Available for bookings, festivals, workshops, speaking and creative collaborations.",
    images: ["https://djlethalskillz.com/assets/djlethalskillz-og-image.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${caveat.variable} ${bigShoulders.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background font-body text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": "https://djlethalskillz.com/#website",
                  name: "DJ Lethal Skillz",
                  url: "https://djlethalskillz.com/",
                },
                {
                  "@type": "Person",
                  "@id": "https://djlethalskillz.com/#person",
                  name: "DJ Lethal Skillz",
                  url: "https://djlethalskillz.com/",
                  image: "https://djlethalskillz.com/assets/djlethalskillz-og-image.jpg",
                  description:
                    "DJ Lethal Skillz: commercial DJ, turntablist and producer. Available for bookings, festivals, workshops, speaking and creative collaborations.",
                  jobTitle: "DJ · Turntablist · Producer",
                  knowsAbout: ["Turntablism", "Hip-hop"],
                  sameAs: [
                    "https://www.youtube.com/@djlethalskillz",
                    "https://open.spotify.com/artist/7F3kgeoTzXbi5JLPylw4qW",
                    "https://music.apple.com/au/artist/dj-lethal-skillz/301489359",
                    "https://tidal.com/artist/4004977/u",
                    "https://www.instagram.com/djlethalskillz/",
                    "https://www.facebook.com/djlethalskillz961/",
                    "https://medium.com/@djlethalskillz",
                  ],
                },
              ],
            }),
          }}
        />
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-accent focus:px-4 focus:py-2 focus:text-black"
        >
          Skip to content
        </a>
        <AnthemProvider>
          <Header />
          <main id="content">{children}</main>
          <Footer />
        </AnthemProvider>
      </body>
    </html>
  );
}
