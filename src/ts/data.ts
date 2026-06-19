/**
 * Central content for the site. Editing these arrays updates the
 * characters page, packages page and the booking wizard at once.
 */

export interface Character {
  id: string;
  name: string;
  tagline: string;
  description: string;
  /** emoji used for the placeholder portrait until real photos are added */
  emoji: string;
  /** two-colour gradient for the placeholder portrait */
  colors: [string, string];
  category: 'princess' | 'character';
}

export interface Package {
  id: string;
  name: string;
  price: number;
  durationLabel: string;
  durationMins: number;
  capacity: string;
  popular?: boolean;
  includes: string[];
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
  description: string;
  /** small caveat shown wherever the add-on appears, e.g. availability */
  note?: string;
}

export const characters: Character[] = [
  {
    id: 'glass-slipper',
    name: 'The Glass Slipper Princess',
    tagline: 'A midnight ball and a perfect fit',
    description:
      'Elegant, kind and always ready to dance. Our classic ball-gown princess brings sparkle, grace and a happily-ever-after to every celebration.',
    emoji: '👑',
    colors: ['#7cb9ff', '#5b8def'],
    category: 'princess',
  },
  {
    id: 'fairest',
    name: 'The Fairest Princess',
    tagline: 'Sweetness, songbirds and forest friends',
    description:
      'Gentle and cheerful with a song for everyone. She loves apples, animals and helping the little ones feel like royalty.',
    emoji: '🍎',
    colors: ['#ffd36e', '#ff8fb1'],
    category: 'princess',
  },
  {
    id: 'long-hair',
    name: 'The Long-Haired Princess',
    tagline: 'Adventure is out there',
    description:
      'Brave, curious and full of fun. With her famous golden locks she turns story-time and party games into a grand adventure.',
    emoji: '🌸',
    colors: ['#c79bff', '#ff9ed6'],
    category: 'princess',
  },
  {
    id: 'mermaid',
    name: 'The Mermaid Princess',
    tagline: 'A splash of under-the-sea magic',
    description:
      'Adventurous and dreamy, our teal-tailed princess brings ocean wonder, sing-alongs and treasure-hunt games to the party.',
    emoji: '🧜‍♀️',
    colors: ['#34d6c2', '#2aa0d6'],
    category: 'princess',
  },
  {
    id: 'ice-queen',
    name: 'The Ice Queen',
    tagline: 'Let it snow, let it glow',
    description:
      'Regal and warm-hearted, the Ice Queen brings frosty magic, her signature songs and plenty of sparkle to winter wonderlands.',
    emoji: '❄️',
    colors: ['#8fd3ff', '#b89bff'],
    category: 'princess',
  },
  {
    id: 'fashion-doll',
    name: 'The Fashion Doll',
    tagline: 'Pink, playful and full of dreams',
    description:
      'Fun, confident and fabulous. The Fashion Doll loves dancing, dress-up and reminding everyone they can be anything.',
    emoji: '💖',
    colors: ['#ff7ec0', '#ff4f9e'],
    category: 'princess',
  },
  {
    id: 'skye',
    name: 'Skye the K-Pop Superfan',
    tagline: 'Big beats and bigger energy',
    description:
      'A modern party host with dance routines, sing-alongs and non-stop energy for older children who love pop and performing.',
    emoji: '🎤',
    colors: ['#a78bfa', '#f472b6'],
    category: 'character',
  },
  {
    id: 'spider-hero',
    name: 'The Spider Hero',
    tagline: 'With great parties come great power',
    description:
      'Friendly neighbourhood fun with hero training, games and photos. A favourite for super-powered celebrations.',
    emoji: '🕷️',
    colors: ['#ef4444', '#3b82f6'],
    category: 'character',
  },
  {
    id: 'snow-friend',
    name: 'The Snow Friend',
    tagline: 'Warm hugs in any weather',
    description:
      'A jolly, huggable festive favourite. Perfect for winter events, grottos and Christmas celebrations.',
    emoji: '⛄',
    colors: ['#bae6fd', '#fcd34d'],
    category: 'character',
  },
];

export const packages: Package[] = [
  {
    id: '30-min',
    name: '30 Minute Visit',
    price: 80,
    durationLabel: '30 minutes',
    durationMins: 30,
    capacity: 'Perfect for small gatherings',
    includes: [
      'Choice of any character',
      'Royal coronation with a special gift',
      'Singing & dancing',
      'A magical wish',
      'Enchanting story-time',
      'Photos with your character',
      'Glitter tattoos (groups of 5 & under)',
    ],
  },
  {
    id: '1-hour',
    name: '1 Hour Party',
    price: 140,
    durationLabel: '1 hour',
    durationMins: 60,
    capacity: 'Up to 25 children',
    popular: true,
    includes: [
      'Choice of any character',
      'Full interactive entertainment',
      'Royal coronation with a special gift',
      'Classic party games',
      'Singing & dancing',
      'A magical wish',
      'Enchanting story-time',
      'Photos with your character',
      'Glitter tattoos for smaller groups',
    ],
  },
  {
    id: '90-min',
    name: '90 Minute Party',
    price: 175,
    durationLabel: '90 minutes',
    durationMins: 90,
    capacity: 'Up to 25 children',
    includes: [
      'Choice of any character',
      'Full interactive entertainment',
      'Royal coronation with a special gift',
      'Classic party games',
      'Singing & dancing',
      'A magical wish',
      'Enchanting story-time',
      'Photos with your character',
      'Glitter tattoos while children eat',
    ],
  },
  {
    id: '2-hour',
    name: '2 Hour Party',
    price: 210,
    durationLabel: '2 hours',
    durationMins: 120,
    capacity: 'Up to 25 children',
    includes: [
      'Choice of any character',
      'Extended interactive entertainment',
      'Royal coronation with a special gift',
      'Expanded party games',
      'Singing & dancing',
      'A magical wish',
      'Enchanting story-time',
      'Photos with your character',
      'Glitter tattoos during meal time',
    ],
  },
];

export const addOns: AddOn[] = [
  {
    id: 'extra-character',
    name: 'Additional Character',
    price: 80,
    description: 'A second performer joins for double the magic.',
    note: 'Subject to performer availability — confirmed by email.',
  },
  {
    id: 'extra-30',
    name: 'Extra 30 Minutes',
    price: 45,
    description: 'Keep the celebration going a little longer.',
  },
  {
    id: 'face-painting',
    name: 'Face Painting Upgrade',
    price: 35,
    description: 'Professional face painting for all the little guests.',
  },
  {
    id: 'balloon',
    name: 'Balloon Modelling',
    price: 30,
    description: 'Balloon swords, crowns and animals to take home.',
  },
  {
    id: 'personalised-gift',
    name: 'Personalised Birthday Gift',
    price: 20,
    description: 'A keepsake gift personalised for the birthday child.',
  },
];

export const contactDetails = {
  phone: '07766 698668',
  phoneHref: 'tel:+447766698668',
  email: 'lucysprincessparties@gmail.com',
  area: 'Suffolk & Essex',
};

export const formatGBP = (n: number): string => `£${n.toLocaleString('en-GB')}`;
