import { useState } from 'react';
import MultiStepForm from './components/MultiStepForm';
import AIOutput from './components/AIOutput';

const AI_SERVICE_URL = import.meta.env.VITE_AI_URL || 'http://localhost:5000';

export default function App() {
  const [briefData, setBriefData] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (formData) => {
    setBriefData(formData);
    setIsLoading(true);

    try {
      // Call the real AI microservice
      const response = await fetch(`${AI_SERVICE_URL}/generate/copy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: `${formData.clientName} - ${formData.campaignObjective} campaign`,
          tone: formData.tone,
          platform: 'advertising',
          word_limit: 150,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate copy');
      }

      const aiCopy = await response.json();
      const mockAIResponse = generateMockAIResponse(formData, aiCopy);
      setAiResult(mockAIResponse);
    } catch (error) {
      console.error('AI API Error:', error);
      // Fallback to mock response
      const mockAIResponse = generateMockAIResponse(formData);
      setAiResult(mockAIResponse);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setBriefData(null);
    setAiResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">AI Creative Brief Builder</h1>
              <p className="text-sm text-gray-500">Generate professional campaign briefs with AI</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        {!aiResult ? (
          <MultiStepForm onSubmit={handleFormSubmit} isLoading={isLoading} />
        ) : (
          <AIOutput result={aiResult} briefData={briefData} onReset={handleReset} />
        )}
      </main>
    </div>
  );
}

// Mock AI response generator with real option
function generateMockAIResponse(formData, aiCopy = null) {
  return {
    campaignTitle: `${formData.clientName} - ${formData.campaignObjective.charAt(0).toUpperCase() + formData.campaignObjective.slice(1)} Campaign`,
    headlines: aiCopy?.data?.headline ? [
      aiCopy.data.headline,
      `Transform Your ${formData.industry} Experience`,
      `Leading ${formData.industry} Innovation`
    ] : [
      `Discover the Future of ${formData.industry} with ${formData.clientName}`,
      `Transform Your Experience: ${formData.clientName} Leads the Way`,
      `Why Top ${formData.industry} Leaders Choose ${formData.clientName}`,
    ],
    toneOfVoice: {
      primary: formData.tone || 'Professional',
      characteristics: ['Confident', 'Innovative', 'Trustworthy'],
      description: `The campaign should communicate with a ${formData.tone || 'professional'} voice that resonates with ${formData.targetAudience}. Messaging should be clear, compelling, and action-oriented.`,
    },
    channelRecommendations: [
      { channel: 'Social Media (LinkedIn, Instagram)', allocation: 35 },
      { channel: 'Programmatic Display', allocation: 25 },
      { channel: 'Search (Google Ads)', allocation: 20 },
      { channel: 'Video (YouTube)', allocation: 15 },
      { channel: 'Native Advertising', allocation: 5 },
    ],
    heroImageConcept: {
      description: `A dynamic visual featuring ${formData.industry.toLowerCase()} elements that embody innovation and progress. The composition should include modern design elements with the brand colors prominently featured. Consider using a ${formData.imageryStyle || 'lifestyle'} photography approach with authentic, relatable subjects.`,
      colorPalette: ['#ED751D', '#1F2937', '#F3F4F6', '#10B981'],
      style: formData.imageryStyle || 'Lifestyle photography',
    },
    keyMessages: [
      'Industry-leading innovation',
      'Customer-centric approach',
      'Measurable results',
      'Trusted by professionals',
    ],
    callToAction: formData.campaignObjective === 'awareness' 
      ? 'Learn More' 
      : formData.campaignObjective === 'conversion' 
        ? 'Get Started Today' 
        : 'Discover More',
    budget: formData.budget,
    timeline: `${formData.startDate || 'Q1 2024'} - Campaign Launch`,
  };
}
