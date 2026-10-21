/**
 * Lines from the EPK (public/assets/DJ_LETHAL_SKILLZ_EPK.pdf, 3 pages), verbatim.
 * Shown on /book (owner lock amendment, 2026-10-21). Each line cites its EPK
 * page; the EPK sets them in capitals, the site sets them in CSS uppercase or
 * sentence case. Add nothing here that is not printed in the EPK.
 * Not used: the EPK p.1 quote "THE MIDDLE EAST'S PREMIERE TURNTABLIST."
 * (credited there to Red Bull Music Academy): source and spelling are open
 * questions for the owner.
 */

export const EPK_PDF = "/assets/DJ_LETHAL_SKILLZ_EPK.pdf";
// EPK p.2, under "BOOK DJ LETHAL SKILLZ"
export const BOOKINGS_EMAIL = "bookings@djlethalskillz.com";

export const EPK_TAGLINE = [
  "DJ · Turntablist · Producer", // EPK p.1, top line
  "Beirut · Kuala Lumpur · Worldwide", // EPK p.1, bottom line
] as const;

// EPK p.2, "BOOK SKILLZ": the three numbered columns, every line as printed.
export const EPK_SERVICES = [
  {
    n: "01",
    name: "Perform",
    lead: "Clubs. Festivals. Events. International bookings. Turntablist sets, proven live.",
    lines: [
      "Judge, DMC World DJ Championship",
      "Special Guest & Judge, Red Bull 3Style",
      "Battle DJ, Red Bull Breaking",
      "Opened for Grandmaster Flash, DJ Jazzy Jeff, Timbaland, Missy Elliott",
      "Residency, Zouk KL and Zion KL",
    ],
  },
  {
    n: "02",
    name: "Teach",
    lead: "DJ workshops. Turntablism masterclasses. Technique, culture, and craft, hands on.",
    lines: [
      "Instructor, Turntablism 101 masterclass, Station Beirut",
      "Founder, Skratcher Beirut and Skratcher KL",
      "DJ Lab Lebanon, DJ education",
    ],
  },
  {
    n: "03",
    name: "Speak",
    lead: "Universities. Conferences. Cultural institutions.",
    lines: [
      "Speaker, TEGAS Digital Innovation Hub",
      "Speaker, World Islamic Economic Forum",
      "Panelist, BLOCK ON",
      "Guest lecturer, university computer science programme",
      "Profiled by NPR and Red Bull Music Academy",
    ],
  },
] as const;

// EPK p.3, "RECEIPTS": heading and the twelve numbered captions, as printed.
// The heading refers to the EPK's own previous pages (open question for the owner).
export const EPK_RECEIPTS_HEADING = "Every claim on the previous two pages, on paper.";

export const EPK_RECEIPTS = [
  { n: "01", item: "DMC Judge laminate", caption: "DMC World DJ Championship. Judge. Dubai." },
  { n: "02", item: "Red Bull 3Style poster", caption: "Special Guests and Judges. Lebanon, 2017." },
  { n: "03", item: "Red Bull Breaking flyer", caption: "Battle DJ. Lebanon, 2010." },
  { n: "04", item: "One Nation Under A Groove", caption: "Shared the bill with Pharoahe Monch and M-1. London, 2005." },
  { n: "05", item: "With Grandmaster Flash", caption: "Opened for Grandmaster Flash. Beirut." },
  { n: "06", item: "With DJ Jazzy Jeff", caption: "Opened for DJ Jazzy Jeff." },
  { n: "07", item: "DMC Dubai", caption: "Artist laminate. DMC World DJ Championship, Dubai." },
  { n: "08", item: "Ace, Zouk KL", caption: "Residency. Zouk Kuala Lumpur." },
  { n: "09", item: "Zion Club, Kuala Lumpur", caption: "Residency. Zion KL." },
  { n: "10", item: "Turntablism 101", caption: "Instructor. Station Beirut." },
  { n: "11", item: "TEGAS Programme", caption: "Speaker. TEGAS Digital Innovation Hub." },
  { n: "12", item: "University Guest Lecture", caption: "Guest lecturer. Computer science programme." },
] as const;
