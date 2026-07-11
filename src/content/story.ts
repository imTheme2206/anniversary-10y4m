/**
 * ─────────────────────────────────────────────────────────────────────────
 * SINGLE SOURCE OF TRUTH for every word, date, count, and image on the site.
 * Personalize the whole page by editing the values below — nothing else in
 * `src/` needs to change. See the README "How to personalize" section.
 * ─────────────────────────────────────────────────────────────────────────
 */
export const story = {
  couple: {
    you: "Theme",
    her: "Nam",
  },

  anniversary: {
    label: "10 Years, 4 Months",
    // ISO date — used to drive the live "days together" counter on the cover.
    togetherSince: "2016-03-11",
    headline: "Happy Anniversary",
  },

  intro: {
    kicker: "10 ปี 4 เดือน แย้ววว",
    body: "{{One or two warm sentences about how it started — the first message, the friend who introduced you, the coffee that turned into three hours of talking.}}",
    image: "/assets/couple/photo-01.avif",
  },

  chapters: [
    {
      label: "",
      title: "วันครบรอบคราวนี้",
      body: "{{Set the scene — where you were, what she was wearing, the small detail you still remember.}}",
      image: "/assets/couple/photo-02.avif",
    },
    {
      label: "Memory 02",
      title: "จะบอกว่า",
      body: "{{The moment it became real — who said it first, and how the other one answered.}}",
      image: "/assets/couple/photo-03.avif",
    },
    {
      label: "Memory 03",
      title: "เค้ารักแกที่สุดด",
      body: "{{Where you went, what went wrong that ended up being funny later, the view you both stopped to look at.}}",
      image: "/assets/couple/photo-04.avif",
    },
    {
      label: "Memory 04",
      title: "จะดูแลแกตลอดๆๆๆ ไปเลย",
      body: "{{The first apartment, the terrible furniture, the first meal you cooked together in it.}}",
      image: "/assets/couple/photo-05.avif",
    },
    {
      label: "Memory 05",
      title: "แกจะมีเค้าอยู่ข้างๆตลอดคั้บบ",
      body: "{{Where you are now, and the quiet, ordinary happiness of a Tuesday together.}}",
      image: "/assets/couple/photo-06.avif",
    },
  ],

  gallery: [
    {
      src: "/assets/couple/gallery-01.avif",
      caption: "{{A rainy afternoon, somewhere we got lost.}}",
    },
    {
      src: "/assets/couple/gallery-02.avif",
      caption: "{{Your laugh, mid-sentence.}}",
    },
    {
      src: "/assets/couple/gallery-03.avif",
      caption: "{{The picnic that attracted every ant in the park.}}",
    },
    {
      src: "/assets/couple/gallery-04.avif",
      caption: "{{Sunday morning, still in pajamas.}}",
    },
    {
      src: "/assets/couple/gallery-05.avif",
      caption: "{{That trip we almost missed the train for.}}",
    },
    {
      src: "/assets/couple/gallery-06.avif",
      caption: "{{Just us, no reason at all.}}",
    },
  ],

  finale: {
    video: "/assets/couple/ending.mp4",
    eyebrow: "สุขสันต์วันครบรอบ",
    title: "รักแกที่สุดด",
  },

  reasons: [
    "{{The way you laugh at your own jokes before you finish telling them.}}",
    "{{How you save the last bite for me without ever saying so.}}",
    "{{Your terrible taste in road-trip music, sung at full volume.}}",
    "{{The way you make any room feel like home.}}",
    "{{How you remember the small things I mention once, in passing.}}",
    "{{The way you hold my hand a little tighter in crowds.}}",
  ],

  milestones: [
    { value: 3774, suffix: "", label: "days together" },
    { value: 12, suffix: "", label: "trips taken" },
    { value: 0, suffix: "∞", label: "inside jokes", displayInfinity: true },
  ],

  letter: {
    salutation: "My dearest Nam,",
    body: "{{The heartfelt letter — a few short, unhurried paragraphs. Tell her what these days have meant, what you're grateful for, what you're looking forward to. Let it sound like you, not like a card.}}\n\n{{A second paragraph, if you need it — the quiet, specific things. The way she makes tea. The song that's \"theirs\" now. What forever looks like from here.}}",
    signoff: "Forever yours,",
    signature: "Theme",
  },
} as const;

export type Story = typeof story;
