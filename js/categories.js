// The 12 domain categories. Each one decides, for every domain in it:
//   - how its storefront window and sign look in the hallway (`key` picks the painter in art.js),
//   - the wording of its store panel (`tagline`, `why`, `buyers`),
//   - which concept-site theme it opens (`site/themes/<key>.css`) and what that site says (`site`).
// `{B}` is replaced with the brand name ("HinduMandir") and `{D}` with the full domain ("hindumandir.in").
// Wording is concept-only: no claims about traffic, history, revenue or any real company.
export const CATEGORIES = [
  {
    no: 1, key: 'devotional', name: 'Hindu / Devotional / Spiritual', short: 'Devotional',
    accent: '#ffa94d', accent2: '#ffe08a', signFont: 'Cinzel, serif',
    tagline: 'A name made for devotion.',
    why: '{B} is a plain, devotional name in the Hindu and spiritual space. Concept uses: temple and community pages, pooja and darshan services, festival and satsang hubs, devotional content.',
    buyers: ['Temples & trusts', 'Devotional content & streaming', 'Pooja, pilgrimage & seva platforms', 'Community & festival organisers'],
    site: {
      layout: 'center', kicker: 'Concept site · devotion',
      lead: 'A calm, warm home for faith, community and seva, built around {B}.',
      cards: [
        ['Darshan & aarti', 'Daily darshan, live aarti and a temple calendar people can plan around.'],
        ['Pooja & seva booking', 'Book a pooja, sponsor seva or make a donation with a clear, honest receipt.'],
        ['Satsang & community', 'Events, discourses and volunteer rotas for a congregation that wants to stay in touch.'],
        ['Sacred library', 'Bhajans, aartis and teachings in one searchable place, with audio.'],
      ],
    },
  },
  {
    no: 2, key: 'khalsa', name: 'Sikh / Khalsa', short: 'Sikh / Khalsa',
    accent: '#5fa8ff', accent2: '#ffc94d', signFont: 'Cinzel, serif',
    tagline: 'Community, learning and seva.',
    why: '{B} sits in the Sikh and Khalsa space. Concept uses: schools and colleges, gurdwara and sangat communities, seva and langar coordination, an app for the community.',
    buyers: ['Khalsa schools & colleges', 'Gurdwara committees & sangat', 'Community apps & seva networks', 'Youth and heritage programmes'],
    site: {
      layout: 'center', kicker: 'Concept site · community',
      lead: 'A clear, welcoming home for learning, seva and sangat, built around {B}.',
      cards: [
        ['Admissions & learning', 'Courses, admissions and a parent portal for a school or college.'],
        ['Sangat & events', 'Programmes, kirtan schedules and community notices in one place.'],
        ['Seva & langar', 'Volunteer sign-ups and contribution tracking that stay transparent.'],
        ['Heritage & history', 'Stories, timelines and a growing archive for young people.'],
      ],
    },
  },
  {
    no: 3, key: 'media', name: 'TV / Radio / Media', short: 'TV · Radio · Media',
    accent: '#ff5a5f', accent2: '#ffd166', signFont: '"Bebas Neue", Impact',
    tagline: 'Press play on a brand.',
    why: '{B} is a media-shaped name. Concept uses: a streaming channel or radio station, a magazine or news brand, a studio or production label, a creator network.',
    buyers: ['Streaming & OTT startups', 'Radio & podcast networks', 'Magazines & digital publishers', 'Studios & creator networks'],
    site: {
      layout: 'split', kicker: 'Concept site · now broadcasting',
      lead: 'A broadcast-ready home for channels, shows and stories, built around {B}.',
      cards: [
        ['Live & on demand', 'A schedule, a live player and a catalogue that remembers where you stopped.'],
        ['Shows & episodes', 'Series pages with clips, cast and notes that suit both TV and audio.'],
        ['News & features', 'An editorial front page with a tidy archive and a newsletter.'],
        ['Partners & advertising', 'A clean media kit and sponsorship slots for brands that want reach.'],
      ],
    },
  },
  {
    no: 4, key: 'events', name: 'Events / Festivals / Entertainment', short: 'Events & Festivals',
    accent: '#ff7ab6', accent2: '#ffd34d', signFont: '"Bebas Neue", Impact',
    tagline: 'Doors open at the dot.',
    why: '{B} reads like an event. Concept uses: a festival or mahotsav site, ticketing and line-ups, sponsor and vendor pages, a recurring annual brand.',
    buyers: ['Festival & event organisers', 'Ticketing platforms', 'Cultural associations', 'Sponsors & brand activations'],
    site: {
      layout: 'poster', kicker: 'Concept site · save the date',
      lead: 'A poster-bright home for an event people count down to, built around {B}.',
      cards: [
        ['Line-up & schedule', 'Who is on, when and where, with a schedule people can save to a calendar.'],
        ['Tickets', 'Tiers, group passes and a simple checkout.'],
        ['Venue & travel', 'Maps, parking, stays and getting there.'],
        ['Sponsors & vendors', 'Packages, stall bookings and a thank-you wall.'],
      ],
    },
  },
  {
    no: 5, key: 'music', name: 'Music / Performing Arts', short: 'Music & Arts',
    accent: '#d9a441', accent2: '#8c5a3c', signFont: 'Cinzel, serif',
    tagline: 'Rhythm, riyaz and a stage.',
    why: '{B} is rooted in music and performance. Concept uses: lessons and riyaz, an instrument shop, a performance or theatre company, a recording and release hub.',
    buyers: ['Music schools & teachers', 'Instrument sellers', 'Theatre & dance companies', 'Labels & artist collectives'],
    site: {
      layout: 'editorial', kicker: 'Concept site · on stage',
      lead: 'A warm, editorial home for players, teachers and audiences, built around {B}.',
      cards: [
        ['Lessons', 'Teachers, levels and a practice log that rewards showing up.'],
        ['Performances', 'Upcoming shows, recordings and programme notes.'],
        ['Instruments & gear', 'A considered shop with care guides and honest buying advice.'],
        ['Artists', 'Profiles, bookings and a press page for each performer.'],
      ],
    },
  },
  {
    no: 6, key: 'tech', name: 'Domain Industry / Tech Tools', short: 'Domain Tools',
    accent: '#3de3c1', accent2: '#7aa2ff', signFont: '"JetBrains Mono", monospace',
    tagline: 'Built for people who build.',
    why: '{B} is a tool-shaped name. Concept uses: a developer or domain-investor utility, an API or dashboard, a marketplace or monitoring service.',
    buyers: ['Developer-tool startups', 'Domain investors & brokers', 'SaaS and API products', 'Agencies & hosting companies'],
    site: {
      layout: 'terminal', kicker: 'Concept site · ready',
      lead: 'A fast, no-nonsense home for a developer or domain tool, built around {B}.',
      cards: [
        ['Dashboard', 'Everything you watch in one view, with alerts that earn their noise.'],
        ['API & docs', 'A documented API, copy-paste examples and an honest changelog.'],
        ['Monitoring', 'Watch availability, expiry and change, and get told in time.'],
        ['Pricing', 'Simple tiers and a free plan that is actually usable.'],
      ],
    },
  },
  {
    no: 7, key: 'apps', name: 'Consumer Apps / AI', short: 'Apps & AI',
    accent: '#a78bfa', accent2: '#34d3ee', signFont: 'Cinzel, serif',
    tagline: 'Small name, big app.',
    why: '{B} is short and easy to say, which suits a consumer app or an AI product. Concept uses: a mobile app landing page, an AI companion or assistant, a social or storytelling product.',
    buyers: ['Consumer app founders', 'AI product startups', 'Studios & app agencies', 'Brands launching a companion app'],
    site: {
      layout: 'phone', kicker: 'Concept site · coming to your phone',
      lead: 'A bright, friendly launch page for an app, built around {B}.',
      cards: [
        ['What it does', 'One clear promise, shown in three screens.'],
        ['Made for you', 'Personalised from the first minute, without a long sign-up.'],
        ['Private by default', 'Your data stays yours, and the app says so plainly.'],
        ['Get the app', 'Store badges, a web version and a waitlist.'],
      ],
    },
  },
  {
    no: 8, key: 'education', name: 'Education', short: 'Education',
    accent: '#60c47a', accent2: '#ffd166', signFont: 'Cinzel, serif',
    tagline: 'Where learning starts.',
    why: '{B} suits learning. Concept uses: a tutoring or exam-prep platform, a school or institute site, a course marketplace, a positive-habits or wellbeing programme.',
    buyers: ['Ed-tech startups', 'Schools & institutes', 'Tutoring & test-prep brands', 'Course creators'],
    site: {
      layout: 'notebook', kicker: 'Concept site · class is in session',
      lead: 'A clear, encouraging home for students, teachers and parents, built around {B}.',
      cards: [
        ['Courses', 'Structured lessons with practice and progress that students can see.'],
        ['Live classes', 'Timetables, recordings and a way to ask questions.'],
        ['For parents', 'A simple view of attendance, progress and what to do next.'],
        ['For teachers', 'Lesson plans, grading and a place to share what works.'],
      ],
    },
  },
  {
    no: 9, key: 'local', name: 'Local / Geo / Real Estate', short: 'Local & Geo',
    accent: '#4cc9f0', accent2: '#f4a261', signFont: 'Cinzel, serif',
    tagline: 'Know the neighbourhood.',
    why: '{B} is tied to a place or a property use. Concept uses: a city guide or directory, a rentals and property listing site, a local business network, a community portal.',
    buyers: ['Property & rental portals', 'City guides & directories', 'Local business networks', 'Community and civic groups'],
    site: {
      layout: 'map', kicker: 'Concept site · near you',
      lead: 'A map-first home for a place, its people and its listings, built around {B}.',
      cards: [
        ['Listings', 'Search by area, price and type, with photos and a clear shortlist.'],
        ['Neighbourhood guide', 'Schools, transit, food and what it is actually like to live there.'],
        ['Local business', 'A directory with hours, reviews and an easy way to get in touch.'],
        ['List with us', 'A simple form for owners, agents and businesses to be added.'],
      ],
    },
  },
  {
    no: 10, key: 'diaspora', name: 'Diaspora / Community / Lifestyle', short: 'Diaspora & Lifestyle',
    accent: '#ff9f68', accent2: '#2ec4b6', signFont: 'Cinzel, serif',
    tagline: 'Home, wherever you are.',
    why: '{B} speaks to community and lifestyle. Concept uses: a diaspora network or marketplace, a lifestyle or fashion brand, a shop for celebrations and gifting, a culture magazine.',
    buyers: ['Diaspora communities & networks', 'Lifestyle & fashion brands', 'Gifting & celebration shops', 'Culture publishers'],
    site: {
      layout: 'collage', kicker: 'Concept site · our people',
      lead: 'A lively, friendly home for community, culture and good things, built around {B}.',
      cards: [
        ['Community', 'Introductions, local chapters and events that bring people together.'],
        ['Shop', 'A curated storefront with makers, gifts and festival picks.'],
        ['Stories', 'Voices, recipes and traditions, passed on in a way people share.'],
        ['Services', 'Trusted recommendations, from movers to mehndi.'],
      ],
    },
  },
  {
    no: 11, key: 'personal', name: 'Personal Names', short: 'Personal Names',
    accent: '#c9b8ff', accent2: '#8aa4ff', signFont: '"JetBrains Mono", monospace',
    tagline: 'A portfolio, waiting for its owner.',
    why: 'A name-shaped domain is made for one person\'s portfolio. This door opens a blank portfolio template: it shows how a portfolio should be laid out, and nothing on it is about any real person.',
    buyers: ['Anyone whose name this is', 'Families and namesakes', 'Professionals building a portfolio'],
    blank: true,
    site: {
      layout: 'portfolio', kicker: 'Blank portfolio template',
      lead: '',
      cards: [],
    },
  },
  {
    no: 12, key: 'restricted', name: 'Regulated / Restricted', short: 'Restricted',
    accent: '#9bb59a', accent2: '#c7c19a', signFont: 'Cinzel, serif',
    tagline: 'A regulated category.',
    why: '{B} sits in a regulated category, so advertising, payments and hosting may be restricted. Buyers should check local law and platform rules before building.',
    buyers: ['Licensed operators', 'Specialist publishers', 'Informational and compliance sites'],
    site: {
      layout: 'sober', kicker: 'Concept site · regulated category',
      lead: 'A careful, compliance-first home for a regulated category, built around {B}.',
      cards: [
        ['Age & access', 'Clear age gates and region rules before anything else.'],
        ['Information', 'Plain-language, sourced guides rather than promotion.'],
        ['Compliance', 'Licence details, policies and a visible way to raise concerns.'],
        ['Contact', 'A real contact route for customers, regulators and the press.'],
      ],
    },
  },
];

export const CATEGORY_BY_NO = Object.fromEntries(CATEGORIES.map((c) => [c.no, c]));
export const CATEGORY_BY_KEY = Object.fromEntries(CATEGORIES.map((c) => [c.key, c]));
