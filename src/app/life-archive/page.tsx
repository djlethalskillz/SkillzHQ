import type { Metadata } from "next";
import { LifeArchive } from "@/components/life-archive";

export const metadata: Metadata = {
  title: "Life Archive · DJ Lethal Skillz",
  description:
    "The Life Archive: films from the life and work of DJ Lethal Skillz — Lebanese DJ History From My View, A Rap Show Hired Me, PhonoSapien, 961 Underground, Safeit bi 3akss el Seir. Newest first.",
  alternates: {
    canonical: "https://djlethalskillz.com/life-archive",
  },
  openGraph: {
    title: "Life Archive · DJ Lethal Skillz",
    description:
      "The Life Archive: films from the life and work of DJ Lethal Skillz — Lebanese DJ History From My View, A Rap Show Hired Me, PhonoSapien, 961 Underground, Safeit bi 3akss el Seir. Newest first.",
    url: "https://djlethalskillz.com/life-archive",
  },
  twitter: {
    title: "Life Archive · DJ Lethal Skillz",
    description:
      "The Life Archive: films from the life and work of DJ Lethal Skillz — Lebanese DJ History From My View, A Rap Show Hired Me, PhonoSapien, 961 Underground, Safeit bi 3akss el Seir. Newest first.",
  },
};

export default function LifeArchivePage() {
  return <LifeArchive />;
}
