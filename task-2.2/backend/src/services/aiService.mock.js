import logger from '../utils/logger.js';

// Mock AI Service for Development (without OpenAI API)
// This generates realistic-looking ad copy without needing API keys

const mockHeadlines = {
  beauty: [
    "Transform Your Skin Today",
    "Radiant Beauty Starts Here",
    "Discover Your Natural Glow",
    "Flawless Skin, Proven Results",
    "Beauty Beyond Your Imagination",
  ],
  tech: [
    "Innovation at Your Fingertips",
    "Revolutionize Your Workflow",
    "The Future is Here",
    "Power Your Success",
    "Technology That Works",
  ],
  ecommerce: [
    "Shop Smart, Save More",
    "Unexpected Savings Await",
    "Quality You Can Trust",
    "Your Favorite Brands, One Place",
    "Easy Shopping, Great Deals",
  ],
};

const mockBodies = {
  beauty: [
    "Our scientifically-formulated serum combines natural ingredients with cutting-edge technology to deliver visible results in just 7 days. Join thousands of satisfied customers experiencing their best skin yet.",
    "Experience the difference quality makes. Our dermatologist-tested products are gentle on your skin while delivering powerful results. Invest in yourself today.",
  ],
  tech: [
    "Streamline your workflow with our intelligent platform. Automate repetitive tasks, save hours every week, and focus on what matters most.",
    "Built for teams that want more. Collaborate seamlessly, track progress effortlessly, and achieve your goals faster than ever before.",
  ],
  ecommerce: [
    "Discover thousands of products at unbeatable prices. Free shipping on orders over $50. Plus, enjoy exclusive member deals every week.",
    "Shop with confidence. All products are verified, guaranteed authentic, and backed by our satisfaction promise.",
  ],
};

const mockCTAs = [
  "Shop Now",
  "Get Started Today",
  "Learn More",
  "Claim Your Deal",
  "Join Us",
  "Explore Now",
  "Try Free",
  "Get Access",
];

const mockCaptions = {
  instagram: [
    "✨ Summer just got better! 🌟 Limited time offer - grab yours before they're gone! #ad",
    "Your new favorite find just dropped 🎉 Don't miss out on this exclusive deal! #shop",
  ],
  tiktok: [
    "POV: You finally found what you've been looking for 💯 Shop now! #foryoupage",
    "Not you still sleeping on this 😴 Time to upgrade your life! #trending",
  ],
  facebook: [
    "Amazing savings alert! 🛍️ Check out our latest collection and save up to 50%.",
    "Your friends are already enjoying these benefits. Why wait? Learn more today!",
  ],
};

const mockHashtags = [
  "#trending",
  "#mustshop",
  "#limited",
  "#bestseller",
  "#exclusive",
  "#dealsoftheday",
  "#shopnow",
  "#quality",
  "#authentic",
  "#foryou",
];

/**
 * Generate advertising copy (Mock)
 */
export async function generateCopy({ product, tone, platform, word_limit = 100 }) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const category = detectCategory(product);
  const headlines = mockHeadlines[category] || mockHeadlines.ecommerce;
  const bodies = mockBodies[category] || mockBodies.ecommerce;

  const headline = headlines[Math.floor(Math.random() * headlines.length)];
  const body = bodies[Math.floor(Math.random() * bodies.length)];
  const cta = mockCTAs[Math.floor(Math.random() * mockCTAs.length)];

  logger.info('Copy generated successfully', { product, platform });

  return {
    headline,
    body,
    cta,
    tone: tone || 'professional',
    platform: platform || 'web',
  };
}

/**
 * Generate social media content (Mock)
 */
export async function generateSocial({ platform, campaign_goal, brand_voice }) {
  await new Promise(resolve => setTimeout(resolve, 500));

  const captions = mockCaptions[platform.toLowerCase()] || [
    "Check this out! Limited time offer just for you.",
    "Don't miss out on this amazing opportunity!",
  ];

  const options = [];
  for (let i = 0; i < 5; i++) {
    options.push({
      id: i + 1,
      caption: captions[Math.floor(Math.random() * captions.length)],
      engagementScore: Math.floor(Math.random() * 100),
    });
  }

  logger.info('Social content generated', { platform, campaign_goal });

  return {
    platform,
    goal: campaign_goal,
    voice: brand_voice,
    options,
  };
}

/**
 * Generate hashtags (Mock)
 */
export async function generateHashtags({ content, industry }) {
  await new Promise(resolve => setTimeout(resolve, 300));

  const hashtags = [];
  const baseHashtags = mockHashtags;

  for (let i = 0; i < 10; i++) {
    hashtags.push(baseHashtags[Math.floor(Math.random() * baseHashtags.length)]);
  }

  // Remove duplicates
  const unique = [...new Set(hashtags)];

  logger.info('Hashtags generated', { industry, count: unique.length });

  return {
    hashtags: unique.slice(0, 10),
    industry,
    relevance: 'high',
  };
}

/**
 * Stream copy generation (Server-Sent Events)
 */
export async function streamCopy(req, res, { product, tone, platform, word_limit }) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Send opening bracket
  res.write('data: {"streaming": true, "chunks": [\n');

  // Simulate streaming chunks
  const chunks = [
    `{"type": "headline", "content": "Crafting the perfect headline..."}`,
    `{"type": "body", "content": "Generating compelling copy..."}`,
    `{"type": "cta", "content": "Finding the perfect call-to-action..."}`,
  ];

  for (let i = 0; i < chunks.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 300));
    res.write(`${chunks[i]}${i < chunks.length - 1 ? ',' : ''}\n`);
  }

  // Send final result
  const result = await generateCopy({ product, tone, platform, word_limit });
  res.write(`${JSON.stringify({ type: "complete", content: result })}\n`);
  res.write('data: ]}\n\n');
  res.end();
}

/**
 * Helper: Detect product category
 */
function detectCategory(product) {
  const lower = product.toLowerCase();
  if (lower.includes('beauty') || lower.includes('skin') || lower.includes('cosmetic')) {
    return 'beauty';
  }
  if (lower.includes('tech') || lower.includes('software') || lower.includes('app')) {
    return 'tech';
  }
  return 'ecommerce';
}

export default {
  generateCopy,
  generateSocial,
  generateHashtags,
  streamCopy,
};
