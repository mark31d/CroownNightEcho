// data/astroContent.js
// Единый источник данных для звёзд, созвездий и планет.
// Все изображения — .webp. Положите их в указанные пути (см. комментарии).

export const ASTRO_OBJECTS = [
    /* -------------------- STARS -------------------- */
    {
      id: 'sirius',
      name: 'Sirius',
      kind: 'star',
      image: require('../assets/sirius.webp'),
      didYouKnow:
        'Sirius, also called the Dog Star, is the brightest star in our night sky. It shines with a bluish-white light and is located in the constellation Canis Major.',
      visibility: '95% (very high in winter)',
      observe: {
        bestTime: 'December to March, after sunset',
        conditions: 'Clear, dark skies away from city lights',
        telescope:
          'Visible to the naked eye, but a small refractor reveals color and twinkle',
        bonusTip: 'Look southeast in the evening sky — it rises low but gets higher',
      },
    },
    {
      id: 'betelgeuse',
      name: 'Betelgeuse',
      kind: 'star',
      image: require('../assets/betelgeuse.webp'),
      didYouKnow:
        'Betelgeuse is a massive red supergiant in Orion, nearing the end of its life. If placed in our Solar System, it would engulf the orbits of Mercury to Mars.',
      visibility: '88%',
      observe: {
        bestTime: 'December to February, 9 PM–midnight',
        conditions: 'Clear skies, low humidity',
        telescope: 'Binoculars or any beginner scope show reddish hue',
        bonusTip: 'Find Orion’s “shoulder” — it’s the top-left bright star',
      },
    },
    {
      id: 'vega',
      name: 'Vega',
      kind: 'star',
      image: require('../assets/vega.webp'),
      didYouKnow:
        'Vega is part of the Summer Triangle and one of the most studied stars. It spins so fast that it bulges at the equator!',
      visibility: '90% (summer peak)',
      observe: {
        bestTime: 'June to September, high in the sky',
        conditions: 'Dark skies after twilight',
        telescope:
          'Naked eye or binoculars; use a telescope to appreciate its blue-white glow',
        bonusTip: 'Look almost straight up around 10 PM in summer',
      },
    },
    {
      id: 'antares',
      name: 'Antares',
      kind: 'star',
      image: require('../assets/antares.webp'),
      didYouKnow:
        'Antares is a red supergiant in the Scorpius constellation. Its name means “rival to Mars” because of its red color.',
      visibility: '70% (depends on hemisphere)',
      observe: {
        bestTime: 'June to August, low on the southern horizon',
        conditions: 'Low light pollution essential',
        telescope: 'Small telescope shows orange-red glow',
        bonusTip: 'If Mars is nearby, compare their colors',
      },
    },
    {
      id: 'polaris',
      name: 'Polaris',
      kind: 'star',
      image: require('../assets/polaris.webp'),
      didYouKnow:
        'Polaris sits almost directly above Earth’s north pole and has guided travelers for centuries.',
      visibility: '100% (Northern Hemisphere)',
      observe: {
        bestTime: 'Any clear night of the year',
        conditions: 'Visible even with light pollution',
        telescope:
          'Visible to the naked eye; telescope reveals it’s a multiple star system',
        bonusTip: 'Use the pointer stars of the Big Dipper to find it',
      },
    },
  
    /* ----------------- CONSTELLATIONS ---------------- */
    {
      id: 'orion',
      name: 'Orion',
      kind: 'constellation',
      image: require('../assets/orion.webp'),
      didYouKnow:
        'Orion is one of the easiest constellations to spot. His “belt” — three stars in a row — is famous worldwide.',
      visibility: '95% (excellent in winter)',
      observe: {
        bestTime: 'December to February, 8–11 PM',
        conditions: 'Any clear night away from city lights',
        telescope: 'Use binoculars to explore the Orion Nebula (M42) below the belt',
        bonusTip: 'Face south in winter — Orion dominates the sky',
      },
    },
    {
      id: 'ursa_major',
      name: 'Ursa Major',
      kind: 'constellation',
      image: require('../assets/ursa_major.webp'),
      didYouKnow:
        'The famous Big Dipper is part of Ursa Major and is a great guide to Polaris and many other stars.',
      visibility: '100% (circumpolar in Northern Hemisphere)',
      observe: {
        bestTime: 'Spring to summer, all night',
        conditions: 'Even partial visibility is enough',
        telescope: 'Look at the double star Mizar & Alcor in the handle',
        bonusTip: 'Use the bowl stars to point toward Polaris',
      },
    },
    {
      id: 'cassiopeia',
      name: 'Cassiopeia',
      kind: 'constellation',
      image: require('../assets/cassiopeia.webp'),
      didYouKnow:
        'Cassiopeia’s W-shape is unmistakable. In mythology she is a queen; in the sky — a perfect landmark.',
      visibility: '100% (circumpolar in Northern Hemisphere)',
      observe: {
        bestTime: 'Autumn through winter',
        conditions: 'Clear skies, preferably moonless',
        telescope: 'Binoculars show scattered stars and faint open clusters',
        bonusTip: 'Opposite the Big Dipper across Polaris',
      },
    },
    {
      id: 'scorpius',
      name: 'Scorpius',
      kind: 'constellation',
      image: require('../assets/scorpius.webp'),
      didYouKnow:
        'Scorpius is a summer constellation with a distinct hook shape; its heart is the red star Antares.',
      visibility: '70% (lower in Northern Hemisphere)',
      observe: {
        bestTime: 'June to August, low in the southern sky',
        conditions: 'Dark horizon, little light pollution',
        telescope: 'Focus on Antares or nearby globular cluster M4',
        bonusTip: 'Look low toward the south around 10 PM in midsummer',
      },
    },
    {
      id: 'lyra',
      name: 'Lyra',
      kind: 'constellation',
      image: require('../assets/lyra.webp'),
      didYouKnow:
        'Lyra is a small but important constellation. Its brightest star, Vega, is part of the Summer Triangle.',
      visibility: '90%',
      observe: {
        bestTime: 'July to September',
        conditions: 'Dark skies for faint stars',
        telescope: 'Use binoculars to spot the Ring Nebula (M57)',
        bonusTip:
          'Vega is the anchor — look for a small parallelogram nearby (that’s Lyra)',
      },
    },
  
    /* -------------------- PLANETS -------------------- */
    {
      id: 'jupiter',
      name: 'Jupiter',
      kind: 'planet',
      image: require('../assets/jupiter.webp'),
      didYouKnow:
        'Jupiter is the largest planet. Even in a small telescope, you can see its four largest moons — the Galilean satellites.',
      visibility: '90% (seasonal)',
      observe: {
        bestTime: 'August to November, around midnight',
        conditions: 'Clear skies, low humidity',
        telescope: 'Any small telescope; binoculars may show moons',
        bonusTip: 'Look southeast; appears as a very bright yellowish “star”',
      },
    },
    {
      id: 'saturn',
      name: 'Saturn',
      kind: 'planet',
      image: require('../assets/saturn.webp'),
      didYouKnow:
        'Saturn’s rings are visible in most backyard telescopes — like a tiny golden disc with ears.',
      visibility: '80%',
      observe: {
        bestTime: 'August to October, after dusk',
        conditions: 'Steady air (try just before midnight)',
        telescope: 'Minimum 60 mm refractor to see rings',
        bonusTip: 'Observe over several nights to see moon movement',
      },
    },
    {
      id: 'mars',
      name: 'Mars',
      kind: 'planet',
      image: require('../assets/mars.webp'),
      didYouKnow:
        'Mars looks reddish due to iron oxide (rust) on its surface. Near opposition it becomes one of the brightest objects.',
      visibility: 'Varies (40%–90%)',
      observe: {
        bestTime: 'Near opposition (next: January 2027)',
        conditions: 'Very clear air, high elevation',
        telescope: '100 mm+ to see polar caps or surface shading',
        bonusTip: 'Reddish hue helps identify it easily, even without a telescope',
      },
    },
    {
      id: 'venus',
      name: 'Venus',
      kind: 'planet',
      image: require('../assets/venus.webp'),
      didYouKnow:
        'Venus is the third-brightest object in the sky after the Sun and Moon. Visible just after sunset or before sunrise.',
      visibility: '100% (when in view)',
      observe: {
        bestTime: 'Twilight hours — just before sunrise or just after sunset',
        conditions: 'Clear western or eastern horizon',
        telescope: 'Shows phases like the Moon in small scopes',
        bonusTip: 'Never look for it when the Sun is up — risk of eye injury',
      },
    },
    {
      id: 'mercury',
      name: 'Mercury',
      kind: 'planet',
      image: require('../assets/mercury.webp'),
      didYouKnow:
        'Mercury is the hardest naked-eye planet to see as it stays close to the Sun — catching it is a thrill.',
      visibility: '30–50% (brief windows)',
      observe: {
        bestTime:
          'About 30 minutes after sunset or before sunrise during elongation',
        conditions: 'Very clear horizon, no obstructions',
        telescope: 'Shows phases in small scopes',
        bonusTip: 'Use astronomy apps to know when elongation occurs',
      },
    },
  ];
  
  // Утилиты (по желанию)
  export const findById = (id) => ASTRO_OBJECTS.find((o) => o.id === id);
  export const listByKind = (kind) => ASTRO_OBJECTS.filter((o) => o.kind === kind);
  