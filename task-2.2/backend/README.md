# AI Content Generation Microservice

A standalone microservice that generates advertising copy using Large Language Models (LLM).

## Features

- **Copy Generation**: Generate headlines, body copy, and CTAs
- **Social Content**: Platform-specific content for Instagram, LinkedIn, Twitter, Facebook
- **Hashtag Generation**: Generate relevant hashtags categorized by reach
- **Streaming Support**: SSE streaming for real-time copy generation

## Endpoints

### Health Check
```
GET /health
```

### Generate Copy
```
POST /generate/copy
Content-Type: application/json

{
  "product": "Product name",
  "tone": "professional|friendly|bold|playful",
  "platform": "google|facebook|instagram|linkedin",
  "word_limit": 100
}
```

### Generate Social Content
```
POST /generate/social
Content-Type: application/json

{
  "platform": "instagram|linkedin|twitter|facebook",
  "campaign_goal": "Campaign objective",
  "brand_voice": "Brand voice description"
}
```

### Generate Hashtags
```
POST /generate/hashtags
Content-Type: application/json

{
  "content": "Content to generate hashtags for",
  "industry": "Industry/niche"
}
```

### Stream Copy (SSE)
```
POST /generate/copy/stream
Content-Type: application/json

{
  "product": "Product name",
  "tone": "professional",
  "platform": "facebook",
  "word_limit": 100
}
```

## Setup

1. Copy `.env.example` to `.env`
2. Add your OpenAI API key
3. Run with Docker or npm

### Docker
```bash
docker-compose up -d
```

### npm
```bash
npm install
npm run dev
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| OPENAI_API_KEY | OpenAI API key | Yes |
| PORT | Server port (default: 3003) | No |
| NODE_ENV | Environment | No |
| LOG_LEVEL | Logging level | No |
