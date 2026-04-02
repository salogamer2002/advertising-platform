import logger from '../utils/logger.js';

let openai = null;

// Try to initialize OpenAI, fall back to mock if API key not provided
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-your-openai-api-key') {
  try {
    const OpenAI = await import('openai').then(m => m.default);
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    logger.info('OpenAI initialized with API key');
  } catch (err) {
    logger.warn('OpenAI initialization failed, using mock AI service');
  }
} else {
  logger.info('No OpenAI API key provided, using mock AI service');
}

/**
 * Generate advertising copy
 * @param {Object} params - Generation parameters
 * @param {string} params.product - Product/service name
 * @param {string} params.tone - Tone of voice
 * @param {string} params.platform - Target platform
 * @param {number} params.word_limit - Maximum word count
 * @returns {Object} Generated copy with headline and body
 */
export async function generateCopy({ product, tone, platform, word_limit = 100 }) {
  if (!openai) {
    // Use mock AI service
    return generateCopyMock({ product, tone, platform, word_limit });
  }

  const systemPrompt = `You are an expert advertising copywriter. Generate compelling ad copy that is:
- Engaging and action-oriented
- Appropriate for the specified platform
- Within the word limit
- Matching the requested tone

Return JSON with format: { "headline": "...", "body": "...", "cta": "..." }`;

  const userPrompt = `Create advertising copy for:
Product: ${product}
Tone: ${tone}
Platform: ${platform}
Word Limit: ${word_limit} words for body text

Generate a catchy headline, compelling body copy, and a call-to-action.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: 500,
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(completion.choices[0].message.content);
    logger.info('Copy generated successfully', { product, platform });
    return result;
  } catch (error) {
    logger.error('Error generating copy', { error: error.message, product });
    // Fall back to mock if API fails
    return generateCopyMock({ product, tone, platform, word_limit });
  }
}

/**
 * Mock copy generation
 */
function generateCopyMock({ product, tone, platform, word_limit }) {
  const mockHeadlines = [
    "Transform Your Experience Today",
    "Discover What You've Been Missing",
    "Revolutionize Your Routine",
    "Quality Meets Innovation",
    "Your Success Starts Here",
  ];

  const mockBodies = [
    "Our expertly-crafted solution combines proven techniques with modern innovation. Join thousands of satisfied customers experiencing real results.",
    "Designed with you in mind. Our premium offering delivers exceptional value and quality that speaks for itself.",
  ];

  const mockCTAs = ["Shop Now", "Get Started", "Learn More", "Claim Your Deal", "Get Access"];

  return {
    headline: mockHeadlines[Math.floor(Math.random() * mockHeadlines.length)],
    body: mockBodies[Math.floor(Math.random() * mockBodies.length)],
    cta: mockCTAs[Math.floor(Math.random() * mockCTAs.length)],
    tone: tone || 'professional',
    platform: platform || 'web',
  };
}

/**
 * Generate social media content
 * @param {Object} params - Generation parameters
 * @param {string} params.platform - Social platform (instagram, linkedin, twitter, facebook)
 * @param {string} params.campaign_goal - Campaign objective
 * @param {string} params.brand_voice - Brand voice description
 * @returns {Object} Generated social content with 5 caption options
 */
export async function generateSocial({ platform, campaign_goal, brand_voice }) {
  if (!openai) {
    return generateSocialMock({ platform, campaign_goal, brand_voice });
  }

  const platformGuidelines = {
    instagram: 'Use emojis, hashtags (5-10 relevant ones), keep it visual and engaging. Max 2200 chars but aim for 125-150 for feed.',
    linkedin: 'Professional tone, thought leadership, include industry insights. Can be longer, 1300+ chars for engagement.',
    twitter: 'Concise (280 chars max), witty, use 1-2 hashtags max, encourage engagement.',
    facebook: 'Conversational, can be longer, encourage comments and shares, question-based posts work well.',
  };

  const systemPrompt = `You are a social media content expert. Generate engaging content for ${platform}.
Guidelines: ${platformGuidelines[platform] || 'Create engaging content appropriate for the platform.'}

Return JSON with format: { "captions": ["caption1", "caption2", "caption3", "caption4", "caption5"] }`;

  const userPrompt = `Create 5 different ${platform} caption options for:
Campaign Goal: ${campaign_goal}
Brand Voice: ${brand_voice}

Each caption should be unique in approach but consistent with the brand voice.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.9,
      max_tokens: 1000,
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(completion.choices[0].message.content);
    logger.info('Social content generated successfully', { platform, campaign_goal });
    return result;
  } catch (error) {
    logger.error('Error generating social content', { error: error.message, platform });
    return generateSocialMock({ platform, campaign_goal, brand_voice });
  }
}

/**
 * Mock social content generation
 */
function generateSocialMock({ platform, campaign_goal, brand_voice }) {
  const captions = [
    "✨ New collection just dropped! 🎉 Don't miss out on this exclusive offer!",
    "Your new favorite is here 💯 Limited time only - shop now!",
    "POV: You finally found what you were looking for 🌟",
    "Join thousands thriving with us 🚀 Be part of the movement today!",
    "Simple solution, amazing results 💪 Transform your life now!",
  ];

  return {
    captions: captions.map((caption, i) => ({
      option: i + 1,
      text: caption,
      engagementScore: Math.floor(Math.random() * 100) + 50,
      platform: platform,
    })),
    goal: campaign_goal,
    voice: brand_voice,
  };
}

/**
 * Generate relevant hashtags
 * @param {Object} params - Generation parameters
 * @param {string} params.content - Content to generate hashtags for
 * @param {string} params.industry - Industry/niche
 * @returns {Object} Array of 10 relevant hashtags
 */
export async function generateHashtags({ content, industry }) {
  if (!openai) {
    return generateHashtagsMock({ content, industry });
  }

  const systemPrompt = `You are a social media hashtag expert. Generate relevant, high-performing hashtags.
Include a mix of:
- High volume popular hashtags
- Medium volume niche hashtags
- Low volume but highly targeted hashtags

Return JSON with format: { "hashtags": ["#tag1", "#tag2", ...], "categories": { "popular": [...], "niche": [...], "targeted": [...] } }`;

  const userPrompt = `Generate 10 relevant hashtags for:
Content: ${content}
Industry: ${industry}

Provide a mix of hashtag types for maximum reach and engagement.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 300,
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(completion.choices[0].message.content);
    logger.info('Hashtags generated successfully', { industry });
    return result;
  } catch (error) {
    logger.error('Error generating hashtags', { error: error.message, industry });
    return generateHashtagsMock({ content, industry });
  }
}

/**
 * Mock hashtags generation
 */
function generateHashtagsMock({ content, industry }) {
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

  return {
    hashtags: mockHashtags.slice(0, 10),
    industry: industry,
    relevance: 'high',
    categories: {
      popular: mockHashtags.slice(0, 3),
      niche: mockHashtags.slice(3, 7),
      targeted: mockHashtags.slice(7, 10),
    },
  };
}

/**
 * Stream copy generation using SSE
 * @param {Object} params - Generation parameters
 * @param {Function} onChunk - Callback for each chunk
 */
export async function streamCopy({ product, tone, platform, word_limit = 100 }, onChunk) {
  if (!openai) {
    return streamCopyMock({ product, tone, platform, word_limit }, onChunk);
  }

  const systemPrompt = `You are an expert advertising copywriter. Generate compelling ad copy for ${platform} in a ${tone} tone for: ${product}. Keep body under ${word_limit} words.`;

  try {
    const stream = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Write an engaging headline and body copy for ${product}.` },
      ],
      temperature: 0.8,
      max_tokens: 500,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        onChunk(content);
      }
    }
  } catch (error) {
    logger.error('Error in streaming copy', { error: error.message });
    return streamCopyMock({ product, tone, platform, word_limit }, onChunk);
  }
}

/**
 * Mock streaming copy
 */
async function streamCopyMock({ product, tone, platform, word_limit }, onChunk) {
  const chunks = [
    "Headline: ",
    "Transform Your ",
    product,
    " Today\n\n",
    "Body: ",
    "Discover the perfect ",
    product,
    " that matches your ",
    tone,
    " style. ",
    "Our expertly-crafted solution delivers results.",
    "\n\nCTA: Shop Now",
  ];

  for (const chunk of chunks) {
    await new Promise(resolve => setTimeout(resolve, 100));
    onChunk(chunk);
  }
}
