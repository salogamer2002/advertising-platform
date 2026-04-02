import { useState } from 'react';

const STEPS = [
  { id: 1, title: 'Client Details', description: 'Basic information' },
  { id: 2, title: 'Campaign Objective', description: 'Goals and audience' },
  { id: 3, title: 'Creative Preferences', description: 'Style and tone' },
  { id: 4, title: 'Review & Submit', description: 'Confirm details' },
];

export default function MultiStepForm({ onSubmit, isLoading }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Client Details
    clientName: '',
    industry: '',
    website: '',
    competitors: '',
    // Step 2: Campaign Objective
    campaignObjective: 'awareness',
    targetAudience: '',
    budget: '',
    // Step 3: Creative Preferences
    tone: 'professional',
    imageryStyle: 'lifestyle',
    colorDirection: '',
    dosAndDonts: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.clientName.trim()) newErrors.clientName = 'Client name is required';
      if (!formData.industry.trim()) newErrors.industry = 'Industry is required';
    }
    
    if (step === 2) {
      if (!formData.targetAudience.trim()) newErrors.targetAudience = 'Target audience is required';
      if (!formData.budget.trim()) newErrors.budget = 'Budget is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <div className="card p-8">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    currentStep >= step.id
                      ? 'bg-brand-500 text-white'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {currentStep > step.id ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.id
                  )}
                </div>
                <div className="mt-2 text-center hidden sm:block">
                  <p className={`text-sm font-medium ${currentStep >= step.id ? 'text-gray-900' : 'text-gray-400'}`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`h-1 w-16 sm:w-24 mx-2 rounded ${
                    currentStep > step.id ? 'bg-brand-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {currentStep === 1 && (
          <Step1ClientDetails formData={formData} onChange={handleChange} errors={errors} />
        )}
        {currentStep === 2 && (
          <Step2CampaignObjective formData={formData} onChange={handleChange} errors={errors} />
        )}
        {currentStep === 3 && (
          <Step3CreativePreferences formData={formData} onChange={handleChange} />
        )}
        {currentStep === 4 && (
          <Step4Review formData={formData} />
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={handleBack}
          disabled={currentStep === 1}
          className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>
        
        {currentStep < 4 ? (
          <button onClick={handleNext} className="btn-primary">
            Continue
          </button>
        ) : (
          <button 
            onClick={handleSubmit} 
            disabled={isLoading}
            className="btn-primary flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generating Brief...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generate with AI
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

// Step 1: Client Details
function Step1ClientDetails({ formData, onChange, errors }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Client Information</h2>
      <p className="text-gray-600">Tell us about the client and their business.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="input-label">Client Name *</label>
          <input
            type="text"
            name="clientName"
            value={formData.clientName}
            onChange={onChange}
            placeholder="e.g., Acme Corporation"
            className={`input ${errors.clientName ? 'border-red-500' : ''}`}
          />
          {errors.clientName && <p className="text-red-500 text-sm mt-1">{errors.clientName}</p>}
        </div>
        
        <div>
          <label className="input-label">Industry *</label>
          <select
            name="industry"
            value={formData.industry}
            onChange={onChange}
            className={`input ${errors.industry ? 'border-red-500' : ''}`}
          >
            <option value="">Select industry</option>
            <option value="Technology">Technology</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Finance">Finance</option>
            <option value="Retail">Retail</option>
            <option value="Real Estate">Real Estate</option>
            <option value="Education">Education</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Other">Other</option>
          </select>
          {errors.industry && <p className="text-red-500 text-sm mt-1">{errors.industry}</p>}
        </div>
        
        <div>
          <label className="input-label">Website</label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={onChange}
            placeholder="https://www.example.com"
            className="input"
          />
        </div>
        
        <div>
          <label className="input-label">Key Competitors</label>
          <input
            type="text"
            name="competitors"
            value={formData.competitors}
            onChange={onChange}
            placeholder="e.g., Company A, Company B"
            className="input"
          />
        </div>
      </div>
    </div>
  );
}

// Step 2: Campaign Objective
function Step2CampaignObjective({ formData, onChange, errors }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Campaign Objective</h2>
      <p className="text-gray-600">Define your campaign goals and target audience.</p>
      
      <div>
        <label className="input-label">Campaign Objective *</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { value: 'awareness', label: 'Brand Awareness', icon: '👁️' },
            { value: 'consideration', label: 'Consideration', icon: '🤔' },
            { value: 'conversion', label: 'Conversion', icon: '🎯' },
          ].map((option) => (
            <label
              key={option.value}
              className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                formData.campaignObjective === option.value
                  ? 'border-brand-500 bg-brand-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="campaignObjective"
                value={option.value}
                checked={formData.campaignObjective === option.value}
                onChange={onChange}
                className="sr-only"
              />
              <span className="text-2xl">{option.icon}</span>
              <span className="font-medium">{option.label}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div>
        <label className="input-label">Target Audience *</label>
        <textarea
          name="targetAudience"
          value={formData.targetAudience}
          onChange={onChange}
          rows={3}
          placeholder="Describe your ideal customer (demographics, interests, behaviors...)"
          className={`input ${errors.targetAudience ? 'border-red-500' : ''}`}
        />
        {errors.targetAudience && <p className="text-red-500 text-sm mt-1">{errors.targetAudience}</p>}
      </div>
      
      <div>
        <label className="input-label">Budget Range *</label>
        <select
          name="budget"
          value={formData.budget}
          onChange={onChange}
          className={`input ${errors.budget ? 'border-red-500' : ''}`}
        >
          <option value="">Select budget range</option>
          <option value="$5,000 - $10,000">$5,000 - $10,000</option>
          <option value="$10,000 - $25,000">$10,000 - $25,000</option>
          <option value="$25,000 - $50,000">$25,000 - $50,000</option>
          <option value="$50,000 - $100,000">$50,000 - $100,000</option>
          <option value="$100,000+">$100,000+</option>
        </select>
        {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget}</p>}
      </div>
    </div>
  );
}

// Step 3: Creative Preferences
function Step3CreativePreferences({ formData, onChange }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Creative Preferences</h2>
      <p className="text-gray-600">Set the tone and style for your campaign.</p>
      
      <div>
        <label className="input-label">Tone of Voice</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {['Professional', 'Friendly', 'Bold', 'Playful', 'Luxurious', 'Minimalist', 'Energetic', 'Trustworthy'].map(
            (tone) => (
              <label
                key={tone}
                className={`text-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                  formData.tone === tone.toLowerCase()
                    ? 'border-brand-500 bg-brand-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="tone"
                  value={tone.toLowerCase()}
                  checked={formData.tone === tone.toLowerCase()}
                  onChange={onChange}
                  className="sr-only"
                />
                <span className="text-sm font-medium">{tone}</span>
              </label>
            )
          )}
        </div>
      </div>
      
      <div>
        <label className="input-label">Imagery Style</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { value: 'lifestyle', label: 'Lifestyle Photography' },
            { value: 'product', label: 'Product-focused' },
            { value: 'abstract', label: 'Abstract/Artistic' },
            { value: 'illustration', label: 'Illustration' },
            { value: 'minimal', label: 'Minimal/Clean' },
            { value: 'bold', label: 'Bold/Graphic' },
          ].map((style) => (
            <label
              key={style.value}
              className={`text-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                formData.imageryStyle === style.value
                  ? 'border-brand-500 bg-brand-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="imageryStyle"
                value={style.value}
                checked={formData.imageryStyle === style.value}
                onChange={onChange}
                className="sr-only"
              />
              <span className="text-sm font-medium">{style.label}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div>
        <label className="input-label">Color Direction (optional)</label>
        <input
          type="text"
          name="colorDirection"
          value={formData.colorDirection}
          onChange={onChange}
          placeholder="e.g., Blue and white, warm tones, brand colors only"
          className="input"
        />
      </div>
      
      <div>
        <label className="input-label">Do&apos;s and Don&apos;ts (optional)</label>
        <textarea
          name="dosAndDonts"
          value={formData.dosAndDonts}
          onChange={onChange}
          rows={3}
          placeholder="Any specific guidelines, restrictions, or preferences..."
          className="input"
        />
      </div>
    </div>
  );
}

// Step 4: Review
function Step4Review({ formData }) {
  const sections = [
    {
      title: 'Client Details',
      items: [
        { label: 'Client Name', value: formData.clientName },
        { label: 'Industry', value: formData.industry },
        { label: 'Website', value: formData.website || 'Not provided' },
        { label: 'Competitors', value: formData.competitors || 'Not provided' },
      ],
    },
    {
      title: 'Campaign Objective',
      items: [
        { label: 'Objective', value: formData.campaignObjective.charAt(0).toUpperCase() + formData.campaignObjective.slice(1) },
        { label: 'Target Audience', value: formData.targetAudience },
        { label: 'Budget', value: formData.budget },
      ],
    },
    {
      title: 'Creative Preferences',
      items: [
        { label: 'Tone', value: formData.tone.charAt(0).toUpperCase() + formData.tone.slice(1) },
        { label: 'Imagery Style', value: formData.imageryStyle.charAt(0).toUpperCase() + formData.imageryStyle.slice(1) },
        { label: 'Color Direction', value: formData.colorDirection || 'Not specified' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Review Your Brief</h2>
      <p className="text-gray-600">Please review your inputs before generating the AI creative brief.</p>
      
      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.title} className="bg-gray-50 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">{section.title}</h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {section.items.map((item) => (
                <div key={item.label}>
                  <dt className="text-sm text-gray-500">{item.label}</dt>
                  <dd className="font-medium text-gray-900">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
}
