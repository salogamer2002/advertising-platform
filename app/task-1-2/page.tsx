"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Zap, FileText, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const STEPS = [
  { id: 1, title: "Client Details", description: "Basic information" },
  { id: 2, title: "Campaign Objective", description: "Goals and audience" },
  { id: 3, title: "Creative Preferences", description: "Style and tone" },
  { id: 4, title: "Review & Submit", description: "Confirm details" },
];

const TONES = ["Professional", "Friendly", "Bold", "Playful", "Luxurious", "Minimalist", "Energetic", "Trustworthy"];
const IMAGERY_STYLES = [
  { value: "lifestyle", label: "Lifestyle Photography" },
  { value: "product", label: "Product-focused" },
  { value: "abstract", label: "Abstract/Artistic" },
  { value: "illustration", label: "Illustration" },
  { value: "minimal", label: "Minimal/Clean" },
  { value: "bold", label: "Bold/Graphic" },
];

interface FormData {
  clientName: string;
  industry: string;
  website: string;
  competitors: string;
  campaignObjective: string;
  targetAudience: string;
  budget: string;
  tone: string;
  imageryStyle: string;
  colorDirection: string;
  dosAndDonts: string;
}

interface AIResult {
  title: string;
  headlines: string[];
  toneGuide: string;
  channels: { name: string; percentage: number }[];
  visualDirection: string;
}

export default function Task12BriefBuilder() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AIResult | null>(null);
  const [formData, setFormData] = useState<FormData>({
    clientName: "",
    industry: "",
    website: "",
    competitors: "",
    campaignObjective: "awareness",
    targetAudience: "",
    budget: "",
    tone: "professional",
    imageryStyle: "lifestyle",
    colorDirection: "",
    dosAndDonts: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.clientName.trim()) newErrors.clientName = "Client name is required";
      if (!formData.industry.trim()) newErrors.industry = "Industry is required";
    }

    if (step === 2) {
      if (!formData.targetAudience.trim()) newErrors.targetAudience = "Target audience is required";
      if (!formData.budget.trim()) newErrors.budget = "Budget is required";
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

  const handleSubmit = async () => {
    setIsLoading(true);
    // Simulate AI API call
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // Mock AI response
    setAiResult({
      title: `${formData.clientName} ${formData.campaignObjective.charAt(0).toUpperCase() + formData.campaignObjective.slice(1)} Campaign`,
      headlines: [
        `Discover the Future of ${formData.industry}`,
        `Transform Your World with ${formData.clientName}`,
        `Experience Innovation Like Never Before`,
      ],
      toneGuide: `The campaign should maintain a ${formData.tone} voice throughout all touchpoints. Key messaging should emphasize trust, innovation, and customer-centricity. Avoid overly technical jargon and focus on emotional benefits.`,
      channels: [
        { name: "Social Media", percentage: 35 },
        { name: "Display Ads", percentage: 25 },
        { name: "Search", percentage: 20 },
        { name: "Video", percentage: 15 },
        { name: "Email", percentage: 5 },
      ],
      visualDirection: `Hero imagery should feature ${formData.imageryStyle} style visuals that resonate with the target audience (${formData.targetAudience}). ${formData.colorDirection ? `Color palette should lean towards ${formData.colorDirection}.` : "Use brand colors consistently."} Focus on authentic, relatable scenarios that highlight the product/service benefits.`,
    });

    setIsLoading(false);
  };

  const exportToPDF = () => {
    // In real implementation, would use jsPDF or html2canvas
    alert("PDF export would be triggered here. In production, this would use jsPDF or html2canvas.");
  };

  if (aiResult) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="h-4 w-4" />
            Back to Tasks
          </Link>

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">AI-Generated Creative Brief</h1>
              <p className="text-muted-foreground mt-1">Ready for review and export</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => { setAiResult(null); setCurrentStep(1); }}>
                <FileText className="h-4 w-4 mr-2" />
                New Brief
              </Button>
              <Button onClick={exportToPDF}>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            {/* Campaign Title */}
            <Card>
              <CardHeader className="bg-slate-900 text-white rounded-t-lg">
                <CardTitle className="text-xl">{aiResult.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-muted-foreground">Client:</span> <span className="font-medium">{formData.clientName}</span></div>
                  <div><span className="text-muted-foreground">Industry:</span> <span className="font-medium">{formData.industry}</span></div>
                  <div><span className="text-muted-foreground">Objective:</span> <span className="font-medium capitalize">{formData.campaignObjective}</span></div>
                  <div><span className="text-muted-foreground">Budget:</span> <span className="font-medium">{formData.budget}</span></div>
                </div>
              </CardContent>
            </Card>

            {/* Headlines */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Headline Options</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3">
                  {aiResult.headlines.map((headline, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm font-medium">{idx + 1}</span>
                      <span className="text-lg font-medium text-slate-800">{headline}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            {/* Tone Guide */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tone of Voice Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 leading-relaxed">{aiResult.toneGuide}</p>
              </CardContent>
            </Card>

            {/* Channel Allocation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recommended Channel Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aiResult.channels.map((channel) => (
                    <div key={channel.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{channel.name}</span>
                        <span className="text-muted-foreground">{channel.percentage}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-slate-900 rounded-full transition-all" style={{ width: `${channel.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Visual Direction */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Key Visual Direction</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 leading-relaxed">{aiResult.visualDirection}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Tasks
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">AI Creative Brief Builder</h1>
          <p className="text-muted-foreground mt-2">Fill in the campaign details and let AI generate your creative brief</p>
        </div>

        <Card className="p-8">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {STEPS.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                        currentStep >= step.id ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {currentStep > step.id ? <Check className="h-5 w-5" /> : step.id}
                    </div>
                    <div className="mt-2 text-center hidden sm:block">
                      <p className={`text-sm font-medium ${currentStep >= step.id ? "text-slate-900" : "text-slate-400"}`}>{step.title}</p>
                      <p className="text-xs text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className={`h-1 w-16 sm:w-24 mx-2 rounded ${currentStep > step.id ? "bg-slate-900" : "bg-slate-200"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="min-h-[400px]">
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900">Client Information</h2>
                <p className="text-muted-foreground">Tell us about the client and their business.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Client Name *</Label>
                    <Input value={formData.clientName} onChange={(e) => handleChange("clientName", e.target.value)} placeholder="e.g., Acme Corporation" className={errors.clientName ? "border-red-500" : ""} />
                    {errors.clientName && <p className="text-red-500 text-sm mt-1">{errors.clientName}</p>}
                  </div>
                  <div>
                    <Label>Industry *</Label>
                    <Select value={formData.industry} onValueChange={(v) => handleChange("industry", v)}>
                      <SelectTrigger className={errors.industry ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {["Technology", "Healthcare", "Finance", "Retail", "Real Estate", "Education", "Entertainment", "Other"].map((i) => (
                          <SelectItem key={i} value={i}>{i}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.industry && <p className="text-red-500 text-sm mt-1">{errors.industry}</p>}
                  </div>
                  <div>
                    <Label>Website</Label>
                    <Input value={formData.website} onChange={(e) => handleChange("website", e.target.value)} placeholder="https://www.example.com" />
                  </div>
                  <div>
                    <Label>Key Competitors</Label>
                    <Input value={formData.competitors} onChange={(e) => handleChange("competitors", e.target.value)} placeholder="e.g., Company A, Company B" />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900">Campaign Objective</h2>
                <p className="text-muted-foreground">Define your campaign goals and target audience.</p>
                <div>
                  <Label>Campaign Objective *</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                    {[
                      { value: "awareness", label: "Brand Awareness" },
                      { value: "consideration", label: "Consideration" },
                      { value: "conversion", label: "Conversion" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleChange("campaignObjective", opt.value)}
                        className={`p-4 border-2 rounded-lg text-center transition-colors ${
                          formData.campaignObjective === opt.value ? "border-slate-900 bg-slate-50" : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <span className="font-medium">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Target Audience *</Label>
                  <Textarea value={formData.targetAudience} onChange={(e) => handleChange("targetAudience", e.target.value)} placeholder="Describe your ideal customer..." className={errors.targetAudience ? "border-red-500" : ""} />
                  {errors.targetAudience && <p className="text-red-500 text-sm mt-1">{errors.targetAudience}</p>}
                </div>
                <div>
                  <Label>Budget Range *</Label>
                  <Select value={formData.budget} onValueChange={(v) => handleChange("budget", v)}>
                    <SelectTrigger className={errors.budget ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      {["$5,000 - $10,000", "$10,000 - $25,000", "$25,000 - $50,000", "$50,000 - $100,000", "$100,000+"].map((b) => (
                        <SelectItem key={b} value={b}>{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget}</p>}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900">Creative Preferences</h2>
                <p className="text-muted-foreground">Set the tone and style for your campaign.</p>
                <div>
                  <Label>Tone of Voice</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                    {TONES.map((tone) => (
                      <button
                        key={tone}
                        type="button"
                        onClick={() => handleChange("tone", tone.toLowerCase())}
                        className={`p-3 border-2 rounded-lg text-center text-sm transition-colors ${
                          formData.tone === tone.toLowerCase() ? "border-slate-900 bg-slate-50" : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {tone}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Imagery Style</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                    {IMAGERY_STYLES.map((style) => (
                      <button
                        key={style.value}
                        type="button"
                        onClick={() => handleChange("imageryStyle", style.value)}
                        className={`p-3 border-2 rounded-lg text-center text-sm transition-colors ${
                          formData.imageryStyle === style.value ? "border-slate-900 bg-slate-50" : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Color Direction (optional)</Label>
                  <Input value={formData.colorDirection} onChange={(e) => handleChange("colorDirection", e.target.value)} placeholder="e.g., Blue and white, warm tones" />
                </div>
                <div>
                  <Label>{"Do's and Don'ts (optional)"}</Label>
                  <Textarea value={formData.dosAndDonts} onChange={(e) => handleChange("dosAndDonts", e.target.value)} placeholder="Any specific guidelines..." />
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900">Review Your Brief</h2>
                <p className="text-muted-foreground">Please review your inputs before generating the AI creative brief.</p>
                <div className="space-y-6">
                  {[
                    {
                      title: "Client Details",
                      items: [
                        { label: "Client Name", value: formData.clientName },
                        { label: "Industry", value: formData.industry },
                        { label: "Website", value: formData.website || "Not provided" },
                        { label: "Competitors", value: formData.competitors || "Not provided" },
                      ],
                    },
                    {
                      title: "Campaign Objective",
                      items: [
                        { label: "Objective", value: formData.campaignObjective.charAt(0).toUpperCase() + formData.campaignObjective.slice(1) },
                        { label: "Target Audience", value: formData.targetAudience },
                        { label: "Budget", value: formData.budget },
                      ],
                    },
                    {
                      title: "Creative Preferences",
                      items: [
                        { label: "Tone", value: formData.tone.charAt(0).toUpperCase() + formData.tone.slice(1) },
                        { label: "Imagery Style", value: formData.imageryStyle.charAt(0).toUpperCase() + formData.imageryStyle.slice(1) },
                        { label: "Color Direction", value: formData.colorDirection || "Not specified" },
                      ],
                    },
                  ].map((section) => (
                    <div key={section.title} className="bg-slate-50 rounded-xl p-6">
                      <h3 className="font-semibold text-slate-900 mb-4">{section.title}</h3>
                      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {section.items.map((item) => (
                          <div key={item.label}>
                            <dt className="text-sm text-muted-foreground">{item.label}</dt>
                            <dd className="font-medium text-slate-900">{item.value}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>Back</Button>
            {currentStep < 4 ? (
              <Button onClick={handleNext}>Continue</Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating Brief...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Generate with AI
                  </>
                )}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
