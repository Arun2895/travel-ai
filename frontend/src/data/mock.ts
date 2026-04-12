import { Thread, ToolStep, ExtractedParams, ItineraryDay } from '../types';

export const MOCK_THREADS: Thread[] = [
  {
    id: 'thread_a82f',
    title: '3 days in Tokyo',
    date: 'Today',
    messages: [],
  },
  {
    id: 'thread_c41d',
    title: 'Bali honeymoon itinerary',
    date: 'Yesterday',
    messages: [],
  },
  {
    id: 'thread_e90b',
    title: 'Paris solo trip, budget',
    date: '3 days ago',
    messages: [],
  },
  {
    id: 'thread_b12a',
    title: 'NYC layover 6 hours',
    date: 'Last week',
    messages: [],
  },
];

export const SUGGESTIONS = [
  {
    icon: '💡',
    text: 'Provide the place you are looking to stay, alongside budget accurately for more clearer and fair evaluations.',
    label: 'Specific Location & Budget Evaluation',
  },
  {
    icon: '🌴',
    text: 'Romantic 7-day honeymoon in Bali with beachfront hotels and sunset dinners.',
    label: 'Bali honeymoon, 7 days',
  },
  {
    icon: '🗽',
    text: 'Budget solo trip to Paris for 5 days. Include free attractions and cheap eats.',
    label: 'Paris solo, budget travel',
  },
  {
    icon: '🎨',
    text: 'Weekend city break in Barcelona with tapas tours and architectural highlights.',
    label: 'Barcelona weekend, tapas & art',
  },
];

export const DEMO_TOOL_STEPS: ToolStep[] = [
  {
    id: '1',
    name: 'search_hotels',
    description: 'Found 8 hotels in Tokyo matching budget ¥15,000–¥25,000/night',
    status: 'done',
  },
  {
    id: '2',
    name: 'find_attractions',
    description: 'Fetched top 12 cultural sites near Shinjuku & Asakusa',
    status: 'done',
  },
  {
    id: '3',
    name: 'search_restaurants',
    description: 'Discovered 20+ street food spots & ramen bars',
    status: 'done',
  },
  {
    id: '4',
    name: 'build_itinerary',
    description: 'Generating day-by-day schedule...',
    status: 'active',
  },
];

export const DEMO_PARAMS: ExtractedParams = {
  location: 'Tokyo',
  duration: 3,
  travelers: 2,
  budget: 'mid-range',
  focus: ['culture', 'food'],
  thread_id: 'thread_a82f',
};

export const DEMO_ITINERARY: ItineraryDay[] = [
  {
    day: 1,
    label: 'Asakusa & Ueno',
    items: ['Senso-ji Temple', 'Nakamise St', 'Ueno Park', 'Tokyo National Museum'],
  },
  {
    day: 2,
    label: 'Shibuya & Harajuku',
    items: ['Shibuya Crossing', 'Meiji Shrine', 'Harajuku Snacks', 'Fuunji Ramen'],
  },
  {
    day: 3,
    label: 'Akihabara & Ginza',
    items: ['Akihabara', 'Tsukiji Market', 'Ginza Shopping', 'Skytree Sunset'],
  },
];

export const DEMO_AI_RESPONSE = (name: string) =>
  `Hey ${name}! 🗼\n\nI've searched hotels, attractions, and food spots in Tokyo for 2 people with a mid-range budget. Here's your personalized 3-day Tokyo trip:\n\n**Hotel Recommendation:** Shinjuku Granbell Hotel — great location near transport, ~¥18,000/night for a twin room.\n\n**Day 1 — Asakusa & Ueno:** Start at Senso-ji Temple early morning to beat crowds. Walk through Nakamise shopping street for traditional snacks. Head to Ueno Park and the Tokyo National Museum in the afternoon.\n\n**Day 2 — Shibuya & Harajuku:** The iconic Shibuya crossing, Meiji Shrine in the morning, takoyaki and taiyaki in Harajuku. Evening ramen at Fuunji (world-famous tsukemen).\n\n**Day 3 — Akihabara & Ginza:** Tech and anime culture in Akihabara, then upscale shopping and sushi at Tsukiji outer market. End with a Tokyo Skytree sunset view.\n\n**Estimated Budget:** ¥85,000–¥110,000 total for 2 people (excluding flights).`;
