export type LifeCrate = {
  /** Crate designation — the entry number, oldest to newest. */
  number: string;
  /** Label shown before the number; defaults to "Life Crate". */
  label?: string;
  /** Official title, verbatim — white portion. */
  title: string;
  /** Editorial accent tail of the title (yellow), e.g. "| DJ Lethal Skillz". */
  accent?: string;
  youtubeId: string;
  /** Optional embed start offset in seconds (from the source URL). */
  start?: number;
  /** Year — shown as metadata only when it appears in the source material. */
  year?: string;
  /** Place — shown as metadata only when it appears in the source material. */
  place?: string;
  /** Short editorial text — supplied per crate, none yet. */
  note?: string;
};

/**
 * The Life Archive — newest first. Manually maintained: future crates are
 * added by hand at the top of this list. No CMS, no database.
 * Editorial notes are first-person archive copy, used verbatim.
 * DEMO: data identical to production b226695; presentation only changed.
 * Each film's still is its own YouTube cover, stored locally at
 * /assets/life-archive/<youtubeId>.webp (see the asset register).
 */
export const CRATES: LifeCrate[] = [
  {
    number: "10",
    label: "Music Video Archive",
    title: "DJ LETHAL SKILLZ MUSIC VIDEO ARCHIVE",
    accent: "· VOL. 2",
    youtubeId: "9oT5hj4XVXA",
    note: "The crate gets deeper. Volume 2 moves through records, collaborations and images from Lebanon to Malaysia, Indonesia, Detroit, Turkey, Austria and Egypt. Some of these records were released. Some lived in the archive. This isn't a greatest hits reel. It's a document of the work, the people around it, and the places it travelled through.",
  },
  {
    number: "09",
    title: "AL JISR | الجسر - A Short Documentary Film",
    accent: "· Big Hass × DJ Lethal Skillz",
    youtubeId: "nmNOF_aVE2I",
    note: "A short documentary film about a bridge built through music. A story about hip-hop, culture, connection, and the relationship between artists and scenes across Beirut, Dubai, and beyond.",
  },
  {
    number: "08",
    label: "Music Video Archive",
    title: "DJ Lethal Skillz - Music Video Archive",
    accent: "· Vol. 1",
    youtubeId: "OD4WStbsP6k",
    note: "For a long time, I was told I was crazy. I left the corporate world to make music. At the time, none of it looked like an archive. It was just life. This first volume brings together fragments from that journey: different years, different places, different people, connected through the music and the work. This is Volume 1. And I'm still digging.",
  },
  {
    number: "07",
    title: "Why Does Hip Hop Mention Beirut? |",
    accent: "Volume 2 (2007–2018)",
    youtubeId: "sDNSaki3DMY",
    year: "2007–2018",
    note: "Beirut has appeared in hip hop records across the world for decades. Volume 2 continues the archive with 14 documented references from 2007 to 2018, tracing how Beirut appeared in the work of artists from different countries, scenes and generations. This is an ongoing documentary archive, not a definitive list.",
  },
  {
    number: "06",
    title: "I Grew Up in Beirut.",
    accent: "Hip Hop Kept Saying Its Name.",
    youtubeId: "3Ev_4wHD1Rw",
    note: "As a kid I listened to American hip hop and French rap, and every now and then a record would say my city's name. Usually it meant war. Digging through the crates, I kept finding Beirut and Lebanon in records I already owned. The film puts 45 of those mentions, from 1991 to 2009, in chronological order, each one played from the record itself. This is the Beirut episode.",
  },
  {
    number: "05",
    title: "Lebanese DJ History, From My View:",
    accent: "Turntablism Before the Internet",
    youtubeId: "fqUqwGuvFEc",
    note: "There was a whole DJ culture in Lebanon that most people never saw: pirate radio, cassettes, VHS, underground battles, records with their labels covered so no one could see what was being played. I grew up in Beirut during the war and learned turntablism from tapes, with no tutorials and no internet. This is my own view of that history, not the complete one.",
  },
  {
    number: "04",
    title: "A Rap Show Hired Me. I Wasn't the Rapper. |",
    accent: "Lebanon 2015",
    youtubeId: "tVs4qlzzU00",
    year: "2015",
    place: "Lebanon",
    note: "In 2015, the Malaysian TV production Hip Hoppin' Asia: The Saga Continues came to Lebanon to explore hip hop culture, and I was hired as its Location Manager. Years later, I went back through the original episode and cut this LifeCrate edit: not the full episode, but my personal archival look at that chapter.",
  },
  {
    number: "03",
    title: "PhonoSapien: The Monk of the Third World",
    accent: "| DJ Lethal Skillz",
    youtubeId: "hgnKf271RoY",
    start: 1,
    note: "PhonoSapien was another side of DJ Lethal Skillz, taking the story beyond hip hop and turntablism into visual art, spirituality, martial arts and the world of Dragon Temple. This chapter traces that strange creative path from Beirut to Malaysia, and the collaboration with Atomsk that helped bring the vision to life.",
  },
  {
    number: "02",
    title: "961 Underground: Before It Had a Name,",
    accent: "There Was Beirut",
    youtubeId: "xUCS6ZBpfHo",
    note: "Before 961 Underground had a name, a generation of DJs, MCs, writers, breakers and graffiti artists were already building an underground culture in Beirut. This chapter looks back at that scene from my perspective, and at the people, records, places and connections that eventually became part of 961 Underground.",
  },
  {
    number: "01",
    title: "Safeit bi 3akss el Seir |",
    accent: "Beirut, 1998",
    youtubeId: "Cqz5Vmz0Lm8",
    year: "1998",
    place: "Beirut",
    note: "In 1998, I put my turntables in the middle of a Beirut intersection for a music video by Aks'es Seir. Shot on a small video camera with borrowed clothes, old DMC gear and a yellow Mustang, the footage later became something more than a music video: a document of Beirut and an early Lebanese hip hop scene.",
  },
];
