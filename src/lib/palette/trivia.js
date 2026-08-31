// Public command-palette content: a small set of constellation facts. Selecting
// one sends you to the hero with ?find=<id>, which centres the sky on that
// figure and draws it in. `id` matches the IAU abbreviations in
// constellation-names.json / the hero data.

export const trivia = [
  { id: 'Ori', name: 'Orion', fact: 'The Hunter. Betelgeuse and Rigel mark his shoulder and foot; the three belt stars line up almost perfectly.' },
  { id: 'UMa', name: 'Ursa Major', fact: 'The Great Bear. Its seven brightest stars form the Plough, which points the way to Polaris.' },
  { id: 'Cas', name: 'Cassiopeia', fact: 'The vain queen, tied to her throne. A clear W (or M) of five stars opposite the Plough.' },
  { id: 'Cyg', name: 'Cygnus', fact: 'The Swan, flying down the Milky Way. Also called the Northern Cross; Deneb is its tail.' },
  { id: 'Sco', name: 'Scorpius', fact: 'The Scorpion that killed Orion, which is why they never share the sky. Antares is its red heart.' },
  { id: 'Cru', name: 'Crux', fact: 'The Southern Cross. Smallest of all 88 constellations, and a pointer to the south celestial pole.' },
  { id: 'Leo', name: 'Leo', fact: 'The Lion. The backwards question mark of the Sickle traces its mane; Regulus sits at the base.' },
  { id: 'Lyr', name: 'Lyra', fact: 'The Lyre of Orpheus. Small, but holds Vega, one of the brightest stars in the northern sky.' },
  { id: 'Tau', name: 'Taurus', fact: 'The Bull. The V-shaped Hyades form its face, with orange Aldebaran as the eye; the Pleiades ride its shoulder.' },
  { id: 'Gem', name: 'Gemini', fact: 'The Twins, Castor and Pollux, named after its two brightest stars.' },
  { id: 'Peg', name: 'Pegasus', fact: 'The winged horse. Three of its stars plus one borrowed from Andromeda form the Great Square.' },
  { id: 'Aql', name: 'Aquila', fact: 'The Eagle that carried Zeus’s thunderbolts. Altair, its brightest star, is one corner of the Summer Triangle.' },
  { id: 'Sgr', name: 'Sagittarius', fact: 'The Archer. Its central stars form the Teapot; steam from the spout points at the galactic centre.' },
  { id: 'And', name: 'Andromeda', fact: 'The chained princess. Under dark skies you can see the Andromeda Galaxy as a faint smudge near her hip.' },
  { id: 'Boo', name: 'Boötes', fact: 'The Herdsman, a kite-shaped figure driving the bears around the pole. Arcturus is its base.' },
  { id: 'Dra', name: 'Draco', fact: 'The Dragon, winding between the two bears. Thuban, in its tail, was the pole star for the pyramid builders.' }
];
