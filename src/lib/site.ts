/**
 * Site-wide content and asset configuration.
 *
 * Everything that will be replaced with real Skillz assets lives here:
 * hero photography, booking destination, streaming/video links.
 * Set values to null (or empty) until real destinations are supplied.
 */

export type MediaLink = { label: string; url: string } | null;

/** Speaking CREATED MOMENTS desk item — WHERE + WHY + CONTRIBUTED. */
export type SpeakingEvidenceItem = {
  id: string;
  index: string;
  year: string;
  title: string;
  place: string;
  role: string;
  why: string;
  tag: string;
  media?: string;
  alt?: string;
  span?: string;
  /** document = typographic artifact treatment (verified identity material). */
  type?: "document";
  document?: { org: string; edition: string; line: string };
  /** companion = small documentary photo beside the artifact (low-res kept small). */
  companion?: { media: string; alt: string };
  /** stack = right-column evidence strip beside the main artifact (badge + documentary moment). */
  stack?: { media: string; alt: string }[];
  /** collage = contact-sheet teaching fragments below the main artifact (collected over time). */
  collage?: { media: string; alt: string }[];
  /** fragments = documentary strip beside a document artifact (speaking life, event rooms). */
  fragments?: { media: string; alt: string; span?: string }[];
};

export const site = {
  name: "DJ Lethal Skillz",
  shortName: "SKILLZ",
  role: "DJ · TURNTABLIST · PRODUCER",

  /** Hero 2 — canonical composition reference (the visual North Star, not rendered directly). */
  heroReference: "/assets/dj-lethal-skillz-hero2-reference.png" as string | null,

  /** Hero 2 subject master — canonical approved hero asset (white studio field, keyed at render time).
      WebP 2x derivative; canonical 4624×3468 PNG kept untouched as source of truth. */
  hero2Master: "/assets/skillz-hero2-master-2x.webp" as string | null,

  /** Hero background photograph — the approved SKY_0104 source image. */
  heroBackground: "/assets/sky-0104.jpg" as string | null,

  /** Foreground figure — transparent cutout of Skillz, layered over the type. */
  heroImage: {
    src: "/assets/skillz-cutout.png" as string | null,
    alt: "DJ Lethal Skillz",
  },

  /** DJ archive collage — approved iteration-2 master as static base (never flattened with video). */
  djArchive: {
    src: "/assets/dj-lethal-skillz-collage.png",
    alt: "DJ Lethal Skillz · Performance Archive",
    caption: "DJ · PERFORMANCE ARCHIVE",
    /** 4 approved living cells overlaid on the master. Panel geometry in 1920×1080 master coords. */
    cells: [
      { id: "craft", x: 1020, y: 148, w: 360, h: 414, webm: "/assets/cells/craft.webm", mp4: "/assets/cells/craft.mp4" },
      { id: "room", x: 40, y: 608, w: 520, h: 260, webm: "/assets/cells/room.webm", mp4: "/assets/cells/room.mp4" },
      { id: "warm", x: 580, y: 608, w: 240, h: 260, webm: "/assets/cells/warm.webm", mp4: "/assets/cells/warm.mp4" },
      { id: "history", x: 1180, y: 608, w: 200, h: 260, webm: "/assets/cells/history.webm", mp4: "/assets/cells/history.mp4" },
    ],
  },

  /** Turntablism living loop — approved Section 02 chapter visual (from TURNtablism_Living_Loop.mp4 deliverable, 5s seamless dissolve loop). */
  turntablism: {
    src: "/assets/turntablism-living-loop.mp4",
    webm: "/assets/turntablism-living-loop.webm",
    poster: "/assets/turntablism-living-loop-poster.png",
    caption: "Turntablism · The Instrument",
    // REV T5: editorial block — approved copy, no dashes, no in-copy yellow.
    // White = editorial voice (Speaking restraint), yellow reserved for the
    // section's structural accents only.
    editorial: {
      headline: "THE CRAFT LIVES AROUND THE DECKS.",
      body: [
        "Turntablism is more than what happens between the needles and the faders. It is a language built in rooms full of people: DJs, skratchers, students, friends and strangers, passing technique from one set of hands to another.",
        "From Beirut to Kuala Lumpur, the practice has always been about gathering: sharing records, trading cuts, building sessions, creating spaces to learn, and keeping the culture moving forward.",
        "This is the community around the instrument.",
      ],
    },
    /** REV T4: three-row documentary collage — 5 static + 4 motion (50/50),
        motion distributed through all rows. Rhythm over symmetry, natural
        orientations, Beirut identity inside the grid as a legitimate tile. */
    collage: [
      {
        type: "img",
        media: "/assets/turntablism/TURN_CLOSEUP.webp",
        alt: "Skillz at the turntables, close up",
        aspect: "aspect-[4/5]",
      },
      {
        type: "img",
        media: "/assets/turntablism/TURN_JAM_2022.webp",
        alt: "A community skratch jam, people gathered around the decks",
        span: "md:col-span-2",
        aspect: "aspect-[16/10]",
      },
      {
        type: "loop",
        media: "/assets/turntablism/skratcher-loop1.mp4",
        webm: "/assets/turntablism/skratcher-loop1.webm",
        poster: "/assets/turntablism/skratcher-loop1-poster.jpg",
        alt: "Skratch session, hands on the turntable",
        aspect: "aspect-[4/5]",
      },
      {
        type: "loop",
        media: "/assets/turntablism/turn-loop-jam.mp4",
        webm: "/assets/turntablism/turn-loop-jam.webm",
        poster: "/assets/turntablism/turn-loop-jam-poster.jpg",
        alt: "A wide community jam, people gathered around the decks",
        span: "md:col-span-2",
        aspect: "aspect-[16/10]",
      },
      {
        type: "img",
        media: "/assets/turntablism/TURN_EQUIPMENT.webp",
        alt: "A portable turntable setup, cables and equipment in a lived-in room",
        aspect: "aspect-[4/5]",
      },
      {
        type: "img",
        media: "/assets/turntablism/TURN_DUBAI.webp",
        alt: "Skratch Dubai, DJs gathered around the decks",
        aspect: "aspect-[4/5]",
      },
      {
        type: "img",
        media: "/assets/turntablism/TURN_JAM_2024.webp",
        alt: "A skratch community session, people gathered around the decks",
        span: "md:col-span-2",
        aspect: "aspect-[16/10]",
      },
      {
        type: "loop",
        media: "/assets/turntablism/turn-loop-perf.mp4",
        webm: "/assets/turntablism/turn-loop-perf.webm",
        poster: "/assets/turntablism/turn-loop-perf-poster.jpg",
        alt: "A performance, people dancing to the scratch",
        aspect: "aspect-[4/5]",
      },
      {
        // Skratch Beirut animated identity — real asset, kept as animation,
        // a legitimate tile inside the documentary collage, not an afterthought.
        type: "loop",
        media: "/assets/turntablism/skratch-beirut.mp4",
        webm: "/assets/turntablism/skratch-beirut.webm",
        poster: "/assets/turntablism/skratch-beirut-poster.jpg",
        alt: "Skratch Beirut animated identity",
        aspect: "aspect-[3/4]",
        contain: true,
      },
    ],
  },

  /** Each One Teach One video — documentary/workshop material. */
  workshopsVideo: {
    src: "/assets/each-one-teach-one-hero.mp4",
    poster: "/assets/each-one-teach-one-poster.png",
    alt: "Each One Teach One · Skillz teaching turntablism",
  },

  /**
   * Producer chapter — records/archive/credits editorial objects.
   * Editorial locked 2026-08-14 (see PRODUCER_INTELLIGENCE_BRIEF_v1 for evidence trail).
   * Claims are evidence-backed: dates from master catalog, roles exact ("Remixer", not composer).
   */
  producer: {
    positioning:
      "Beats, scratches, records and collaborations built across borders.",
    signature: {
      title: "Scratch Hooks",
      line: "A distinctive turntable language brought into records, collaborations and commissions.",
      primary: {
        name: "Squid Gamez",
        detail: "Co-production with cut hook, Def Ill, Austria",
        year: "",
      },
      trail: [
        "Defenders of the Culture, multi-country record (2025)",
        "The Re-Awakening, W.M.D. (Tunisia)",
        "Anghami Cypher, platform-commissioned scratches (2018)",
        "Most Gritty City, production + scratches (2025)",
      ],
    },
    works: [
      {
        id: "united",
        year: "",
        title: "The United",
        role: "Remixer, DJ Lethal Skillz",
        story:
          "Official remix for the Arabic Disney film. A Disney / Touchstone Pictures commission, contracted work-for-hire.",
        credits: "Composer: Omar Fadel · Features: Omar Offendum · Deeb · Salah Edin",
        tag: "HIP-HOP → FILM",
        media: "/assets/producer/theunited.webp",
        alt: "The United · film artwork",
        span: "md:col-span-7",
      },
      {
        id: "karmageddon",
        year: "",
        title: "Karmageddon",
        role: "Album, executive production, 17 tracks",
        story:
          "An album built across borders. Artists from across the Arab world and its diaspora, released physically in 2012, digitally in 2022.",
        credits:
          "Shadia Mansour · Omar Offendum · Narcy · Boikutt · Arabian Knightz",
        tag: "AN ALBUM BUILT ACROSS BORDERS",
        media: "/assets/producer/karmageddon.webp",
        alt: "Karmageddon · album artwork",
        span: "md:col-span-5",
      },
      {
        id: "anghami",
        year: "",
        title: "Anghami Cypher",
        role: "Scratches, a platform-commissioned hip-hop cypher",
        story:
          "Anghami commissioned Skillz to bring his turntable language into its first hip-hop cypher. Curated by Big Hass and produced by Sandhill, the project brought together nine MCs from across the region.",
        credits:
          "Shiboba · Omar Offendum · Bu Kolthoum · Meryem Saci · Narcy · Lowkey · Edd Abbas · Deeb · Muqata'a",
        tag: "A PLATFORM COMMISSIONED THE TURNTABLE LANGUAGE",
        media: "/assets/producer/anghami-cypher-group.jpg",
        alt: "Anghami Cypher · contact sheet of stills from the cypher video",
        span: "md:col-span-5",
        watchUrl: "https://www.youtube.com/watch?v=tZM6ebQKNgQ",
      },
      {
        id: "thirty",
        year: "",
        title: "30 Arab MC's On One Track",
        role: "One beat, a network of voices",
        story:
          "Twenty-six named contributors from across the Arab hip-hop network and diaspora on a single record.",
        credits:
          "Omar Offendum · Deeb · RGB · Malikah · MC Moe · Rayess Beik · Boikutt · La Gale · + 18 more contributors",
        tag: "ONE BEAT → A NETWORK OF VOICES",
        media: "/assets/producer/30arabmcs.webp",
        alt: "30 Arab MC's On One Track · release artwork",
        span: "md:col-span-4",
      },
      {
        id: "mgcity",
        year: "",
        title: "Most Gritty City",
        role: "Production and scratches, remix",
        story:
          "US ↔ Arab-world bridge: Honest Resistance with Marv Won and One Be Lo.",
        credits: "Marv Won · One Be Lo · Honest Resistance",
        tag: "DETROIT ↔ CAIRO",
        media: "/assets/producer/mgcity.webp",
        alt: "Most Gritty City · release artwork",
        span: "md:col-span-3",
      },
    ],
    services: [
      { name: "Beats", line: "Original production / beat licensing" },
      {
        name: "Scratch Hooks",
        line: "Custom scratches and turntable compositions",
      },
      {
        name: "Mixing + Mastering",
        line: "Production finishing / engineering",
      },
      { name: "Collaboration", line: "Build something together" },
    ],
  },

  /**
   * Speaking chapter — FROM THE CULTURE → TO THE ROOM.
   * Editorial locked 2026-08-15 rev 3 (see CHECKPOINT_SPEAKING.md for evidence trail).
   * SELECTED PROOF objects are evidence-verified, WHERE + WHY + CONTRIBUTED, never
   * invented status. Evidence tiers: DMC Dubai 2007 judge (A — vault verified + public
   * booking bio), Raising The Bar KL (B — Time Out KL 2013 + The Star R.AGE 2014),
   * Art of the DJ Dubai (C — supplied image only), WIEF 11th KL 2015 (C — supplied
   * image only; event itself externally verified 3–5 Nov 2015 KLCC). DOCUMENTED:
   * Mark LeVine, We'll Play till We Die, UC Press 2022 (verified publication; Skillz
   * link user-supplied — cautious sentence, no page numbers, no quotes).
   */
  speaking: {
    positioning: "From the culture to the room.",
    signature: {
      // REV 5/6 (2026-08-15): HHA anchor, not NAV. Tier A — producer letter
      // (Muhammad Dzulqarnain, Urban Entertainment 8TV / Primeworks Studios) +
      // Tonton deck: S2 broadcast 28 May–6 Aug 2015, Thursdays, 8TV Malaysia;
      // Lebanon one of 11 episodes. Line grounded in archive: EV-002 + DNA
      // Register pattern "Sought by Outside Media to Explain, Not Just Perform"
      // (High confidence: MTV Arabia, HHA, RTBMY panel).
      title: "Cultural Guide",
      line: "Sometimes the work moves from the decks to the conversation. Decades inside the culture, asked to tell its story: the history of Lebanese and Arab hip-hop, its identity, and what it means in different rooms.",
      primary: {
        name: "Hip-Hoppin' Asia, Lebanon episode",
        detail: "8TV Malaysia · Season 2",
        year: "",
        url: "https://youtu.be/3VTjjMsJeKQ",
      },
      trail: [],
    },
    evidence: [
      {
        id: "dmc",
        index: "01",
        year: "",
        title: "DMC World DJ Championship, GCC",
        place: "Dubai",
        role: "Judge, the culture's own world championship",
        why: "Called to adjudicate the region's best DJs at DMC's GCC battles. Technical authority recognised by the culture itself.",
        tag: "TECHNICAL AUTHORITY",
        media: "/assets/speaking/evidence/SPEAKING_EVIDENCE_DMC.webp",
        alt: "DMC World DJ Championship, judge credentials",
        // REV 6: right evidence strip — GCC judge badge + Skillz with DJ Q-Bert
        // (DMC World Championship Dubai 2007, 2272×1704 source, kept documentary size).
        stack: [
          {
            media: "/assets/speaking/evidence/SPEAKING_EVIDENCE_DMC_BADGE.webp",
            alt: "DMC World DJ Championship, GCC judge badge",
          },
          {
            media: "/assets/speaking/evidence/SPEAKING_EVIDENCE_DMC_QBERT.webp",
            alt: "DJ Lethal Skillz with DJ Q-Bert, DMC World Championship Dubai 2007",
          },
        ],
        span: "md:col-span-7",
      },
      {
        id: "raising",
        index: "02",
        year: "",
        title: "Raising The Bar",
        place: "Kuala Lumpur",
        role: "Hip-hop as a tool to drive socio-political change",
        why: "A conversation about Arabic and Lebanese hip-hop, spoken from inside the culture. One of the early practitioners who helped shape it, Skillz talked about hip-hop as a language of identity, expression and education, with space for social commentary, carried from MENA into Southeast Asia's hip-hop scene.",
        tag: "HIP-HOP CULTURE",
        media: "/assets/speaking/evidence/SPEAKING_EVIDENCE_RAISING.webp",
        alt: "Raising The Bar, Skillz on stage",
        span: "md:col-span-5",
      },
      {
        id: "art",
        index: "03",
        year: "",
        title: "Art of the DJ",
        place: "Dubai",
        role: "Teaching is part of the practice",
        why: "The turntables are an instrument, and teaching someone to use them is how the language stays alive. Workshops and community sessions, hands on the equipment, students close around the decks.",
        // REV 6: contact-sheet fragments from the Teaching archive (girls,
        // children, groups, hands-on sessions) — collected, not a gallery.
        collage: [
          {
            media: "/assets/speaking/evidence/SPEAKING_EVIDENCE_TEACH_2017.webp",
            alt: "DJ workshop, Skillz teaching at the decks",
          },
          {
            media: "/assets/speaking/evidence/SPEAKING_EVIDENCE_TEACH_BGIRLS.webp",
            alt: "Teaching girls to DJ, workshop",
          },
          {
            media: "/assets/speaking/evidence/SPEAKING_EVIDENCE_TEACH_2022.webp",
            alt: "Hands-on DJ education, student at the turntables",
          },
          {
            media: "/assets/speaking/evidence/SPEAKING_EVIDENCE_TEACH_GROUP.webp",
            alt: "Community DJ workshop, group session",
          },
          {
            media: "/assets/speaking/evidence/SPEAKING_EVIDENCE_TEACH_GROUP2.webp",
            alt: "Workshop group, many students around the decks",
          },
        ],
        tag: "EDUCATION",
        media: "/assets/speaking/evidence/SPEAKING_EVIDENCE_ART_OF_THE_DJ.webp",
        alt: "Art of the DJ, Skillz holding the mic",
        span: "md:col-span-5",
      },
      {
        id: "wief",
        index: "04",
        year: "",
        title: "World Islamic Economic Forum, 11th",
        place: "Kuala Lumpur",
        role: "Creative contribution, forum masthead design",
        why: "A global economic forum's identity, carrying a DJ's hand. Around it, fragments from other rooms where the culture was asked to speak.",
        // REV 12: six equal blocks, two clean rows of three. Five approved
        // speaking archive images + Tegas stage photo (Skillz between two
        // speakers, TEGAS Digital Innovation Hub). All equal width, object
        // cover, matching the Art of the DJ collage rhythm.
        fragments: [
          {
            media: "/assets/speaking/evidence/SPEAKING_EVIDENCE_SPEAKING_2.webp",
            alt: "Skillz presenting to a room, the audience in front of him",
          },
          {
            media: "/assets/speaking/evidence/SPEAKING_EVIDENCE_SPEAKING_3.webp",
            alt: "Skillz in a panel conversation, multi speaker setting",
          },
          {
            media: "/assets/speaking/evidence/SPEAKING_EVIDENCE_SPEAKING_1.webp",
            alt: "Skillz speaking, professional panel setting",
          },
          {
            media: "/assets/speaking/evidence/SPEAKING_EVIDENCE_SPEAKING_5.webp",
            alt: "Speaking in a dark room, audience silhouettes",
          },
          {
            media: "/assets/speaking/evidence/SPEAKING_EVIDENCE_SPEAKING_4.webp",
            alt: "Skillz presenting, Musicoin on screen behind him",
          },
          {
            media: "/assets/speaking/evidence/SPEAKING_EVIDENCE_TEGAS.webp",
            alt: "Skillz speaking between two other speakers, TEGAS Digital Innovation Hub",
          },
        ],
        tag: "CULTURE × CONVERSATIONS",
        // document = typographic artifact treatment (verified identity material;
        // no usable photograph exists — the only source image is 290×174).
        type: "document",
        media: "/assets/speaking/evidence/SPEAKING_EVIDENCE_WIEF_MASTHEAD.webp",
        alt: "World Islamic Economic Forum, 11th edition masthead",
        // REV 9: companion group photo removed — 290x174 unverifiable content,
        // negative space stronger. Poster stands alone as the anchor artifact.
        document: {
          org: "World Islamic Economic Forum",
          edition: "11th Edition",
          line: "Kuala Lumpur · 3–5 November 2015",
        },
        span: "md:col-span-7",
      },
    ] satisfies SpeakingEvidenceItem[],
    documented: {
      media: "/assets/speaking/evidence/SPEAKING_DOCUMENTED_LEVINE.webp",
      alt: "We'll Play till We Die, book cover",
      title: "We'll Play till We Die",
      subtitle: "Journeys across a Decade of Revolutionary Music in the Muslim World",
      author: "Mark LeVine",
      publisher: "University of California Press",
      year: "2022",
      line:
        "Skillz's work appears in Mark LeVine's 2022 study of revolutionary music across the Muslim world, connecting the New World Disorder era to the wider history of Lebanese hip-hop.",
    },
    topics: [
      { name: "Music", line: "The culture · The industry" },
      { name: "Culture", line: "Hip-hop · Heritage · Future" },
      { name: "Technology / creator economy", line: "Tools · Innovation · Ownership" },
      { name: "Creative entrepreneurship", line: "Building · Staying true" },
    ],
  },

  /**
   * Enquiry endpoint — same-origin POST to the serverless delivery worker
   * (Cloudflare Worker, route /api/enquiry). The destination email address
   * lives only in the worker's environment secrets, never in the client.
   */
  enquiryEndpoint: "/api/enquiry",

  media: {
    /** Official Skillz YouTube channel. */
    youtube: { label: "YouTube", url: "https://www.youtube.com/@djlethalskillz" } as MediaLink,
    /** Official Skillz Spotify artist profile. */
    spotify: { label: "Spotify", url: "https://open.spotify.com/artist/7F3kgeoTzXbi5JLPylw4qW" } as MediaLink,
  },
};

/**
 * Booking briefs — the SELECT A BRIEF categories, borrowed from the approved
 * SkillzHQ Collaborate reference (RC2 ProductionFreeze): name (row label),
 * heading (contextual "TELL ME ABOUT YOUR <heading>."), tagline (swapped into
 * the panel when the brief is open), helper (always-visible row detail).
 */
export const bookingBriefs = [
  {
    name: "Performance",
    heading: "Performance",
    tagline: "Let's create a performance people will remember.",
    helper: "Club bookings · Festivals · Private events",
  },
  {
    name: "Workshop / Masterclass",
    heading: "Workshop / Masterclass",
    tagline: "Let's create a workshop people will remember.",
    helper: "DJ workshops · Turntablism · Creative sessions",
  },
  {
    name: "Speaking",
    heading: "Speaking Engagement",
    tagline: "Let's create a talk people will remember.",
    helper: "Panels · Keynotes · Creative conversations",
  },
  {
    name: "Creative Collaboration",
    heading: "Creative Collaboration",
    tagline: "Let's create a collaboration people will remember.",
    helper: "Artists · Brands · Cultural projects",
  },
  {
    name: "Commission",
    heading: "Commissioned Project",
    tagline: "Let's create a commission people will remember.",
    helper: "Original music · Production · Creative direction",
  },
  {
    name: "Media / Press",
    heading: "Media / Press Feature",
    tagline: "Let's create a feature people will remember.",
    helper: "Interviews · Features · Documentary projects",
  },
  {
    name: "Other",
    heading: "Enquiry",
    tagline: "Let's create something people will remember.",
    helper: "Something different? Tell me.",
  },
] as const;

/**
 * Engagement types — thin routing layer above the booking briefs. Each
 * option points at the single most relevant existing brief by name; the
 * briefs above remain the only source of truth for headings/taglines/
 * helpers and are never duplicated here.
 */
export const engagementTypes: {
  label: string;
  brief: (typeof bookingBriefs)[number]["name"];
}[] = [
  { label: "DJ / Live Performance", brief: "Performance" },
  { label: "Workshops / Education", brief: "Workshop / Masterclass" },
  { label: "Speaking", brief: "Speaking" },
  { label: "Production / Creative Collaboration", brief: "Creative Collaboration" },
];
